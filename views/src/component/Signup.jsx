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

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
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
        axios.post('http://localhost:5000/api/employee', formData)
            .then((response) => {
                console.log(response.data);
                if (response.data.status === 200) {
                    toast.success(response.data.msg);
                    setFormData({ firstName: '', lastName: '', email: '', password: '' });
                    setTimeout(function () {
                        navigate('/login');
                    }, 2000);

                } else {
                    toast.error(response.data.msg)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
                <Typography component="h1" variant="h5">Sign Up</Typography>
            </Box>
            <ValidatorForm component="form" onSubmit={handleSubmit} noValidate >
                <TextValidator
                    fullWidth
                    margin="normal"
                    label="First Name"
                    name="firstName"
                    size="small"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    validators={['required', 'isString']}
                    errorMessages={['First Name is required']}
                />
                <TextValidator
                    fullWidth
                    margin="normal"
                    label="Last Name"
                    name="lastName"
                    size="small"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    validators={['required', 'isString']}
                    errorMessages={['Last Name is required']}
                />
                <TextValidator
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    label="Email Address"
                    name="email"
                    size="small"
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
                    SignUp
                </Button>
                <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid item>
                        <Link to="/login" style={linkStyle }>
                            {"Alredy have an account? Log In"}
                        </Link>
                    </Grid>
                </Grid>
                <ToastContainer position="top-right" autoClose={2000} />
            </ValidatorForm>
        </Container>
    );
};

export default Signup;
