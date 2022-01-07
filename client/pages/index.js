import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CourseCard from '../components/cards/CourseCard';

const Index = ({ courses }) => {
  // const [courses, setCourses] = useState([]);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const { data } = await axios.get('/api/courses');
  //     setCourses(data);
  //     // console.log('data', data);
  //   };
  //   fetchCourses();
  // }, []);

  // console.log('courses', courses);
  return (
    <>
      <div className='jumbotron text-center bg-primary square'>
        <h1 className='text-center' style={{ color: 'white' }}>
          Lef
        </h1>
      </div>

      <div className='container-fluid'>
        <div className='row'>
          {courses?.map((course) => (
            <div key={course.course_id} className='col-md-4'>
              <CourseCard key={course._id} course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// export async function getServerSideProps() {
//   const { data } = await axios.get(`${process.env.API}/courses`);
//   console.log('DATA LENGTH =====> ', data.length);
//   return {
//     props: {
//       courses: data,
//     },
//   };
//   // console.log('data', data);
// }

export async function getServerSideProps() {
  // use process.env.API instead of `http://localhost:8000/api
  try {
    const { data } = await axios.get(`http://localhost:8000/api/courses`);
    return {
      props: {
        courses: data,
      },
    };
  } catch (e) {
    console.log(e);
    toast(e);
    return { props: {} };
  }
  // console.log("DATA LENGTH =====> ", data.length);
  // console.log(process.env.API);
}
export default Index;
