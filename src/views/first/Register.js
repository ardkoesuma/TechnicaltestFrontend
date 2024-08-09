import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; 
import { registerAPI } from '../../controllers/welcome';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import isAuthenticated from '../../utils/auth';


const Register = () => {

  const navigate = useNavigate(); // Define navigate
  const authenticated = isAuthenticated();


  useEffect(() => {
    if (authenticated) {
      navigate('/Dashboard'); // Redirect to dashboard if authenticated
    }
  }, [authenticated, navigate]);

  
  const validationSchema = Yup.object().shape({ 
    name: Yup.string().required('What is your name?'),
    email: Yup.string().email('Invalid email address').required('What is your email?'),
    password: Yup.string().required('Don\'t forget your password!'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    RegisProces(values.name, values.email, values.password, resetForm);
    setSubmitting(false);
  };

  const RegisProces = (username, email, password, resetForm) => {
    const regs = { username, email, password };
  
    registerAPI(regs)
      .then((response) => {
        console.log(response.data);
        toast.success('Registration successful!'); // Show success toast 
        resetForm(); // Clear form fields
        navigate('/login');
      })
      .catch((error) => { 
        toast.error(error.response.data);
        console.error(error);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Form Registration</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form> 
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Field
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
              />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
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
              Register
            </button>
            <ToastContainer /> 
          </Form>
        )}
      </Formik> 
    </div>
  );
};

export default Register;
