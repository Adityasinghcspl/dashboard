import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Box from '@mui/material/Box';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify';

/******************************* Modal style *****************************/
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

function AdminDashboard() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem('token');
    // Use token in API requests by setting it in the Authorization header
    const headers = { Authorization: `Bearer ${token}` };
    const [allData, setAllData] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', department: '' });
    const [rerenderFlag, setRerenderFlag] = useState(false);
    const [deleteData, setDeleteData] = useState(1)

    const handleNavbarSubmit = () => {
        setRerenderFlag(prevFlag => !prevFlag); // Toggle rerenderFlag to trigger re-render
    };

    const handleOpen = (index) => {
        console.log(allData[index]._id)
        setFormData({
            id: allData[index]._id,
            firstName: allData[index].firstName,
            lastName: allData[index].lastName,
            department: allData[index].department,
        })
        setOpen(true);

    }
    const handleClose = () => { setOpen(false) }
    const handleInputChange = (event) => {
        console.log(event.target.value)
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /********************************* Update data api call ************************/
    const handleSubmit = () => {
        axios.put(`http://localhost:5000/api/employee/${formData.id}`, formData, { headers: headers })
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    setFormData({ firstName: '', lastName: '', email: '', department: '' });
                    setOpen(false)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /********************************** Delete data api call *****************************/
    const handleDelete = (index) => {
        if (allData[index].email != 'admin@gmail.com') {
            axios.delete(`http://localhost:5000/api/employee/${allData[index]._id}`, { headers: headers })
                .then((response) => {
                    console.log(response.data);
                    if (response.status === 200) {
                        setDeleteData(deleteData + 1);
                        toast.success("Delete user successfully");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            toast.error("Admin user is't deleted!")
        }
    }

    /********************************** Table data get api *****************************/
    useEffect(() => {
        axios.get(`http://localhost:5000/api/employee`, { headers: headers })
            .then((response) => {
                if (response.data.status === 200) {
                    setAllData(response.data.employee)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [open, rerenderFlag, deleteData])

    /********************************** Style of the dashboard table *****************************/
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        }
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    /********************************** short the dashboard table *****************************/
    const ascendingOrder = () => {
        const sortedData = [...allData].sort((a, b) => {
            return a.firstName.localeCompare(b.firstName);
        });
        setAllData(sortedData);
    }
    const descendingOrder = () => {
        const sortedData = [...allData].sort((a, b) => {
            return b.firstName.localeCompare(a.firstName);
        });
        setAllData(sortedData);
    }

    return (
        <>
            {/*************************** Modal for update the Dashbord ************************/}
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
                        <TextValidator label="Department" margin="normal" name="department" size="small" value={formData.department} onChange={handleInputChange} validators={['required']} errorMessages={['Password is required']} />
                        <Button variant="contained" size='small' type='submit' sx={{ mt: '20px', mr: '10px' }}>Update</Button>
                        <Button variant="contained" size='small' onClick={handleClose} sx={{ mt: '20px', mr: '10px' }}>Cancel</Button>
                    </ValidatorForm>
                </Box>
            </Modal>

            {/********************************** Navbar  **************************************/}
            <Navbar onSubmit={handleNavbarSubmit} handleAscending={ascendingOrder} handleDescending={descendingOrder} />

            {/************************************ Dashbord Table ******************************/}
            <Table sx={{ minWidth: 700, mt: 9 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">First Name</StyledTableCell>
                        <StyledTableCell align="center">Last Name</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">Department</StyledTableCell>
                        <StyledTableCell align="center">Role</StyledTableCell>
                        <StyledTableCell size='small' align="center">
                            <IconButton aria-label="delete" sx={{ color: '#ffff' }} >
                                <IoMdSettings />
                            </IconButton>
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allData.length > 0 ?
                        allData.map((row, index) => (
                            <StyledTableRow key={row._id}>
                                <StyledTableCell component="th" scope="row" align="center">
                                    {row.firstName}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.lastName}</StyledTableCell>
                                <StyledTableCell align="center">{row.email}</StyledTableCell>
                                <StyledTableCell align="center">{row.department}</StyledTableCell>
                                <StyledTableCell align="center">{row.role}</StyledTableCell>
                                <StyledTableCell align="center" size="small" component="th" scope="row">
                                    <IconButton aria-label="edit" sx={{ color: '#1976d2' }} onClick={() => { handleOpen(index) }}>
                                        <MdEdit />
                                    </IconButton>
                                    <IconButton aria-label="delete" sx={{ color: '#ED4C4C' }} onClick={() => { handleDelete(index) }}>
                                        <MdDelete />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        )) : null}
                </TableBody>
            </Table>
        </>
    );
}
export default AdminDashboard;