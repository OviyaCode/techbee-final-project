/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";

const UserResults = () => {
  const [userResult, setUserResult] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/submissions/${id}`);
        const submissionData = response.data.submissions;

        const fetchedSubmission = await Promise.all(submissionData.map(async (submission) => {
          const code = submission.code;
          const userId = submission.user;
          const questionId = submission.question._id;
          const score = submission.score;

          // Fetch user details
          const userResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
          const user = userResponse.data.user.name;

          // Fetch question details
          const questionResponse = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
          const question = questionResponse.data.question.title;

          const categoryData = questionResponse.data.question.categoryData;
          const categoryName = categoryData.name;

          return {
            code,
            user,
            question,
            score,
            categoryName
          };
        }));

        setUserResult(fetchedSubmission);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (userResult.length === 0) {
    return <p>No Records Found <span style={{ color: "#666", cursor: 'pointer', fontSize: '.8em' }}>click to go back</span></p>;
  }

  // Calculate the index of the last and first user for the current page
  const indexOfLastUser = currentPage * resultsPerPage;
  const indexOfFirstUser = indexOfLastUser - resultsPerPage;
  const currentUsers = userResult.slice(indexOfFirstUser, indexOfLastUser);

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleResultClick = (result) => {
    setSelectedResult((prevState) => (prevState === result ? null : result)); // Toggle selected result visibility
  };

  return (
    <div className="container">
      <h4>Your Results</h4>
      <table className="table table-bordered table-hover table-dark" style={{ width: '80%' }}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Quiz Category</th>
            <th scope="col">Completed</th>
            <th scope="col">Score</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((submission, index) => (
            <tr key={index}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{submission.categoryName}</td>
              <td>{submission.question}</td>
              <td>{submission.score}</td>
              <td>
                <IconButton onClick={() => handleResultClick(submission)}>
                  <VisibilityIcon sx={{ color: "#d1d1d1" }} />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedResult && (
        <div className="result">
          <h5>Selected Result:</h5>
          <p>Quiz Category: {selectedResult.categoryName}</p>
          <p>Completed: {selectedResult.question}</p>
          <p>Score: {selectedResult.score}</p>
          <details>
            <summary>Code:</summary>
            <pre>{selectedResult.code}</pre>
          </details>
        </div>
      )}

      {/* Pagination */}
      <nav style={{marginTop:'2em'}}>
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(userResult.length / resultsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className='page-link' onClick={() => paginate(i + 1)} style={{
                backgroundColor: currentPage === i + 1 ? '#333' : '#666',
                color: currentPage === i + 1 ? '#f2f2f2' : '#fff'
              }}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>


    </div>
  );
};

export default UserResults;
