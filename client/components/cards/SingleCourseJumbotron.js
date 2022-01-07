// import SingleCourse from "../../pages/course/[slug]";
import { currencyFormatter } from '../../utils/helpers';
import { Badge, Button, Modal } from 'antd';
import ReactPlayer from 'react-player';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
  setEnrolled,
}) => {
  // destructure
  const {
    name,
    description,
    instructor_id,
    lessons_amount,
    image,
    price,
    paid,
    category,
    updated_at,
  } = course;
  // console.log('course===', course);

  return (
    <div className='container-fluid'>
      {/* {<pre>{JSON.stringify(course, null, 4   )}</pre>} */}

      <div className='jumbotron bg-primary square'>
        <div className='row'>
          <div className='col-md-8'>
            {/* title */}

            <h1 className='text-light font-weight-bold'>{name}</h1>
            {/* description */}
            <p className='lead'> {description?.substring(0, 100)}...</p>
            {/* category */}
            <Badge
              count={category}
              style={{ backgroundColor: '#03a9f4' }}
              className='pb-4 ms-2'
            />
            {/* instructor */}
            <p>
              Instructor id =={'>'} {instructor_id}
            </p>
            {/* updated at */}
            <p>Last updated {new Date(updated_at).toLocaleDateString()}</p>
            {/* price */}
            <h4 className='text-light'>{paid ? '$$' : 'Free'}</h4>
          </div>
          <div className='col-md-4'>
            {/* show video preview or course image */}
            {!lessons_amount ? (
              <div
                onClick={() => {
                  setPreview('/vid.mp4' /**lessons[0].video.Location*/);
                  setShowModal(!showModal);
                }}
              >
                <ReactPlayer
                  className='react-player-div'
                  url={'/vid.mp4'}
                  light='/course.png'
                  width='100%'
                  height='225px'
                />
              </div>
            ) : (
              <>
                <img
                  src={/**image**/ '/course.png'}
                  alt={name}
                  className='img img-fluid'
                />
              </>
            )}

            {loading ? (
              <div className='d-flex justify-content-center'>
                <LoadingOutlined className='h1 text-danger' />
              </div>
            ) : (
              <Button
                className='mb-3 mt-3'
                type='danger'
                block
                shape='round'
                icon={<SafetyOutlined />}
                size='large'
                disabled={loading}
                onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
              >
                {user
                  ? enrolled.status
                    ? 'Go to course'
                    : 'Enroll'
                  : 'Login to enroll'}
              </Button>
            )}
            {/* show video preview or course image */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
