import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { TiTick } from 'react-icons/ti';
import {AiFillCloseCircle} from 'react-icons/ai'

const ResetPassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleVerifyOTP = () => {
        axios.post('http://localhost:8080/api/verifyOTP', { email: formData.email, otp: formData.otp })
            .then((response) => {
                if (response.data.isValid) {
                    setOtpVerified(true);
                    toast.success('OTP verified successfully')
                }
                else {
                    toast.error('Invalid OTP')
                }
            })
            .catch((error) => {
                console.error('Error verifying OTP:', error);
                toast.error('Error in verifying OTP')
            })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        let hasError = false;

        if (formData.email === '' || formData.otp === '' || formData.confirmPassword === '' || otpVerified === false) {
            toast.error("Please fill all fields")
            hasError = true
        }
        else if (!otpVerified) {
            toast.error("Please verify otp")
            hasError = true
        }
        else {
            axios.post('http://localhost:8080/api/users', formData)
                .then((response) => {
                    console.log(response.data);
                    localStorage.setItem(response.data.token)
                    toast.success('Reset password successfully')
                    navigate('/')
                    hasError = false;
                })
                .catch((error) => {
                    if (error.response) {
                        const errorMessage = error.response.data.message;
                        // console.log(errorMessage);
                        toast.error(errorMessage)
                        hasError = true;
                        if (errorMessage === 'Something went wrong...!') {
                            hasError = true;
                        }

                    }
                })
                .finally(() => {
                    if (!hasError) {
                        // console.log("hasError function :", hasError)
                        navigate('/')
                    }
                })
        }


    };
    return (
        <div className='Login-form-container'>
            <form className='Login-form' onSubmit={handleSubmit}>
                <div className='Login-form-content'>
                    <h3 className='Login-form-title'>Reset Password</h3>
                    <div className='form-group mt-3'>

                    </div>
                    <div className='form-group mt-3'>
                        <label>Email</label>
                        <input
                            type='email'
                            className='form-control mt-1'
                            name='email'
                            placeholder='Enter email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group mt-1'>
                        <label>OTP</label>
                        <div className='password-input-container'>
                            <input
                                type='test'
                                className='form-control mt-1'
                                name='otp'
                                placeholder='Type your OTP'
                                value={formData.otp}
                                onChange={handleChange}
                            />
                            <span className='password-toggle-icon' onClick={handleVerifyOTP}>
                                {showPassword ? <TiTick /> : <AiFillCloseCircle />}
                            </span>
                        </div>
                    </div>
                    <div className='form-group mt-3'>
                        <label>Reset Password</label>
                        <div className='password-input-container'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='form-control mt-1 password-input'
                                name='password'
                                placeholder='Enter password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span className='password-toggle-icon' onClick={togglePasswordVisibility}>
                                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                            </span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <button type='submit' className='btn btn-primary btn-rounded w-50'>
                            Reset password
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword;