import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import InstructorNav from '../nav/InstructorNav';
import { Context } from '../../context';
import { toast } from 'react-toastify';

const InstructorRoute = ({ children }) => {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  // state
  const [ok, setOk] = useState(false);
  // router
  const router = useRouter();

  useEffect(() => {
    fetchInstructor();
  }, []);

  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get('/api/current-instructor');
      // console.log("INSTRUCTOR ROUTE => ", data);
      if (data.ok) setOk(true);
    } catch (err) {
      console.log(err.response);
      if (err.response.data === 'Login again!') {
        toast('Please Login again!');
        dispatch({ type: 'LOGOUT' });
        window.localStorage.removeItem('user');
        const { data } = await axios.get('/api/logout');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
      setOk(false);
      router.push('/');
    }
  };

  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className='d-flex justify-content-center display-1 text-primary p-5'
        />
      ) : (
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-2'>
              <InstructorNav />
            </div>
            <div className='col-md-10'>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorRoute;
