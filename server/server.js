import express from 'express';
import router from './routers/router.js';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' });





const app = express()

app.use(express.json());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



app.use('/api', router);

//const tron = new Tron();




app.listen(process.env.PORT, () => {
  console.log(`server start on PORT ${process.env.PORT}`);
});