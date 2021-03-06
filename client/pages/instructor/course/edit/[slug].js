import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { List, Avatar, Button, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  // state created by me
  const [startedRearranging, setStartedRearranging] = useState(false);

  // state for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState('Upload Video');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    // let paid = values?.paid;
    // console.log('useEffect values', values);
    if (values.paid) {
      setValues({ ...values, paid: true });
    } else {
      setValues({ ...values, paid: false });
    }
  }, [values.paid]);

  const loadCourse = async () => {
    try {
      if (slug) {
        const { data } = await axios.get(`/api/course/${slug}`);
        // console.log('data==>', data);
        let paid = data.paid;
        if (data.paid) {
          paid = true;
        } else {
          paid = false;
        }
        setValues({
          ...data,
          paid,
          lessons: [
            { title: 'a' },
            { title: 'b' },
            { title: 'c' },
            { title: 'd' },
            { title: 'e' },
            { title: 'f' },
          ],
        });
        if (data && data.image) setImage(data.image);
        // console.log('values', values);
      }
    } catch (error) {
      console.log(error);
      toast('No course found, Use correct slug or course link!');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL?.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // resize
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        // console.log('uri', uri);
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
          name: file.name,
        });
        console.log('IMAGE UPLOADED', data);
        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast('Image upload failed. Try later.');
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      console.log('remove');
      // console.log(values);
      setValues({ ...values, loading: true });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast('Image upload failed. Try later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast('Course updated!');
      setValues({ ...data });
      setTimeout(() => {
        router.push(`/instructor/course/edit/${data.slug}`);
      }, 2000);
      // router.push('/instructor');
    } catch (err) {
      toast(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    // console.log("ON DRAG => ", index);
    e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = async (e, index) => {
    // console.log('ON DROP => ', index);
    setStartedRearranging(true);
    const movingItemIndex = e.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; // clicked/dragged item to re-order
    allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues({ ...values, lessons: [...allLessons] });
    // // save the new lessons order in db
    // const { data } = await axios.put(`/api/course/${slug}`, {
    //   ...values,
    //   image,
    // });
    // console.log("LESSONS REARRANGED RES => ", data);
    // toast('Lessons rearranged successfully');
  };

  // the below one is created by me
  const handleLessonsOrder = async () => {
    // toast('heoo');
    console.log(values.lessons);
    // // save the new lessons order in db
    try {
      const { data } = await axios.put(
        `/api/course/lessonsOrder/${slug}`,
        values.lessons
      );
      toast('Saved Successfully!!');
    } catch (error) {
      toast(error);
      console.log(error);
    }
  };

  const handleDelete = async (index) => {
    const answer = window.confirm('Are you sure you want to delete?');
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    // console.log("removed", removed[0]._id);
    setValues({ ...values, lessons: allLessons });
    // send request to server
    try {
      const { data } = await axios.put(
        `/api/course/lessonRemove/${slug}`,
        removed[0]
      );
      console.log('LESSON DELETED =>', data);
      toast('Delete Successfull!!');
    } catch (error) {
      toast(error.message);
      console.log(error);
    }
  };

  /**
   * lesson update functions
   */

  const handleVideo = async (e) => {
    // remove previous
    console.log(current);
    if (current?.video?.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor_id}`,
        current.video
      );
      console.log('REMOVED ===> ', res);
    }
    // upload
    const file = e.target.files[0];
    // console.log(file);
    setUploadButtonText(file.name);
    setUploading(true);
    // send video as form data
    const videoData = new FormData();
    videoData.append('video', file);
    videoData.append('courseId', values._id);
    console.log('videoData', videoData);
    console.log('file', file);
    // console.log(values);
    // save progress bar and send video as form data to backend
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor_id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    // once response is received
    // console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    // console.log("CURRENT", current);
    // console.log("**SEND TO BACKEND**");
    // console.table({ values });
    let { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    // console.log("LESSON UPDATED AND SAVED ===> ", data);
    setUploadButtonText('Upload video');
    setProgress(0);
    setVisible(false);
    // update lessons
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast('Lesson updated');
    }
  };

  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center square'>Update Course</h1>
      {/* {JSON.stringify(values)} */}
      <div className='pt-3 pb-3'>
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImageRemove={handleImageRemove}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre> */}

      <hr />

      <div className='row pb-5'>
        <div className='col lesson-list'>
          <h2 className='text-center mt-4'>
            You can rearrange the order of lessons by dragging!
          </h2>
          <h4>{values?.lessons?.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout='horizontal'
            dataSource={values?.lessons}
            renderItem={(item, index) => (
              <Item
                style={{
                  backgroundColor: 'aliceblue',
                  borderRadius: '3px',
                  marginBottom: '12px',
                }}
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  className='ps-2'
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>
                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className='text-danger float-right pe-1'
                />
              </Item>
            )}
          ></List>
        </div>
      </div>
      <Button
        onClick={handleLessonsOrder}
        disabled={!startedRearranging}
        className='btn btn-primary mb-3'
        // loading={values.loading}
        type='primary'
        size='large'
        shape='round'
      >
        Save Lessons Order
      </Button>
      <Modal
        title='Update lesson'
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
        <pre>{JSON.stringify(current, null, 4)}</pre>
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
