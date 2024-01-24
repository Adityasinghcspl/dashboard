import { Breadcrumb, Button, Label, TextInput } from "flowbite-react";
import DataContext from '../../context/DataContext';
import { FC, useContext, useEffect, useState } from "react";
import { HiDocumentDownload, HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import AddUserModal from "./AddUserModal";
import AllUsersTable from "./AllUsersTable";
import { api_url } from "../../config";
import axios from "axios";

const UserListPage: FC = function () {
  const userDataString = localStorage.getItem("active_user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const isAdmin = userData?.role === "admin";

  //useContext hooks
  const { userList, setUserList, status, setStatus } = useContext(DataContext);
  const [searchUserName, setSearchUserName] = useState<string | ''>('');

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    let config = {
      method: "get",
      url: `${api_url}` + "/api/contacts",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          setUserList(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [status]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setSearchUserName(name);
  };

  useEffect(()=>{
    if (Array.isArray(userList)) {
      if(searchUserName.length > 0){
        const result = userList.filter((item) =>item.name.toLowerCase().includes(searchUserName.toLowerCase()));
        if (result.length > 0) {
          setTimeout(()=>{
            setUserList(result);
          },1000)
        }
      }else{
        setStatus(!status);
      }
    }
  },[searchUserName])

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/users/list">Users</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All users
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for users"
                    value={searchUserName!}
                    onChange={handleInputChange}
                  />
                </div>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              {isAdmin ? <AddUserModal /> : null}
              <Button color="gray">
                <div className="flex items-center gap-x-3">
                  <HiDocumentDownload className="text-xl" />
                  <span>Export</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllUsersTable />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default UserListPage;
