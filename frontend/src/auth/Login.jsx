import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'student') {
        navigate('/dashboard');
      } else if (role === 'admin' || role === 'editor') {
        navigate('/admindashboard');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
    }
    const timeout = setTimeout(clearLocalStorage, 3 * 60 * 60 * 1000);
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email === '' || formData.password === '') {
      toast.error('Please fill all fields');
    } else {
      axios
        .post('http://localhost:8080/api/users/login', formData)
        .then((response) => {
          const { token, role, message, userId } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('userId', userId);
          toast.success(message);
          if (!token) {
            navigate('/');
          }
          if (role === 'student') {
            fetchUserInformation(token);
            navigate('/dashboard');
          } else if (role === 'admin' || role === 'editor') {
            fetchUserInformation(token);
            navigate('/admindashboard');
          }
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
          }
        });
    }
  };

  const fetchUserInformation = (token) => {
    axios
      .get('http://localhost:8080/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const { name } = response.data;
        localStorage.setItem('username', name);
      })
      .catch((error) => {
        console.log('Failed to fetch user information', error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='Login-form-container'>
    <form className='Login-form' onSubmit={handleLogin}>
      <div className='Login-form-content'>
        <h3 className='Login-form-title'>Sign In</h3>
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
            <span
              className='password-toggle-icon'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
            </span>
          </div>
        </div>
        <div className='d-flex justify-content-center mt-3'>
          <button type='submit' className='btn btn-primary btn-rounded w-50'>
            Login
          </button>
        </div>
        <p className='register text-center mt-2'>
          New to <Link to="/register">TechBee</Link>
        </p>
        <p className='register text-center mt-2'>
          <Link to="/forgot-password">forgot password</Link>
        </p>
      </div>
    </form>
  </div>
  )
}

export default Login;
