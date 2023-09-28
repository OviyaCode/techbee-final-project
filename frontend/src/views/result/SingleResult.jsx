/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, IconButton } from "@mui/material";
import axios from "axios";

const SingleResult = () => {
  const [userResult, setUserResult] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [userName, setUserName] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/submissions/${id}`);
        const submissionData = response.data.submissions;

        const fetchedSubmission = await Promise.all(
          submissionData.map(async (submission) => {
            const code = submission.code;
            const userId = submission.user;
            const questionId = submission.question._id;
            const score = submission.score;

            // Fetch user details
            const userResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
            const user = userResponse.data.user.name;
            setUserName(user);

            // Fetch question details
            const questionResponse = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
            const question = questionResponse.data.question.title;
            setQuestionTitle(question);

            const categoryData = questionResponse.data.question.categoryData;
            const categoryName = categoryData.name;

            return {
              code,
              user,
              question,
              score,
              categoryName,
            };
          })
        );

        setUserResult(fetchedSubmission);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSubmission();
  }, [id]);

  if (userResult.length === 0) {
    return <p>No Records Found</p>;
  }

  // Calculate the index of the first user for the current page
  const indexOfFirstUser = (currentPage - 1) * usersPerPage;

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleResultClick = (result) => {
    setSelectedResult((prevState) => (prevState === result ? null : result)); // Toggle selected result visibility
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <Button variant="contained" onClick={handleBack} sx={{ marginBottom: 4 }}>
        Back
      </Button>
      <h5>Results of {userName}</h5>
      <table className="table table-bordered table-hover" style={{ width: "60%" }}>
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
          {userResult.slice(indexOfFirstUser, indexOfFirstUser + usersPerPage).map((submission, index) => (
            <tr key={index}>
              <td>{indexOfFirstUser + index + 1}</td> {/* Calculate the correct index */}
              <td>{submission.categoryName}</td>
              <td>{submission.question}</td>
              <td>{submission.score}</td>
              <td>
                <IconButton onClick={() => handleResultClick(submission)}>
                  <VisibilityIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(userResult.length / usersPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {selectedResult && (
        <div>
          <h5>Selected Result:</h5>
          <p>Quiz Category: {selectedResult.categoryName}</p>
          <p>Completed: {selectedResult.question}</p>
          <p>Score: {selectedResult.score}</p>
          <details open>
            <summary>Code:</summary>
            <pre>{selectedResult.code}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default SingleResult;
