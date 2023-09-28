/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://localhost:8080/api/submissions')
      .then((res) => {
        setResults(res.data.submissions);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userIds = results.map(result => result.user?._id);
        if (userIds.length > 0) {
          const response = await axios.get('http://localhost:8080/api/users', { params: { ids: userIds } });
          const users = response.data.users;

          const updatedResults = results.map(result => {
            const user = users.find(u => u._id === result.user?._id);
            return {
              ...result,
              user: user ? user : null
            };
          });

          setResults(updatedResults);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, [results]);

  const handleBack = () => {
    navigate('/admindashboard');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (results.length === 0) {
    return (
      <p onClick={handleBack}>
        No Records found. <span style={{ color: "#666", cursor: 'pointer', fontSize: '.8em' }}>click to go back</span>
      </p>
    );
  }

  // Create an object to store user data and their attempt questions
  const userAttempts = {};
  results.forEach(result => {
    const userId = result.user?._id;
    if (!userAttempts[userId]) {
      userAttempts[userId] = { user: result.user, questions: [] };
    }
    userAttempts[userId].questions.push(result);
  });

  // Calculate the index of the last and first user for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Object.values(userAttempts).slice(indexOfFirstUser, indexOfLastUser);

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <Button variant="contained" onClick={handleBack} sx={{ marginBottom: 4 }}>Back</Button>

      <h2>Results</h2>

      <table className='table' style={{ width: '70%', alignContent: 'center' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((userAttempt, index) =>
            <tr key={index}>
              <td>{indexOfFirstUser + index + 1}</td> {/* Calculate the correct index */}
              <td>{userAttempt.user ? userAttempt.user.name : '-'}</td>
              <td>
                <Link to={`/admindashboard/results/view/${userAttempt.user && userAttempt.user._id}`}>
                  <IconButton><VisibilityIcon /></IconButton>
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(Object.values(userAttempts).length / usersPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className='page-link' onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Results;

