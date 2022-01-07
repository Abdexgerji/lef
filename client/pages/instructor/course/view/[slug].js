import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Tooltip, Button, Modal, List } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';
import Item from 'antd/lib/list/Item';

const CourseView = () => {
  const [course, setCourse] = useState({});

  // for lessons
  const [visible, setVisible] = useState(false);

  const [values, setValues] = useState({
    title: '',
    content: '',
    video: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse({
      ...data,
      lessons: [
        { title: 'a' },
        { title: 'b' },
        { title: 'c' },
        { title: 'd' },
        { title: 'e' },
        { title: 'f' },
      ],
    });
  };

  // FUNCTIONS FOR ADD LESSON
  const handleAddLesson = async (e) => {
    e.preventDefault();
    // console.log(values);
    console.log('course==>', course);

    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor_id}`,
        values
      );
      // console.log(data)
      // setValues({ ...values, title: '', content: '', video: {} });
      setProgress(0);
      setUploadButtonText('Upload video');
      setVisible(false);
      // I commented the below one myself, check the data first
      // setCourse(data);
      toast('Lesson added');
    } catch (err) {
      console.log('err', err);
      toast('Lesson add failed');
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);

      console.log('object');
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor_id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      // once response is received
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video upload failed');
    }
  };
  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor_id}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText('Upload Video');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video remove failed');
    }
  };

  const handlePublish = async () => {
    // console.log(course.instructor._id);
    // return;
    try {
      let answer = window.confirm(
        'Once you publish your course, it will be live in the marketplace for students to enroll.'
      );
      if (!answer) return;
      const { data } = await axios.put(
        `/api/course/publish/${course.course_id}`
      );
      // console.log("COURSE PUBLISHED RES", data);
      toast('Congrats. Your course is now live in marketplace!');
      setCourse(data);
    } catch (err) {
      toast('Course publish failed. Try again');
    }
  };

  const handleUnpublish = async () => {
    // console.log(slug);
    // return;
    try {
      let answer = window.confirm(
        'Once you unpublish your course, it will not appear in the marketplace for students to enroll.'
      );
      if (!answer) return;
      const { data } = await axios.put(
        `/api/course/unpublish/${course.course_id}`
      );
      toast('Your course is now removed from the marketplace!');
      setCourse(data);
    } catch (err) {
      toast('Course unpublish failed. Try again');
    }
  };
  // console.log('course', course);
  return (
    <InstructorRoute>
      <div className='contianer-fluid pt-3'>
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className='container-fluid pt-1'>
            <div className='d-flex pt-2'>
              <Avatar className='flex-shrink-0' size={80} src={'/course.png'} />

              <div className='flex-grow-1 ms-3 pl-2'>
                <div className='col'>
                  <h5 className='mt-2 text-primary'>{course.name}</h5>
                  <p style={{ marginTop: '-10px' }}>
                    {course?.lessons_amount} Lessons
                  </p>
                  <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                    {course.category}
                  </p>
                </div>

                <div className='float-end pe-4'>
                  <Tooltip title='Edit'>
                    <EditOutlined
                      onClick={() =>
                        router.push(`/instructor/course/edit/${slug}`)
                      }
                      className='h5 pointer text-warning me-4'
                    />
                  </Tooltip>

                  {/* course published ? unpublished */}
                  {course?.lessons_amount < 5 ? (
                    <Tooltip title='Min 5 lessons required to publish'>
                      <QuestionOutlined className='h5 pointer text-danger' />
                    </Tooltip>
                  ) : course.published ? (
                    <Tooltip title='Unpublish'>
                      <CloseOutlined
                        onClick={handleUnpublish}
                        className='h5 pointer text-danger'
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title='Publish'>
                      <CheckOutlined
                        onClick={handlePublish}
                        className='h5 pointer text-success'
                      />
                    </Tooltip>
                  )}
                  {/* <Tooltip title='Publish'>
                    <CheckOutlined className='h5 pointer text-danger' />
                  </Tooltip> */}
                </div>
              </div>
            </div>
            <hr />
            <div className='row'>
              <div className='col'>
                <h4>Course Description</h4>
                <ReactMarkdown children={course.description} />
              </div>
            </div>
            <div className='row'>
              <Button
                onClick={() => setVisible(true)}
                className='col-md-6 offset-md-3 text-center'
                type='primary'
                shape='round'
                icon={<UploadOutlined />}
                size='large'
              >
                Add Lesson
              </Button>
            </div>

            <br />

            <Modal
              title='+ Add Lesson'
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>
            <div className='row pb-5'>
              <div className='col lesson-list'>
                <h4>{course?.lessons_amount} Lessons</h4>
                <List
                  itemLayout='horizontal'
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></Item.Meta>
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <style jsx>{`
      body {
        background-color: green;
      }
    `}</style> */}
    </InstructorRoute>
  );
};

export default CourseView;
