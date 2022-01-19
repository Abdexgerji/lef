import express from 'express';

const router = express.Router();

// middleware
import { requireSignin } from '../middlewares';

// controllers
import {
  makeInstructor,
  currentInstructor,
  instructorCourses,
  becomeInstructor,
  studentCount,
} from '../controllers/instructor';

router.post('/make-instructor', requireSignin, makeInstructor);

// make instructor
router.post('/become-instructor', requireSignin, becomeInstructor);
router.get('/current-instructor', requireSignin, currentInstructor);

router.get('/instructor-courses', requireSignin, instructorCourses);

router.post('/instructor/student-count', requireSignin, studentCount);

module.exports = router;
