import { React, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Navbar from './Navbar';
import axios from 'axios';


function Dashboard() {
    const [allData, setAllData] = useState([]);
    const token = localStorage.getItem('token');
    // Use token in API requests by setting it in the Authorization header
    const headers = { Authorization: `Bearer ${token}` };

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
    }, [])

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
            {/********************************** Navbar  **************************************/}
            <Navbar handleAscending={ascendingOrder} handleDescending={descendingOrder}/>

            {/************************************ Dashbord Table ******************************/}
            <Table sx={{ minWidth: 700, mt: 9 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>First Name</StyledTableCell>
                        <StyledTableCell align="right">Last Name</StyledTableCell>
                        <StyledTableCell align="right">Email</StyledTableCell>
                        <StyledTableCell align="right">Department</StyledTableCell>
                        <StyledTableCell align="right">Role</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allData.length > 0 ?
                        allData.map((row, index) => (
                            <StyledTableRow key={row._id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.firstName}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.lastName}</StyledTableCell>
                                <StyledTableCell align="right">{row.email}</StyledTableCell>
                                <StyledTableCell align="right">{row.department}</StyledTableCell>
                                <StyledTableCell align="right">{row.role}</StyledTableCell>
                            </StyledTableRow>
                        )) : null}
                </TableBody>
            </Table>

        </>
    );
}
export default Dashboard;