import { FC, useEffect, useState } from "react";
import { DarkThemeToggle, Navbar, Avatar, Dropdown } from "flowbite-react";
import { To, useNavigate } from 'react-router-dom';
import axios from "axios";
import {api_url} from '../config'

interface UserData {
  _id: string;
  email: string;
  username: string;
  role: string;
}

const ExampleNavbar: FC = function () {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState<UserData | null>(null);
  const token = localStorage.getItem('accessToken');

  useEffect(()=>{
    let config = {
      method: 'get',
      url: `${api_url}` +'/api/users/current',
      headers: {
        'Authorization': 'Bearer ' +  token
      }
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 200) {        
        setActiveUser(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  },[token])

  const handleDropdownItemClick = (path: To) => {
    navigate(path);
  };

  const handleSignOut =()=>{
    localStorage.clear();
    navigate('/authentication/sign-in')
  }
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img alt="" src="/images/logo.svg" className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                iPangram
              </span>
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex md:order-2">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="User settings"
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{activeUser?.username}</span>
                  <span className="block truncate text-sm font-medium">
                  {activeUser?.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item onClick={() => handleDropdownItemClick('/')}>Dashboard</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDropdownItemClick('/users/list')}>Users</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
              </Dropdown>
              <Navbar.Toggle />
            </div>
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
