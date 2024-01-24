import { Button, Card, Label, TextInput } from "flowbite-react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api_url } from '../../config';

interface Data {
  email: string;
  password: string;
}

const SignInPage: FC = function () {
  const navigate = useNavigate();
  const initialValues: Data = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values: Data) => {
    let config = {
      method: 'post',
      url: `${api_url}` +'/api/users/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : values
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 200) {
        toast.success(response.data.msg);
        const token = response.data.accessToken;
        localStorage.setItem('accessToken', token);
        navigate('/');
        
      } else {
          toast.error('User is not valid!!')
      }
    })
    .catch((error) => {
      toast.error('User is not valid!!')
      console.log(error);
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div className="my-6 flex items-center gap-x-1">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-12"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          iPangram
        </span>
      </div>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt="image"
        className=" md:max-w-screen-m [&>img]:hidden md:[&>img]:w-41 md:[&>img]:p-0 md:[&>*]:p-8 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in to platform
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email" color={ (formik.touched.email && formik.errors.email) ? "failure": ''}>Your email</Label>
            <TextInput
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              color={ (formik.touched.email && formik.errors.email) ? "failure": 'gray'}
              placeholder="name@company.com"
              type="email"
              helperText={formik.touched.email && formik.errors.email && (
                <span className="failure">{formik.errors.email}</span>
              )}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password" color={ (formik.touched.password && formik.errors.password) ? "failure": ''}>Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              color={ (formik.touched.password && formik.errors.password) ? "failure": 'gray'}
              type="password"
              helperText={formik.touched.password && formik.errors.password && (
                <span className="failure">{formik.errors.password}</span>
              )}
            />
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <Link
              to="/authentication/sign-up"
              className="text-primary-600 dark:text-primary-300"
            >
              Create account
            </Link>
          </p>
        </form>
        <ToastContainer position="top-right" autoClose={2000} />
      </Card>
    </div>
  );
};

export default SignInPage;
