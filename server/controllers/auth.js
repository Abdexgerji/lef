// import User from '../models/user';
import pool from '../config/db';
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required and should be min 6 characters long');
    }

    // below is using mongodb
    // let userExist = await User.findOne({ email }).exec();

    // find user based on id
    let sql = 'SELECT * FROM `user` WHERE email = ?;';
    const userExist = await pool.execute(sql, [email]);
    // console.log('=====', userExist[0], '========');

    if (userExist[0].length > 0) return res.status(400).send('Email is taken');

    // hash password
    const hashedPassword = await hashPassword(password);

    // // register in mongodb
    // const user = new User({
    //   name,
    //   email,
    //   password: hashedPassword,
    // });
    // await user.save();
    // console.log("saved user", user);

    // register in mysql
    const sql2 =
      'INSERT INTO `user`( `name`, `email`, `password`) VALUES (?,?,?)';
    const createdUser = await pool.execute(sql2, [name, email, hashedPassword]);
    // console.log(createdUser);
    return res.json({ ok: true, user: createdUser });
  } catch (err) {
    console.log('err=========>', err, '<========err');
    return res.status(400).send('Error. Try again.');
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if our db has user with that email in mongodb
    // const user = await User.findOne({ email }).exec();

    // check if our db has user with that email in mysql
    let sql = 'SELECT * FROM `user` WHERE email = ?;';
    const user = await pool.execute(sql, [email]);

    if (user[0].length === 0) return res.status(400).send('No user found');
    // console.log(user[0]);

    let user2 = user[0][0];
    // check password
    const match = await comparePassword(password, user2.password);
    if (!match) return res.status(400).send('Passwords do not match!');
    // create signed jwt
    const token = jwt.sign({ id: user2.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    // return user and token to client, exclude hashed password
    user2.password = undefined;
    // send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    // send user as json response
    res.json(user2);
  } catch (err) {
    console.log('err=========>', err, '<========err');
    return res.status(400).send('Error. Try again.');
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Signout success' });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    // console.log(req.user.id);

    // below is in mongodb
    // const user = await User.findById(req.user._id).select('-password').exec();

    const user1 = await pool.execute('SELECT * FROM `user` WHERE id = ?;', [
      req.user.id,
    ]);

    const user = user1[0][0];
    user.password = undefined;

    console.log('CURRENT_USER', user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
