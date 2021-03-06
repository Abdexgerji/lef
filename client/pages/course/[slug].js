import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from '../../components/modal/PreviewModal';
import { Context } from '../../context';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { toast } from 'react-toastify';

const SingleCourse = ({ course, error }) => {
  // state
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});
  const [enrolledButtonLoading, setEnrolledButtonLoading] = useState(false);

  // context
  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();
  const { slug } = router.query;

  // dummy data
  if (course) {
    course.lessons = [
      { title: 'a' },
      { title: 'b' },
      { title: 'c' },
      { title: 'd' },
    ];
  }

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    try {
      setEnrolledButtonLoading(true);
      const { data } = await axios.get(
        `/api/check-enrollment/${course.course_id}`
      );
      // console.log('CHECK ENROLLMENT', data);
      setEnrolled(data);
      setEnrolledButtonLoading(false);
    } catch (error) {
      console.log(error);
      setEnrolledButtonLoading(false);
    }
  };

  const handlePaidEnrollment = async () => {
    // console.log("handle paid enrollment");
    try {
      setLoading(true);
      // check if user is logged in
      if (!user) router.push('/login');
      // check if already enrolled
      if (enrolled?.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      toast('Paid Enrollment not implemented!');
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      // stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      toast('Enrollment failed, try again.');
      console.log(err);
      setLoading(false);
    }
  };
  const handleFreeEnrollment = async (e) => {
    // console.log("handle free enrollment");
    e.preventDefault();
    try {
      // console.log('enrolled', enrolled);
      // check if user is logged in
      if (!user) router.push('/login');
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled?.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(
        `/api/free-enrollment/${course.course_id}`
      );
      console.log('data==>', data);
      toast(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast('Enrollment failed. Try again.');
      console.log(err);
      setLoading(false);
    }
  };
  // console.log(course);

  // console.log('err', error);
  if (!course && error === 'No course found!') {
    return (
      <>
        <h1 style={{ color: 'red', textAlign: 'center' }}>
          Error, check your slug or url!
        </h1>
      </>
    );
  }

  if (!course) {
    return (
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Error in fetching course. Try again later!
      </h1>
    );
  }

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
        enrolledButtonLoading={enrolledButtonLoading}
        setEnrolledButtonLoading={setEnrolledButtonLoading}
      />

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />
      {!course?.lessons_amount && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/course/${query.slug}`
    );
    return {
      props: { course: data },
    };
  } catch (error) {
    console.log(error?.response?.data);
    // console.log('error', error);
    if (error.response) {
      return {
        props: { error: error?.response?.data },
      };
    }
    return { props: {} };
  }
}

export default SingleCourse;
