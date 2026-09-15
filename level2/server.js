require('dotenv').config();
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express');
const connectDB = require('./db/db');
const app = express();
const PORT = process.env.PORT || 5000;
const User = require('./model/userModel');
const Redis = require('ioredis');

connectDB();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL)

app.get('/', (req, res) => {
  res.json({
    msg: 'Welcome to the Redis 0.1',
  });
});

app.post('/create', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(email);
  const user = await User.create({
    name,
    email,
    password,
  });

  await redis.del('user:all');
  return res.json(user);
});

app.post('/send-otp', async (req, res) => {
    const { email } = req.body

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await redis.set(`otp:${email}`, otp, 'EX',30 )

    return res.json({ otp })

})

app.get('/get', async (req, res) => {
  const user = await User.find({});
  return res.json(user);
});

app.get('/get-with-redis' , async(req , res) => {
  const cached = await redis.get('')

    if(cached){
      const user = JSON.parse(cached)
      return res.json(user)
    }
      const user = await User.find({})
      console.log(user.map(u => u.email));

      await redis.set('user:all' , JSON.stringify(user))
      return res.json(user)
})


app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

// post 481
// get 91