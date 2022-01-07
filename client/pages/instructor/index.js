import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../components/routes/InstructorRoute';
import { Avatar, Badge } from 'antd';
import Link from 'next/link';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);
  // console.log(courses);
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses');
    setCourses(data);
  };

  const myStyle = { marginTop: '-15px', fontSize: '10px' };

  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center square'>Courses</h1>
      {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}

      {!courses.length && (
        <Link href='/instructor/course/create'>
          <a className='btn btn-primary float-right mt-2'>Create course</a>
        </Link>
      )}

      {courses?.map((course) => (
        <>
          <div className='media pt-2'>
            <Avatar size={80} src={'/course.png'} />

            <div className='media-body pl-2'>
              <div className='row'>
                <div className='col'>
                  <Badge count={course?.paid ? course?.price : 'Free'}>
                    <Link
                      href={`/instructor/course/view/${course.slug}`}
                      className='pointer'
                    >
                      <a className='mt-2 text-primary'>
                        <h5 className='pt-2'>{course.name}</h5>
                      </a>
                    </Link>
                  </Badge>
                  <p style={{ marginTop: '-10px' }}>
                    {course?.lessons_amount} Lessons
                  </p>

                  {course?.lessons_amount < 5 ? (
                    <p style={myStyle} className='text-warning'>
                      At least 5 lessons are required to publish a course
                    </p>
                  ) : course?.published ? (
                    <p style={myStyle} className='text-success'>
                      Your course is live in the marketplace
                    </p>
                  ) : (
                    <p style={myStyle} className='text-success'>
                      Your course is ready to be published
                    </p>
                  )}
                </div>

                <div className='col-md-3 mt-3 text-center'>
                  {course.published ? (
                    <div>
                      <CheckCircleOutlined className='h5 pointer text-success' />
                      <br />
                      <small className='text-muted'>Published</small>
                    </div>
                  ) : (
                    <div>
                      <CloseCircleOutlined className='h5 pointer text-warning' />
                      <br />
                      <small className='text-muted'>Unpublished</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
