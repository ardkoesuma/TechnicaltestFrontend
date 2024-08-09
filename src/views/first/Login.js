import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginAPI } from '../../controllers/welcome';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import isAuthenticated from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      navigate('/Dashboard');
    }
  }, [authenticated, navigate]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('What is your email?'),
    password: Yup.string().required('Dont Forget Your Password!'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    LoginProcess(values.email, values.password);
    setSubmitting(false);
  };

  const LoginProcess = (email, password) => {
    const login = { email, password };

    loginAPI(login)
      .then((response) => {
        localStorage.setItem('authToken', "ok");
        navigate('/Dashboard');
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.error(error);
      });
  };

  const handleGoogleLogin = (response) => {
    const { tokenId } = response;
    // Send tokenId to your backend for validation and authentication
    console.log('Google login success:', tokenId);
    localStorage.setItem('authToken', tokenId);
    navigate('/Dashboard');
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
    toast.error('Google login failed');
  };

  useEffect(() => {
    // Load Google  
    /*
    try {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js';
      script.async = true;
      script.onload = () => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
          });
        });
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error loading Google Platform script:', error);
    }
      */
  }, []);

  return (
    <div className="container mt-5">
      <h2>Form Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Login
            </button>
            <ToastContainer />
          </Form>
        )}
      </Formik>

      <div className="mt-3">
        <div
          className="g-signin2"
          data-onsuccess="handleGoogleLogin"
          data-onfailure="handleGoogleLoginFailure"
        ></div>
      </div>
    </div>
  );
};

export default Login;
