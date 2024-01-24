import { useState, useContext } from "react";
import DataContext from '../../context/DataContext';
import { Button, Label, Modal, TextInput, } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api_url } from '../../config';

interface UserModelDate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  company: string;
}

export default function AddUserModal() {
  const [isOpen, setOpen] = useState(false);
  //useContext hooks
  const { status, setStatus } = useContext(DataContext);
  const initialValues: UserModelDate ={
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    company: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('FirstName is required'),
    lastName: Yup.string().required('LastName is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone Number must be 10 digits')
    .required('Phone Number is required'),
    department: Yup.string().required('Department is required'),
    company: Yup.string().required('Company is required')
  });

  const handleSubmit = (values: UserModelDate) => {
    const token = localStorage.getItem('accessToken');
    let config = {
      method: 'post',
      url: `${api_url}` +'/api/contacts',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  token
      },
      data : values
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 201) {
        toast.success(response.data.msg);
        formik.resetForm();
        setTimeout(()=>{
          setOpen(!isOpen);
          setStatus(!status)
        },2000)
        
      } else {
          toast.error('User is not valid!!')
      }
    })
    .catch((error) => {
      toast.error(error)
      console.log(error);
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add new user</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <div className="mt-1">
                  <TextInput
                    id="firstName"
                    name="firstName"
                    placeholder="Bonnie"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    color={ (formik.touched.firstName && formik.errors.firstName) ? "failure": 'gray'}
                    helperText={formik.touched.firstName && formik.errors.firstName && (
                      <span className="failure">{formik.errors.firstName}</span>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <div className="mt-1">
                  <TextInput
                    id="lastName"
                    name="lastName"
                    placeholder="Green"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    color={ (formik.touched.lastName && formik.errors.lastName) ? "failure": 'gray'}
                    helperText={formik.touched.lastName && formik.errors.lastName && (
                      <span className="failure">{formik.errors.lastName}</span>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="mt-1">
                  <TextInput
                    id="email"
                    name="email"
                    placeholder="example@company.com"
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
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="mt-1">
                  <TextInput
                    id="phone"
                    name="phone"
                    placeholder="e.g., +9934567789"
                    type="tel"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    color={ (formik.touched.phone && formik.errors.phone) ? "failure": 'gray'}
                    helperText={formik.touched.phone && formik.errors.phone && (
                      <span className="failure">{formik.errors.phone}</span>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <div className="mt-1">
                  <TextInput
                    id="department"
                    name="department"
                    placeholder="Development"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.department}
                    color={ (formik.touched.department && formik.errors.department) ? "failure": 'gray'}
                    helperText={formik.touched.department && formik.errors.department && (
                      <span className="failure">{formik.errors.department}</span>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <div className="mt-1">
                  <TextInput
                    id="company"
                    name="company"
                    placeholder="Somewhere"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company}
                    color={ (formik.touched.company && formik.errors.company) ? "failure": 'gray'}
                    helperText={formik.touched.company && formik.errors.company && (
                      <span className="failure">{formik.errors.company}</span>
                    )}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" type="submit">
              Add user
            </Button>
          </Modal.Footer>
          <ToastContainer position="top-right" autoClose={1000} />
        </form>
      </Modal>
    </>
  );
}
