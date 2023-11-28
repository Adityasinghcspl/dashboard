import { React, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify';
import { BiFilterAlt } from "react-icons/bi";


const settings = ['Profile', 'Logout'];

/******************* Modal style *****************/
const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 220,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Navbar({ onSubmit, handleAscending, handleDescending  }) {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });

    /*************************** Modal open to create the Dashbord **********************/
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false) }
    const handleInputChange = (event) => {
        console.log(event.target.value)
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const triggerUpdate = (data) => {
        return data;
    }

    const handleSubmit = () => {
        axios.post('http://localhost:5000/api/employee', formData)
            .then((response) => {
                console.log(response.data);
                if (response.data.status === 200) {
                    toast.success(response.data.msg);
                    setFormData({ firstName: '', lastName: '', email: '', password: '' });
                    triggerUpdate(response.data.email)
                    setOpen(false);
                    onSubmit();
                } else {
                    toast.error(response.data.msg)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /*********************************** User Setting functions*************************************/
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Function to extract the first character from the user's name
    const getFirstChar = (name) => {
        return name.charAt(0).toUpperCase();
    };

    /*************************** Logout user function ************************/
    const handleSettingClick = (setting) => () => {
        console.log(`Clicked setting: ${setting}`);
        handleCloseUserMenu();
        if (setting === 'Logout') {
            localStorage.clear();
            navigate('/login')
        }
    };

    /*************************** filter function ************************/
    // Function to handle opening the filter menu
    const handleOpenFilterMenu = (event) => {
        setAnchorElFilter(event.currentTarget); // Set the anchor element to the clicked button
    };

    // Function to handle closing the filter menu
    const handleCloseFilterMenu = () => {
        setAnchorElFilter(null); // Reset anchor element to null to close the menu
    };

    // const handleAscending = () => {
    //         ascendingOrder(); 
    // };

    // const handleDescending = () => {
    //         descendingOrder();
    // };

    return (
        <>
            {/*************************** Modal for create the Dashbord Name ************************/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                        Dashboard User
                    </Typography><br />
                    <ValidatorForm component="form" onSubmit={handleSubmit} noValidate >
                        <TextValidator label="First Name" margin="normal" name="firstName" size="small" value={formData.firstName} onChange={handleInputChange} validators={['required', 'isString']} errorMessages={['First Name is required']} />
                        <TextValidator label="Last Name" margin="normal" name="lastName" size="small" value={formData.lastName} onChange={handleInputChange} validators={['required', 'isString']} errorMessages={['Last Name is required']} />
                        <TextValidator label="Email Address" margin="normal" name="email" size="small" value={formData.email} onChange={handleInputChange} validators={['required', 'isEmail']} errorMessages={['Email is required', 'Email is not valid']} />
                        <TextValidator label="Password" margin="normal" type="password" name="password" size="small" value={formData.password} onChange={handleInputChange} validators={['required']} errorMessages={['Password is required']} />
                        <Button variant="contained" size='small' type='submit' sx={{ mt: '20px', mr: '10px' }}>Create</Button>
                        <Button variant="contained" size='small' onClick={handleClose} sx={{ mt: '20px', mr: '10px' }}>Cancel</Button>
                    </ValidatorForm>
                </Box>
            </Modal>

            {/****************************************** App bar **************************************/}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar >
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Dashboard
                        </Typography>
                        <BiFilterAlt size={25} onClick={handleOpenFilterMenu} />
                        <Menu
                            id="menu-filter"
                            anchorEl={anchorElFilter}
                            keepMounted
                            open={Boolean(anchorElFilter)}
                            onClose={handleCloseFilterMenu}
                        >
                            {/* Your filter options */}
                            <MenuItem onClick={handleAscending}>
                                Ascending Order
                            </MenuItem>
                            <MenuItem onClick={handleDescending}>
                                Descending Order
                            </MenuItem>
                            {/* Add more menu items for other filter options */}
                        </Menu>
                        {userData.role === 'admin' ?
                            <Button color="inherit" style={{ textTransform: 'capitalize' }} onClick={handleOpen}>Create User</Button> : null
                        }
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    {/* Display the first character of the user's name in the Avatar */}
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        {getFirstChar(userData.userName)}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleSettingClick(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                <ToastContainer position="top-right" autoClose={2000} />
            </Box>
        </>
    );
}
export default Navbar;