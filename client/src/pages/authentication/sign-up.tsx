import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api_url } from '../../config';

interface Data {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const SignUpPage: FC = function () {
  const navigate = useNavigate();
  const initialValues: Data = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(3, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
    acceptTerms: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions'),
  });

  const handleSubmit = (values: Data, { resetForm }: FormikHelpers<Data>) => {
    let config = {
      method: 'post',
      url: `${api_url}` +'/api/users/create',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : values
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 201) {
        toast.success(response.data.msg);
        navigate('/authentication/sign-in')
        resetForm();
      } else {
          toast.error(response.data.msg)
      }
    })
    .catch((error) => {
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
        imgSrc="/images/authentication/create-account.jpg"
        imgAlt="image"
        className=" md:max-w-screen [&>img]:hidden md:[&>img]:w-100 md:[&>img]:p-0 md:[&>*]:p-8 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Create a Account
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className={`mb-4 flex flex-col gap-y-1`}>
            <Label htmlFor="username" color={(formik.touched.username && formik.errors.username) ? "failure": ''}>Your Name</Label>
            <TextInput
              id="username"
              name="username"
              placeholder="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              color={ (formik.touched.username && formik.errors.username) ? "failure": 'gray'}
              helperText={formik.touched.username && formik.errors.username && (
                <span className="failure">{formik.errors.username}</span>
              )}
            />
          </div>
          <div className="mb-4 flex flex-col gap-y-1">
            <Label htmlFor="email" color={(formik.touched.email && formik.errors.email) ? "failure": ''}>Your email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              color={ (formik.touched.email && formik.errors.email) ? "failure": 'gray'}
              helperText={formik.touched.email && formik.errors.email && (
                <span className="failure">{formik.errors.email}</span>
              )}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-1">
            <Label htmlFor="password" color={(formik.touched.password && formik.errors.password) ? "failure": ''}>Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              color={ (formik.touched.password && formik.errors.password) ? "failure": 'gray'}
              helperText={formik.touched.password && formik.errors.password && (
                <span className="failure">{formik.errors.password}</span>
              )}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-1">
            <Label htmlFor="confirmPassword" color={(formik.touched.confirmPassword && formik.errors.confirmPassword) ? "failure": ''}> Confirm password</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              color={ (formik.touched.confirmPassword && formik.errors.confirmPassword) ? "failure": 'gray'}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span className="failure">{formik.errors.confirmPassword}</span>
              )}
            />
          </div>
          <div className="mb-6 flex items-center gap-x-3">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            <Label htmlFor="acceptTerms">
              I accept the&nbsp;
              <a href="#" className="text-primary-700 dark:text-primary-200">
                Terms and Conditions
              </a>
            </Label>
          </div>
          <div className="mb-5">
            <Button type="submit" className="w-full lg:w-auto">
              Create account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Already have an account?&nbsp;
            <Link
              to="/authentication/sign-in"
              className="text-primary-600 dark:text-primary-200"
            >
              Login here
            </Link>
          </p>
        </form>
        <ToastContainer position="top-right" autoClose={2000} />
      </Card>
      <br />
    </div>
  );
};

export default SignUpPage;
