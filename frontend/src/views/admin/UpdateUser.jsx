import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
const UpdateUser = () => {

  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: ''
  })

  const options = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'student', label: 'Student' }
  ];
  useEffect(() => {
    axios.get('http://localhost:8080/api/users/' + id)
      .then((res) => {
        console.log(res.data.user);
        setFormData({
          email: res.data.user.email,
          name: res.data.user.name,
          role: res.data.user.role,
        })
      })
  }, [id])

  // eslint-disable-next-line no-unused-vars
  const [selectRole, setSelectedRole] = useState('');

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleRoleSelectChange = (selectRole) => {
    setFormData((prevData) => ({
      ...prevData,
      role: selectRole ? selectRole.value : ''
    }));
  };
  const handleUpdate = (e) => {
    e.preventDefault()
    console.log(formData.name + '' + formData.email + '' + formData.role);
    axios.put(`http://localhost:8080/api/users/${id}`, formData)
      .then((res) => {
        console.log('Update Successfully');
        console.log(res.data);
        navigate('/admindashboard/admin')
      })
  }

  const isAdmin = localStorage.getItem('role') === 'admin';

  const handleCancel = () => {
    navigate('/admindashboard/admin')
  }
  return (
    <Box sx={{ width: '500px', height: '100%' }}>
      <Box>

      </Box>
      <Box>
        <form onSubmit={handleUpdate}>
          <h3>Update User</h3>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter username"
              value={formData.name}
              onChange={handleChange}
              readOnly={!isAdmin}
            />
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isAdmin}
            />
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Role</label>
            <Select
              name="role"
              options={options}
              value={options.find((option) => option.value === formData.role)}
              onChange={handleRoleSelectChange}
              isClearable={true}
              isDisabled={!isAdmin}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={!isAdmin} style={{ marginRight: 10 }}>
              Update
            </button>
            <button type="submit" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </Box>
  )
}

export default UpdateUser