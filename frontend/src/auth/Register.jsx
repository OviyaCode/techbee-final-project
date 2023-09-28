import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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


  const handleSubmit = (event) => {
    event.preventDefault();
    let hasError = false;
    if (formData.name === '' || formData.email === '' || formData.password === '' || formData.confirmPassword === '') {
      toast.error("Please fill all fields")
      hasError = true
    }
    else if (formData.password !== formData.confirmPassword) {
      toast.error("Password doesn't match")
      hasError = true
    }
    else {
      axios.post('http://localhost:8080/api/users', formData)
        .then((response) => {
          console.log(response.data);
          localStorage.setItem(response.data.token)
          toast.success('Account created successfully')
          hasError = false;
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            // console.log(errorMessage);
            toast.error(errorMessage)
            hasError = true;
            if (errorMessage === 'User already exists') {
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
          <h3 className='Login-form-title'>Sign Up</h3>
          <div className='form-group mt-3'>
            <label>Username</label>
            <input
              type='text'
              className='form-control mt-1'
              name='name'
              placeholder='Enter username'
              value={formData.name}
              onChange={handleChange}
            />
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
              Register
            </button>
          </div>
          <p className='register text-center mt-2'>Already have <Link to="/">an account</Link> </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
