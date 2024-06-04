import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useRegisterMutation } from '../slices/authApiSlice';
import userSlice from '../slices/userSlice';
import { userInfoSelector } from '../selectors';

import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector(userInfoSelector);

  const [isShow, setIsShow] = useState(false);
  const [image, setImage] = useState(null);
  const [imageForDisplay, setImageForDisplay] = useState(null);

  const [signUp, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userInfo) navigate('/');
    else setIsShow(true);
  }, [userInfo, navigate]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('userName', data.userName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.password);

      formData.append('image', image);

      const res = await signUp(formData).unwrap();
      dispatch(userSlice.actions.setUser(res.data.user));
      toast.success('You have successfully signed up!');

      navigate('/');
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.message);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const onChangeImage = (e) => {
    setImage(e.target.files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImageForDisplay(reader.result);
    };
  };

  if (!isShow) return null;
  return (
    <div className="register">
      <div className="card">
        <div className="card-header">
          <h3>Register</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="form-group">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                name="userName"
                className="form-control"
                placeholder="User Name"
                id="username"
                {...register('userName', {
                  required: { value: true, message: 'username is required' },
                })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                id="email"
                {...register('email', {
                  required: { value: true, message: 'email is required' },
                })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                id="password"
                {...register('password', {
                  required: { value: true, message: 'password is required' },
                })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  validate: (value) =>
                    value === getValues().password ||
                    'Confirm password does not match',
                })}
              />
            </div>

            <div className="form-group">
              <div className="file-image">
                <div className="image">
                  {imageForDisplay && (
                    <img src={imageForDisplay} alt="Your avatar" />
                  )}
                </div>
                <div className="file">
                  <label htmlFor="image">Select Image</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    id="image"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <input type="submit" value="register" className="btn" />
            </div>

            <div className="form-group">
              <span>
                <Link to="/login"> Login Your Account </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
