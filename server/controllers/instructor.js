import pool from '../config/db';
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';

export const makeInstructor = async (req, res) => {
  try {
    res.send('hiiii');
    // // 1. find user from db
    // const user = await User.findById(req.user._id).exec();
    // // 2. if user dont have stripe_account_id yet, then create new
    // if (!user.stripe_account_id) {
    //   const account = await stripe.accounts.create({ type: "express" });
    // console.log('ACCOUNT => ', account.id)
    //   user.stripe_account_id = account.id;
    //   user.save();
    // }
    // // 3. create account link based on account id (for frontend to complete onboarding)
    // const accountLink = await stripe.accountLinks.create({
    //   account: user.stripe_account_id,
    //   refresh_url: process.env.STRIPE_REDIRECT_URL,
    //   return_url: process.env.STRIPE_REDIRECT_URL,
    //   type: "account_onboarding",
    // });
    // //   console.log(accountLink)
    // // 4. pre-fill any info such as email (optional), then send url resposne to frontend
    // accountLink = Object.assign(accountLink, {
    //   "stripe_user[email]": user.email,
    // });
    // // 5. then send the account link as response to fronend
    // res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log('MAKE INSTRUCTOR ERR ', err);
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id).exec();
    const getUser = await pool.execute('SELECT * FROM `user` WHERE id = ?;', [
      req.user.id,
    ]);
    const user = getUser[0][0];

    const setInstructor = await pool.execute(
      'UPDATE user SET role = "instructor" WHERE id = ?;',
      [req.user.id]
    );
    const getUser2 = await pool.execute('SELECT * FROM `user` WHERE id = ?;', [
      req.user.id,
    ]);
    const user2 = getUser2[0][0];
    user2.password = undefined;
    // console.log(user.id);
    return res.send(user2);

    // const account = await stripe.accounts.retrieve(user.stripe_account_id);
    // // console.log("ACCOUNT => ", account);
    // if (!account.charges_enabled) {
    //   return res.staus(401).send('Unauthorized');
    // } else {
    //   const statusUpdated = await User.findByIdAndUpdate(
    //     user._id,
    //     {
    //       stripe_seller: account,
    //       $addToSet: { role: 'Instructor' },
    //     },
    //     { new: true }
    //   )
    //     .select('-password')
    //     .exec();
    //   res.json(statusUpdated);
  } catch (err) {
    console.log(err);
  }
};

export const currentInstructor = async (req, res) => {
  try {
    // let user = await User.findById(req.user._id).select('-password').exec();

    const getUser = await pool.execute('SELECT * FROM `user` WHERE id = ?;', [
      req.user.id,
    ]);
    const user = getUser[0][0];
    if (user.role !== 'instructor') {
      return res.status(403).send('User is not instructor!');
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const getCourses = await pool.execute(
      'SELECT * FROM `course` WHERE instructor_id = ? ORDER BY created_at DESC;',
      [req.user.id]
    );
    const courses = getCourses[0];
    // console.log(courses);

    // const courses = await Course.find({ instructor: req.user._id })
    //   .sort({ createdAt: -1 })
    //   .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};
