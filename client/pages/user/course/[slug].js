import { useState, useEffect, createElement } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import StudentRoute from '../../../components/routes/StudentRoute';
import { Button, Menu, Avatar } from 'antd';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from '@ant-design/icons';

const { Item } = Menu;

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  // force state update
  const [updateState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/user/course/${slug}`);
      // data.lessons = [
      //   { title: 'a' },
      //   { title: 'b' },
      //   { title: 'c' },
      //   { title: 'd' },
      //   { title: 'e' },
      //   { title: 'f' },
      // ];
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
    } catch (error) {
      console.log(error.response);
      toast(error.response.data);
    }
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/lessons-completed`, {
      courseId: course._id,
    });
    console.log('COMPLETED LESSONS => ', data);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-completed`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
    } catch (error) {
      console.log(error);
    }
  };

  const markIncomplete = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      console.log('ALL => ', all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        console.log('ALL WITHOUT REMOVED => ', all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className='row'>
        <div style={{ maxWidth: 320 }}>
          <Button
            style={{ width: collapsed ? '' : '100%' }}
            onClick={() => setCollapsed(!collapsed)}
            className='text-primary mt-1 btn-block mb-2'
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{' '}
            {!collapsed && 'Collapse Menu'}
            {/* {collapsed ? (
              <div>
                <MenuUnfoldOutlined />
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <MenuFoldOutlined />
                Collapse Menu
              </div>
            )} */}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: '80vh', overflow: 'scroll' }}
          >
            {course?.lessons?.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title.substring(0, 30)}{' '}
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled
                    className='float-right text-primary ml-2'
                    style={{ marginTop: '13px' }}
                  />
                ) : (
                  <MinusCircleFilled
                    className='float-right text-danger ml-2'
                    style={{ marginTop: '13px' }}
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>

        <div className='col'>
          {clicked !== -1 ? (
            <>
              <div className='col alert alert-primary square'>
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span className='float-end pointer' onClick={markIncomplete}>
                    Mark as incomplete
                  </span>
                ) : (
                  <span className='float-end pointer' onClick={markCompleted}>
                    Mark as completed
                  </span>
                )}
              </div>
              {course?.lessons[clicked] && (
                <>
                  <div className='wrapper'>
                    <ReactPlayer
                      className='player'
                      url={'/vid.mp4'}
                      width='98%'
                      height='98%'
                      controls
                      onEnded={() => markCompleted()}
                    />
                  </div>
                </>
              )}
              <hr />
              <h2>Description</h2>
              <ReactMarkdown
                children={course?.lessons[clicked]?.content ?? 'Not finished!'}
                className='single-post'
              />
            </>
          ) : (
            <div className='d-flex justify-content-center p-5'>
              <div className='text-center p-5'>
                <PlayCircleOutlined className='text-primary display-1 p-5' />
                <p className='lead'>Clcik on the lessons to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
