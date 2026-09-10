const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Paystack Webhook - MOST IMPORTANT
app.post('/webhook/paystack', async (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }
  const event = req.body;
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    const amount = event.data.amount / 100;
    const email = event.data.customer.email;
    const trx = await Transaction.findOne({ reference, status: 'pending' });
    if (trx) {
      trx.status = 'success';
      await trx.save();
      const user = await User.findOne({ email });
      if (user) {
        user.balance += amount;
        user.totalDeposits += amount;
        await user.save();
        console.log(`CREDITED ${amount} to ${email}`);
      }
    }
  }
  res.sendStatus(200);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/paystack', require('./routes/paystack'));
app.use('/api/bets', require('./routes/bets'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req,res)=> res.send('Football.com API Running - Phase 1 - Real Payment'));

const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

let crashHistory = [1.00,1.00,1.56,1.96,5.00,3.50,1.40,10.43,5.00,1.20,39.45,2.00,100.97,19.00,1.00,1.10,1000,50.65];
function generateCrashPoint() {
  const h = crypto.randomBytes(4).readUInt32LE(0) / 4294967296;
  return Math.max(1.00, Math.floor((0.99/(1-h))*100)/100);
}
function startCrashRound() {
  const crashPoint = generateCrashPoint();
  let mult = 1.00;
  io.emit('round_start', { history: crashHistory.slice(-20) });
  const interval = setInterval(()=>{
    mult += 0.01 + (mult*0.005);
    mult = Math.floor(mult*100)/100;
    io.emit('multiplier_update', { multiplier: mult });
    if (mult >= crashPoint) {
      clearInterval(interval);
      crashHistory.push(crashPoint);
      if (crashHistory.length>50) crashHistory.shift();
      io.emit('round_crash', { crashPoint, history: crashHistory.slice(-20) });
      setTimeout(startCrashRound, 5000);
    }
  },80);
}
io.on('connection', s=> s.emit('history', crashHistory));

const PORT = process.env.PORT || 5000;
http.listen(PORT, ()=>{ console.log('Server on '+PORT); startCrashRound(); });
