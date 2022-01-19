import pool from '../config/db';
import slugify from 'slugify';
import { readFileSync } from 'fs';
// import AWS from 'aws-sdk';
// import { nanoid } from 'nanoid';
// import Course from '../models/course';
// import User from '../models/user';
// const stripe = require('stripe')(process.env.STRIPE_SECRET);

// const awsConfig = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
//   apiVersion: process.env.AWS_API_VERSION,
// };

// const S3 = new AWS.S3(awsConfig);
//
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const { data } = await axios.put(  `/api/course/lessonsOrder/${slug}`,  values.lessons);
// router.put('/course/lessonsOrder/:slug', requireSignin, lessonsOrder);
export const lessonsOrder = async (req, res) => {
  const { slug } = req.params;
  const order = req.body;
  console.log(slug, req.body);
  try {
    let findLesson;
    order.forEach(async (item, index) => {
      findLesson = await pool.execute(
        'UPDATE `lesson` SET `lesson_order`=? WHERE slug=? AND title=?',
        [index + 1, slug, item.title]
      );
      // if (index === 1) console.log(findLesson);
    });
    res.send('Lessons Order updated!');
  } catch (error) {
    console.log(error);
  }
};

//  let { data } = await axios.post('/api/course/upload-image', {  image: uri,  name: file.name,});
// router.post('/course/upload-image', uploadImage);
export const uploadImage = async (req, res) => {
  // console.log(req.body);
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send('No image');

    res.send('Not finished!');

    // // prepare the image
    // const base64Data = new Buffer.from(
    //   image.replace(/^data:image\/\w+;base64,/, ''),
    //   'base64'
    // );
    // const type = image.split(';')[0].split('/')[1];
    // // image params
    // const params = {
    //   Bucket: 'edemy-bucket',
    //   Key: `${nanoid()}.${type}`,
    //   Body: base64Data,
    //   ACL: 'public-read',
    //   ContentEncoding: 'base64',
    //   ContentType: `image/${type}`,
    // };
    // // upload to s3
    // S3.upload(params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return res.sendStatus(400);
    //   }
    //   console.log(data);
    //   res.send(data);
    // });
  } catch (err) {
    console.log(err);
  }
};

// const res = await axios.post('/api/course/remove-image', { image });
// router.post('/course/remove-image', removeImage);
export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    res.send('not finished!');
    // // image params
    // const params = {
    //   Bucket: image.Bucket,
    //   Key: image.Key,
    // };

    // // send remove request to s3
    // S3.deleteObject(params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     res.sendStatus(400);
    //   }
    //   res.send({ ok: true });
    // });
  } catch (err) {
    console.log(err);
  }
};

// router.post('/course', requireSignin, isInstructor, create);
export const create = async (req, res) => {
  // console.log("CREATE COURSE", req.body);
  // return;
  try {
    // const alreadyExist = await Course.findOne({
    //   slug: slugify(req.body.name.toLowerCase()),
    // });

    let slug = slugify(req.body.name.toLowerCase());
    const courses1 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      slug,
    ]);

    // console.log('req.body', req.body);
    let courses = courses1[0];
    if (courses.length > 0) return res.status(400).send('Title is taken');

    // const course = await new Course({
    //   slug: slugify(req.body.name),
    //   instructor: req.user._id,
    //   ...req.body,
    // }).save();

    const { name, description, price, paid, category, image } = req.body;
    let newSlug = slugify(name.toLowerCase());
    const courseCreated = await pool.execute(
      '    INSERT INTO `course`( `name`, `slug`, `description`, `price`, `image`,  `paid`, `instructor_id`, `category`) VALUES (?,?,?,?,?,?,?,?);',
      [
        name,
        slug,
        description,
        price,
        'image not published',
        paid,
        req.user.id,
        category,
      ]
    );
    // console.log(courseCreated[0].affectedRows > 0);
    if (courseCreated[0].affectedRows === 0)
      return res.status(400).send('Course not created!');

    // console.log(courseCreated);
    return res.send('Course Created!');

    // res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Course create failed. Try again.');
  }
};

//   const { data } = await axios.put(`/api/course/${slug}`, {  ...values,  image,});
// router.get('/course/:slug', read);
export const read = async (req, res) => {
  try {
    // const course = await Course.findOne({ slug: req.params.slug })
    //   .populate('instructor', '_id name')
    //   .exec();
    // res.json(course);

    const courses1 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      req.params.slug,
    ]);
    if (courses1[0].length === 0)
      return res.status(400).send('No course found!');
    let course = courses1[0][0];
    console.log(courses1[0]);
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

//   const { data } = await axios.post(  `/api/course/video-upload/${values.instructor_id}`,  videoData,  {    onUploadProgress: (e) =>      setProgress(Math.round((100 * e.loaded) / e.total)),  });
// router.post(  '/course/video-upload/:instructorId', requireSignin,  formidable(),  uploadVideo);
export const uploadVideo = async (req, res) => {
  try {
    // console.log("req.user._id", req.user._id);
    // console.log("req.params.instructorId", req.params.instructorId);
    if (req.user.id != req.params.instructorId) {
      return res.status(400).send('Unauthorized');
    }

    const { video } = req.files;
    // console.log(video);
    if (!video) return res.status(400).send('No video');

    res.send('Not finished!');
    // // video params
    // const params = {
    //   Bucket: 'edemy-bucket',
    //   Key: `${nanoid()}.${video.type.split('/')[1]}`,
    //   Body: readFileSync(video.path),
    //   ACL: 'public-read',
    //   ContentType: video.type,
    // };

    // // upload to s3
    // S3.upload(params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     res.sendStatus(400);
    //   }
    //   console.log(data);
    //   res.send(data);
    // });
  } catch (err) {
    console.log(err);
  }
};

// const res = await axios.post(  `/api/course/video-remove/${values.instructor_id}`,  current.video);
// router.post('/course/video-remove/:instructorId', requireSignin, removeVideo);
export const removeVideo = async (req, res) => {
  try {
    if (req.user.id != req.params.instructorId) {
      return res.status(400).send('Unauthorized');
    }
    res.send('Not finished!');
    // const { Bucket, Key } = req.body;
    // // console.log("VIDEO REMOVE =====> ", req.body);

    // // video params
    // const params = {
    //   Bucket,
    //   Key,
    // };

    // // upload to s3
    // S3.deleteObject(params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     res.sendStatus(400);
    //   }
    //   console.log(data);
    //   res.send({ ok: true });
    // });
  } catch (err) {
    console.log(err);
  }
};

// const { data } = await axios.post(  `/api/course/lesson/${slug}/${course.instructor_id}`,  values);
// router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson);
export const addLesson = async (req, res) => {
  try {
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;

    if (req.user.id != instructorId) {
      return res.status(400).send('Unauthorized');
    }

    const course1 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      slug,
    ]);
    let course = course1[0][0];

    const lesson = await pool.execute(
      'INSERT INTO `lesson`( `title`, `slug`, `content`, `video_link`, `course_id`) VALUES (?,?,?,?,?)',
      [title, slug, content, './vid.mp4', course.course_id]
    );
    if (lesson[0].affectedRows === 0)
      return res.status(400).send('Lesson not created!');
    res.send('Lesson added!');
    // const updated = await Course.findOneAndUpdate(
    //   { slug },
    //   {
    //     $push: { lessons: { title, content, video, slug: slugify(title) } },
    //   },
    //   { new: true }
    // )
    //   .populate('instructor', '_id name')
    //   .exec();
    // res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Add lesson failed');
  }
};

// const { data } = await axios.put(`/api/course/${slug}`, {  ...values,  image,});
// router.put('/course/:slug', requireSignin, update);
export const update = async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log(slug);
    // const course = await Course.findOne({ slug }).exec();
    // console.log("COURSE FOUND => ", course);

    const course1 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      slug,
    ]);
    let course = course1[0][0];

    if (req.user.id != course.instructor_id) {
      return res.status(400).send('Unauthorized');
    }

    const { name, description, price, paid, category } = req.body;

    let slug2 = slugify(name.toLowerCase());
    const courses2 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      slug2,
    ]);

    // console.log('req.body', req.body);
    let courses3 = courses2[0];
    if (courses3.length > 0) return res.status(400).send('Title is taken');

    const updated1 = await pool.execute(
      'UPDATE `course` SET `name`=?,`description`=?,`price`=?,`paid`=?,`category`=?, `slug`=? WHERE slug=? ',
      [name, description, price, paid, category, slug2, slug]
    );
    let updated = updated1[0];
    // console.log(updated.affectedRows);
    if (updated.affectedRows === 0)
      return res.status(400).send('Course not updated!');

    const new1 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      slug2,
    ]);
    let new2 = new1[0][0];
    res.json(new2);
    // const updated = await Course.findOneAndUpdate({ slug }, req.body, {
    //   new: true,
    // }).exec();

    // res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// const { data } = await axios.put(`/api/course/lessonRemove/${slug}`, removed[0]);
// router.put('/course/lessonRemove', requireSignin, removeLesson);
export const removeLesson = async (req, res) => {
  const { title } = req.body;
  const { slug } = req.params;
  console.log(title);

  const deleted1 = await pool.execute(
    'DELETE FROM `lesson` WHERE title=? AND slug=?',
    [title, slug]
  );
  let deleted = deleted1[0];
  // console.log(deleted);

  if (deleted.affectedRows === 0)
    return res.status(400).send('Lesson not deleted!');

  res.json({ ok: true });

  // const { slug, lessonId } = req.params;
  // const course = await Course.findOne({ slug }).exec();
  // if (req.user.id != course.instructor) {
  //   return res.status(400).send('Unauthorized');
  // }

  // const deletedCourse = await Course.findByIdAndUpdate(course._id, {
  //   $pull: { lessons: { _id: lessonId } },
  // }).exec();

  // res.json({ ok: true });
};

// let { data } = await axios.put(  `/api/course/lesson/${slug}/${current._id}`,  current);
// router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson);
export const updateLesson = async (req, res) => {
  try {
    return res.send('Not finished!');
    // console.log("UPDATE LESSON", req.body);
    const { slug } = req.params;
    const { _id, title, content, video, free_preview } = req.body;

    const course1 = await pool.execute('SELECT * FROM `course` WHERE slug=?', [
      slug,
    ]);
    let course = course1[0][0];

    if (course.instructor._id != req.user.id) {
      return res.status(400).send('Unauthorized');
    }

    // also needs a lesson id to be updated
    const lesson1 = await pool.execute(
      'UPDATE `lesson` SET `title`=?,`content`=? WHERE slug=?',
      [title, content, slug]
    );
    let lesson = lesson1[0][0];

    // res.json({ ok: true });
    res.send('Updated!');

    // const course = await Course.findOne({ slug }).select('instructor').exec();

    // const updated = await Course.updateOne(
    //   { 'lessons._id': _id },
    //   {
    //     $set: {
    //       'lessons.$.title': title,
    //       'lessons.$.content': content,
    //       'lessons.$.video': video,
    //       'lessons.$.free_preview': free_preview,
    //     },
    //   },
    //   { new: true }
    // ).exec();
    // // console.log("updated", updated);
    // res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Update lesson failed');
  }
};

// router.put('/course/publish/:courseId', requireSignin, publishCourse);
export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    // const course = await Course.findById(courseId).select('instructor').exec();

    const course1 = await pool.execute(
      'SELECT * FROM `course` WHERE course_id=?',
      [courseId]
    );
    let course = course1[0][0];

    if (course.instructor._id != req.user.id) {
      return res.status(400).send('Unauthorized');
    }

    const updated1 = await pool.execute(
      'UPDATE `lesson` SET `published`=? WHERE course_id=?',
      [true]
    );
    let updated = updated1[0][0];

    const course2 = await pool.execute(
      'SELECT * FROM `course` WHERE course_id=?',
      [courseId]
    );
    let course3 = course2[0][0];

    res.json(course3);
    // const updated = await Course.findByIdAndUpdate(
    //   courseId,
    //   { published: true },
    //   { new: true }
    // ).exec();
    // res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Publish course failed');
  }
};

// router.put('/course/unpublish/:courseId', requireSignin, unpublishCourse);
export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    // const course = await Course.findById(courseId).select('instructor').exec();

    const course1 = await pool.execute(
      'SELECT * FROM `course` WHERE course_id=?',
      [courseId]
    );
    let course = course1[0][0];

    if (course.instructor._id != req.user.id) {
      return res.status(400).send('Unauthorized');
    }

    const updated1 = await pool.execute(
      'UPDATE `lesson` SET `published`=? WHERE course_id=?',
      [false]
    );
    let updated = updated1[0][0];

    const course2 = await pool.execute(
      'SELECT * FROM `course` WHERE course_id=?',
      [courseId]
    );
    let course3 = course2[0][0];

    res.json(course3);

    // const updated = await Course.findByIdAndUpdate(
    //   courseId,
    //   { published: false },
    //   { new: true }
    // ).exec();
    // res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Unpublish course failed');
  }
};

// const { data } = await axios.post('/api/course', {  ...values,  image,});
// router.get('/courses', courses);
export const courses = async (req, res) => {
  // const all = await Course.find({ published: true })
  //   .populate('instructor', '_id name')
  //   .exec();
  // res.json(all);
  const courses1 = await pool.execute(
    'SELECT * FROM `course` WHERE published=?',
    [false]
  );
  // false should be true is z above
  //
  //
  let courses = courses1[0];
  // console.log(courses);
  res.json(courses);
};

// router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment);
export const checkEnrollment = async (req, res) => {
  // res.send('Not finished!');

  const { courseId } = req.params;

  const order1 = await pool.execute(
    'SELECT * FROM `orders` WHERE user_id=? AND course_id=?',
    [req.user.id, courseId]
  );
  const order = order1[0];
  console.log(order);
  if (order.length === 0) {
    return res.status(400).send('Not enrolled!');
  }
  const course1 = await pool.execute(
    'SELECT * FROM `course` WHERE course_id=?',
    [courseId]
  );
  const course = course1[0][0];

  res.send({ status: true, course });
  // // find courses of the currently logged in user
  // const user = await User.findById(req.user.id).exec();
  // // check if course id is found in user courses array
  // let ids = [];
  // let length = user.courses && user.courses.length;
  // for (let i = 0; i < length; i++) {
  //   ids.push(user.courses[i].toString());
  // }
  // res.json({
  //   status: ids.includes(courseId),
  //   course: await Course.findById(courseId).exec(),
  // });
};

// router.post('/free-enrollment/:courseId', requireSignin, freeEnrollment);
export const freeEnrollment = async (req, res) => {
  try {
    // check if course is free or paid
    // const course = await Course.findById(req.params.courseId).exec();
    const course1 = await pool.execute(
      'SELECT * FROM `course` WHERE course_id=?',
      [req.params.courseId]
    );
    const course = course1[0][0];
    if (course.paid) return res.status(400).send('Course is paid!');

    const order = await pool.execute(
      'INSERT INTO `orders`( `course_id`, `user_id`) VALUES (?,?)',
      [req.params.courseId, req.user.id]
    );

    if (order[0].affectedRows === 0)
      return res.status(400).send('Order not created!');

    // const result = await User.findByIdAndUpdate(
    //   req.user._id,
    //   {
    //     $addToSet: { courses: course._id },
    //   },
    //   { new: true }
    // ).exec();
    // console.log(result);
    res.json({
      message: 'Congratulations! You have successfully enrolled',
      course,
    });
  } catch (err) {
    console.log('free enrollment err', err);
    return res.status(400).send('Enrollment create failed');
  }
};

// router.post('/paid-enrollment/:courseId', requireSignin, paidEnrollment);
export const paidEnrollment = async (req, res) => {
  try {
    // check if course is free or paid
    const course = await Course.findById(req.params.courseId)
      .populate('instructor')
      .exec();
    if (!course.paid) return;
    // application fee 30%
    const fee = (course.price * 30) / 100;
    // create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // purchase details
      line_items: [
        {
          name: course.name,
          amount: Math.round(course.price.toFixed(2) * 100),
          currency: 'usd',
          quantity: 1,
        },
      ],
      // charge buyer and transfer remaining balance to seller (after fee)
      payment_intent_data: {
        application_fee_amount: Math.round(fee.toFixed(2) * 100),
        transfer_data: {
          destination: course.instructor.stripe_account_id,
        },
      },
      // redirect url after successful payment
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
    console.log('SESSION ID => ', session);

    await User.findByIdAndUpdate(req.user._id, {
      stripeSession: session,
    }).exec();
    res.send(session.id);
  } catch (err) {
    console.log('PAID ENROLLMENT ERR', err);
    return res.status(400).send('Enrollment create failed');
  }
};

export const stripeSuccess = async (req, res) => {
  try {
    // find course
    const course = await Course.findById(req.params.courseId).exec();
    // get user from db to get stripe session id
    const user = await User.findById(req.user._id).exec();
    // if no stripe session return
    if (!user.stripeSession.id) return res.sendStatus(400);
    // retrieve stripe session
    const session = await stripe.checkout.sessions.retrieve(
      user.stripeSession.id
    );
    console.log('STRIPE SUCCESS', session);
    // if session payment status is paid, push course to user's course []
    if (session.payment_status === 'paid') {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { courses: course._id },
        $set: { stripeSession: {} },
      }).exec();
    }
    res.json({ success: true, course });
  } catch (err) {
    console.log('STRIPE SUCCESS ERR', err);
    res.json({ success: false });
  }
};

// router.get('/user-courses', requireSignin, userCourses);
export const userCourses = async (req, res) => {
  // const user = await User.findById(req.user._id).exec();
  // const courses = await Course.find({ _id: { $in: user.courses } })
  //   .populate('instructor', '_id name')
  //   .exec();

  const userOrders1 = await pool.execute(
    'SELECT course.course_id, course.name, course.slug, course.description, course.published, course.paid, course.instructor_id, course.category, course.lessons_amount, course.created_at, course.updated_at FROM `course` JOIN `orders` ON course.course_id = orders.course_id WHERE orders.user_id = ?;',
    [req.user.id]
  );
  const userOrders = userOrders1[0];
  // console.log(userOrders);
  res.json(userOrders);
};

// const { data } = await axios.post(`/api/mark-completed`, {  courseId: course._id,  lessonId: course.lessons[clicked]._id,});
// router.post('/mark-completed', requireSignin, markCompleted);
export const markCompleted = async (req, res) => {
  res.send('Not finished!');

  // const { courseId, lessonId } = req.body;
  // // console.log(courseId, lessonId);
  // // find if user with that course is already created
  // const existing = await Completed.findOne({
  //   user: req.user._id,
  //   course: courseId,
  // }).exec();

  // if (existing) {
  //   // update
  //   const updated = await Completed.findOneAndUpdate(
  //     {
  //       user: req.user._id,
  //       course: courseId,
  //     },
  //     {
  //       $addToSet: { lessons: lessonId },
  //     }
  //   ).exec();
  //   res.json({ ok: true });
  // } else {
  //   // create
  //   const created = await new Completed({
  //     user: req.user._id,
  //     course: courseId,
  //     lessons: lessonId,
  //   }).save();
  //   res.json({ ok: true });
  // }
};

// const { data } = await axios.post(`/api/mark-incomplete`, {  courseId: course._id,  lessonId: course.lessons[clicked]._id,});
//router.post('/mark-incomplete', requireSignin, markIncomplete);
export const markIncomplete = async (req, res) => {
  try {
    res.send('Not finished!');
    // const { courseId, lessonId } = req.body;

    // const updated = await Completed.findOneAndUpdate(
    //   {
    //     user: req.user._id,
    //     course: courseId,
    //   },
    //   {
    //     $pull: { lessons: lessonId },
    //   }
    //   ).exec();
    // res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

// const { data } = await axios.post(`/api/lessons-completed`, {  courseId: course._id,});
// router.post('/lessons-completed', requireSignin, lessonListCompleted);
export const lessonListCompleted = async (req, res) => {
  try {
    res.send('Not finished!');
    // const list = await Completed.findOne({
    //   user: req.user._id,
    //   course: req.body.courseId,
    // }).exec();
    // list && res.json(list.lessons);
  } catch (err) {
    console.log(err);
  }
};
