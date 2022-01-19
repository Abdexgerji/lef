import express from 'express';
import formidable from 'express-formidable';

const router = express.Router();

// middleware
import { requireSignin, isInstructor, isEnrolled } from '../middlewares';

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  lessonsOrder,
  removeLesson,
  updateLesson,
  unpublishCourse,
  publishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
  paidEnrollment,
  userCourses,
  markCompleted,
  lessonListCompleted,
  markIncomplete,
} from '../controllers/course';

router.get('/courses', courses);

// the one below  is mine
router.put('/course/lessonRemove/:slug', requireSignin, removeLesson);

// image
router.post('/course/upload-image', uploadImage);
router.post('/course/remove-image', removeImage);
// course
router.post('/course', requireSignin, isInstructor, create);
router.put('/course/:slug', requireSignin, update);
router.get('/course/:slug', read);
router.put('/course/publish/:courseId', requireSignin, publishCourse);
router.put('/course/unpublish/:courseId', requireSignin, unpublishCourse);

// video
router.post(
  '/course/video-upload/:instructorId',
  requireSignin,
  formidable(),
  uploadVideo
);
router.post('/course/video-remove/:instructorId', requireSignin, removeVideo);

// lessons
// the one below  is mine
// lessons order
router.put('/course/lessonsOrder/:slug', requireSignin, lessonsOrder);

router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson);

router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment);

// enrollment
router.post('/free-enrollment/:courseId', requireSignin, freeEnrollment);
router.post('/paid-enrollment/:courseId', requireSignin, paidEnrollment);

router.get('/user-courses', requireSignin, userCourses);
router.get('/user/course/:slug', requireSignin, isEnrolled, read);

// mark completed
router.post('/mark-completed', requireSignin, markCompleted);
router.post('/mark-incomplete', requireSignin, markIncomplete);
router.post('/lessons-completed', requireSignin, lessonListCompleted);
module.exports = router;
