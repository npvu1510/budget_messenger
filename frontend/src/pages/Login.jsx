import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { useLoginMutation } from '../slices/authApiSlice';
import userSlice from '../slices/userSlice';

import { userInfoSelector } from '../selectors';

import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShow, setIsShow] = useState(false);
  const userInfo = useSelector(userInfoSelector);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) navigate('/');
    else setIsShow(true);
  }, [userInfo, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(userSlice.actions.setUser(res.data.user));
      toast.success('You have successfully signed up!');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error(error?.data.message || error.message);
    }
  };

  if (!isShow) return null;
  return (
    <div className="register">
      <div className="card">
        <div className="card-header">
          <h3>Login</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                id="email"
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                id="password"
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                })}
              />
            </div>

            <div className="form-group">
              <input type="submit" value="login" className="btn" />
            </div>

            <div className="form-group">
              <span>
                <Link to="/register"> Don't have any Account </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
