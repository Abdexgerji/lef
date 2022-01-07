import expressJwt from 'express-jwt';
import pool from '../config/db';

export const requireSignin = expressJwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

export const isInstructor = async (req, res, next) => {
  try {
    const user1 = await pool.execute('SELECT * FROM `user` WHERE id = ?;', [
      req.user.id,
    ]);

    const user = user1[0][0];
    // console.log(user);
    // const user = await User.findById(req.user._id).exec();
    if (user.role !== 'instructor') {
      return res.status(403).send('User is not instructor!!');
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const isEnrolled = async (req, res, next) => {
  try {
    const user1 = await pool.execute('SELECT * FROM `user` WHERE id = ?;', [
      req.user.id,
    ]);

    const user = user1[0][0];

    const course1 = await pool.execute(
      'SELECT * FROM `coure` WHERE slug = ?;',
      [req.params.slug]
    );

    const course = course1[0][0];

    const order = await pool.execute(
      'SELECT * FROM `orders` WHERE course_id = ? AND user_id =?;',
      [course.id, user.id]
    );
    if (order[0][0].length === 0) res.status(403).send(`User hasn't enrolled!`);
    else next();
    // const user = await User.findById(req.user._id).exec();
    // const course = await Course.findOne({ slug: req.params.slug }).exec();

    // // check if course id is found in user courses array
    // let ids = [];
    // for (let i = 0; i < user.courses.length; i++) {
    //   ids.push(user.courses[i].toString());
    // }

    // if (!ids.includes(course._id.toString())) {
    //   res.sendStatus(403);
    // } else {
    //   next();
    // }
  } catch (err) {
    console.log(err);
  }
};
