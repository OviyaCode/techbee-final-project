import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const options = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'student', label: 'Student' }
  ];
  // eslint-disable-next-line no-unused-vars
  const [selectRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const handleRoleSelectChange = (selectRole) => {
    setFormData((prevData) => ({
      ...prevData,
      role: selectRole ? selectRole.value : ''
    }));
  };

  const handleCreate = (event) => {
    event.preventDefault();
    if (formData.name === '' || formData.email === '' || formData.password === '' || !formData.role.length) {
      toast.error('Please fill all fields');
    } else {
      axios
        .post('http://localhost:8080/api/users', formData)
        .then((response) => {
          toast.success("User Created Successfully")
          console.log(response.data);
          navigate('/admindashboard/admin')
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
          }
        });
    }
  };

  return (
    <Box sx={{ width: '500px', height: '100%' }}>
      <Box>

      </Box>
      <Box>
        <form onSubmit={handleCreate}>
          <h3>Create User</h3>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter username"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <Select
              name="role"
              options={options}
              value={options.find((option) => option.value === formData.role)}
              onChange={handleRoleSelectChange}
              isClearable={true}
            />
          </div>
          <br />
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Create
            </button>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default UserCreate;
