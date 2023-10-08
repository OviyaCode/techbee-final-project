import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const ResetPassword = () => {

    const { id , token} = useParams();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(id);
        axios.put(`http://localhost:8080/api/users/reset-password/${id}/${token}`, formData)
            .then((res) => {
                toast.success("Password changed")
                console.log('Password changed');
                console.log(res.data);
                navigate('/')
            })
    }
    return (
        <div className='Login-form-container'>
            <form className='Login-form' onSubmit={handleSubmit}>
                <div className='Login-form-content'>
                    <h3 className='Login-form-title'>Reset Password</h3>
                    <div className='form-group mt-3'>

                    </div>
                    <div className='form-group mt-3'>
                        <label>Password</label>
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
                    <div className='form-group mt-3'>
                        <label>Confirm Password</label>
                        <div className='password-input-container'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className='form-control mt-1 password-input'
                                name='confirmPassword'
                                placeholder='Retype password'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <span className='password-toggle-icon' onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                            </span>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center mt-3'>
                        <button type='submit' className='btn btn-primary btn-rounded w-50'>
                            Change Password
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword