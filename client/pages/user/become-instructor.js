import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';

const BecomeInstructor = () => {
  // state
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const becomeInstructor = () => {
    // console.log('hhhhhh');
    // console.log("become instructor");
    setLoading(true);
    axios
      .post('/api/become-instructor')
      .then((res) => {
        // console.log(res);
        dispatch({
          type: 'LOGIN',
          payload: res.data,
        });
        toast('Successfully became instructor!');
        window.localStorage.setItem('user', JSON.stringify(res.data));
        // window.location.href = '/instructor';
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.status);
        toast('Making instructor failed. Try again.');
        setLoading(false);
      });
  };

  return (
    <>
      <h1 className='jumbotron text-center square'>Become Instructor</h1>

      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 text-center'>
            <div className='pt-4'>
              <UserSwitchOutlined className='display-1 pb-3' />
              <br />
              <h2>Setup payout to publish courses on Lef</h2>
              <p className='lead text-warning'>
                Lef partners with stripe to transfer earnings to your bank
                account
              </p>

              <Button
                className='mb-3'
                type='primary'
                block
                shape='round'
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size='large'
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role === 'Instructor') || loading
                }
              >
                {loading ? 'Processing...' : 'Be Instructor!'}
              </Button>

              <p className='lead'>
                You will be redirected to stripe to complete onboarding process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
