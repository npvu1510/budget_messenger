import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { userInfoSelector } from '../selectors';

const ProtectedRoute = () => {
  const userInfo = useSelector(userInfoSelector);

  return userInfo ? <Outlet /> : <Navigate to={'/login'} replace />;
};

export default ProtectedRoute;
