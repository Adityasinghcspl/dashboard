import axios from "axios";
import { Button, Checkbox, Label, Modal, Table, TextInput,} from "flowbite-react";
import { FC, useEffect, useState, useContext } from "react";
import DataContext from "../../context/DataContext";
import { HiOutlineExclamationCircle, HiOutlinePencilAlt,  HiTrash } from "react-icons/hi";
import { api_url } from "../../config";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UserDataItem {
  _id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
}

interface UserModalProps {
  id: number;
}

interface UserModelDate {
  name: string;
  email: string;
  phone: string;
  department: string;
  company: string;
}

export default function AllUsersTable() {
  const userDataString = localStorage.getItem("active_user");
  const activeUser = userDataString ? JSON.parse(userDataString) : null;
  const isAdmin = activeUser?.role === "admin";

  //useContext hooks
  const {  userList } = useContext(DataContext);

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>
            <Label htmlFor="select-all" className="sr-only">
              Select all
            </Label>
            <Checkbox id="select-all" name="select-all" />
          </Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Department</Table.HeadCell>
          <Table.HeadCell>Company</Table.HeadCell>
          {isAdmin? <Table.HeadCell>Actions</Table.HeadCell>: null}
          
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {userList?.map((value:UserDataItem, index:number) => (
            <Table.Row
              key={index}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="w-4 p-4">
                <div className="flex items-center">
                  <Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
                  <label htmlFor="checkbox-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </Table.Cell>
              <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="/images/users/neil-sims.png"
                  alt="Neil Sims avatar"
                />
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {value?.name}
                  </div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {value?.email}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-medium text-gray-900 dark:text-white">
                {value?.phone}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-medium text-gray-900 dark:text-white">
                {value?.department}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                {value?.company}
              </Table.Cell>
              {isAdmin?<Table.Cell>
                <div className="flex items-center gap-x-3 whitespace-nowrap">
                  <EditUserModal id={value?._id} />
                  <DeleteUserModal id={value?._id} />
                </div>
              </Table.Cell>:null}
              
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

const EditUserModal: FC<UserModalProps> = function ({ id }) {
  const [isOpen, setOpen] = useState(false);
  //useContext hooks
  const { status, setStatus } = useContext(DataContext);

  const initialValues: UserModelDate = {
    name: "",
    email: "",
    phone: "",
    department: "",
    company: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone Number must be 10 digits")
      .required("Phone Number is required"),
    department: Yup.string().required("Department is required"),
    company: Yup.string().required("Company is required"),
  });

  const handleSubmit = (values: UserModelDate) => {
    const token = localStorage.getItem('accessToken');
    let config = {
      method: 'put',
      url: `${api_url}` +'/api/contacts/' + id,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  token
      },
      data : values
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 200) {
        formik.resetForm();
          setOpen(!isOpen);
          setStatus(!status)
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    let config = {
      method: "get",
      url: `${api_url}` + "/api/contacts/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          formik.setValues(response.data);
          setStatus(!status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, isOpen]);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-lg" />
          Edit user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit user</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="mt-1">
                  <TextInput id="name" name="name" placeholder="Bonnie" 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    color={ (formik.touched.name && formik.errors.name) ? "failure": 'gray'}
                    helperText={formik.touched.name && formik.errors.name && (
                      <span className="failure">{formik.errors.name}</span>
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
                    placeholder="e.g., +(12)3456 789"
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
              Save all
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

const DeleteUserModal: FC<UserModalProps> = function ({ id }) {
  const [isOpen, setOpen] = useState(false);
  //useContext hooks
  const { status, setStatus } = useContext(DataContext);

  const handleDelete = () => {
    const token = localStorage.getItem("accessToken");
    let config = {
      method: "delete",
      url: `${api_url}` + "/api/contacts/" + id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          setStatus(!status);
          setOpen(!isOpen);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
          Delete user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
