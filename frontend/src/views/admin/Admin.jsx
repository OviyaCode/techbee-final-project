import { useEffect, useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

const Admin = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/users")
      .then(res => {
        console.log(res.data.users);
        setUserData(res.data.users);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:8080/api/users/${id}`)
      .then(() => {
        toast.success("User deleted successfully");
        fetchUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreate = () => {
    navigate('/admindashboard/admin/create');
  };

  const isAdmin = localStorage.getItem('role') === 'admin';
  const isEditor = localStorage.getItem('role') === 'editor';

  const handleBack = () => {
    navigate(-1);
  };

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className='container'>
        <Typography sx={styles.pageTitle} variant='h5'>Manage Users</Typography>
        {isAdmin && (
          <Button variant='contained' color='success' onClick={handleCreate} sx={{ marginBottom: 4 }}>Create</Button>
        )}
        <Button variant='outline' onClick={handleBack} sx={{ marginBottom: 4, marginLeft: 4 }}>Back</Button>
        <Button variant='outline' onClick={handleRefresh} sx={{ marginBottom: 4 }}><RefreshIcon /></Button>

        <table className='table' style={{ width: '70%', alignContent: 'center' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) =>
              <tr key={user._id}>
                <td>{index + 1 + (currentPage - 1) * usersPerPage}</td>
                <td>{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</td>
                <td>{user.email}</td>
                <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td>
                  {isEditor ? (
                    <>
                      <Link style={{ color: '#222' }} to={`/admindashboard/admin/update/${user._id}`}>
                        <IconButton><VisibilityIcon /></IconButton>
                      </Link>
                    </>
                  ) : (
                    <>
                      {isAdmin && (
                        <>
                          <Link style={{ color: '#222' }} to={`/admindashboard/admin/update/${user._id}`}><IconButton><EditIcon /></IconButton></Link>
                          <IconButton onClick={() => handleDelete(user._id)}><DeleteIcon /></IconButton>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <ul className='pagination'>
            {Array.from({ length: Math.ceil(userData.length / usersPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className='page-link' onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Admin;

const styles = {
  pageTitle: {
    mb: 2
  },
  buttons: {
    color: 'grey'
  }
};
