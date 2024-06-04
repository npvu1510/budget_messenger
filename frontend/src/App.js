import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// contexts
import { SocketProvider } from './contexts/socketContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

import ProtectedRoute from './components/ProtectedRoute';

import store from './store';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/login" element={<Login />} />,
    <Route path="/register" element={<Register />} />,

    <Route path="" element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />,
    </Route>,
  ])
);

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router} />;
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },

            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </SocketProvider>
    </Provider>
  );
};

export default App;
