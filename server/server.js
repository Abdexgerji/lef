import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
// import { connection } from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
const morgan = require('morgan');
require('dotenv').config();

const csrfProtection = csrf({ cookie: true });

// mysql
// import { connection } from './config/db';

// create express app
const app = express();

// apply middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// test sql
// import pool from './config/db';
// const test = async () => {
//   const ans = await pool.execute('SELECT * FROM `user` WHERE email = ?;', [
//     't',
//   ]);

//   console.log('ans=======>', ans);
// };

// test();

// app.get('/try', (req, res) => {
//   try {
//     const sqlInsert = 'SELECT * FROM `names`';
//     connection.query(sqlInsert, (err, result) => {
//       res.send('DB created');
//       console.log(result);
//     });
//   } catch (e) {
//     console.log(e);
//     console.log('error....');
//   }
// });

// route
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

// csrf
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: 'Something went really wrong',
  });
});

// import fs from 'fs';
// // fs.wri
// fs.writeFile('../client/public/images/f.txt', 'lol', 'utf-8', (err) => {
//   console.log('lol');
//   if (err) console.log(err);
// });
// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
