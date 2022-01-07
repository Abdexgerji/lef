// const mysql = require('mysql2');
// require('dotenv').config();

// // mysql
// export const connection = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   port: process.env.DB_PORT,
// });

// connection.connect((err) => {
//   if (err) {
//     console.log(err.message);
//   }
//   console.log(`db connected`);
// });

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

// let sql = 'SELECT * FROM user';
// let sql = "SELECT * FROM `user` WHERE email = 'test@gmail.com';";

// pool.execute(sql, (err, result) => {
//   console.log('error===>', err);
//   console.log('result===>', result);
// });

// pool.execute(sql, function (err, result) {
//   if (err) throw err;
//   console.log(result);
// });

// const test = async () => {
//   const ans = await pool.execute(sql);

//   console.log(ans);
// };

// test();
module.exports = pool.promise();
