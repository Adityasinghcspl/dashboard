import { React, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#1976d2',
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:5000/api/employee/login`, formData)
            .then((response) => {
                console.log(response.data)
                if (response.data.status === 200) {
                    toast.success(response.data.msg);
                    setFormData({ email: '', password: '' });
                    navigate('/dashboard');
                    const token = response.data.token;
                    // Store token in localStorage or sessionStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('userData', JSON.stringify({"userName":response.data.userName,"id":response.data.id,"role":response.data.role}));
                } else {
                    toast.error(response.data.msg)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box sx={{ mt: 15, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
                    <Typography component="h1" variant="h5">Log In</Typography>
                </Box>
                <ValidatorForm component="form" onSubmit={handleSubmit} noValidate >
                    <TextValidator
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        label="Email Address"
                        size="small"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        validators={['required', 'isEmail']}
                        errorMessages={['Email is required', 'Email is not valid']}
                    />
                    <TextValidator
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        label="Password"
                        type="password"
                        name="password"
                        size="small"
                        value={formData.password}
                        onChange={handleInputChange}
                        validators={['required']}
                        errorMessages={['Password is required']}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
                        LogIn
                    </Button>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Grid item >
                            <Link to="/signup" style={linkStyle}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                    <ToastContainer position="top-right" autoClose={2000} />
                </ValidatorForm>
            </Container>
        </>
    )
}
