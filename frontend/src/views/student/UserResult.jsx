/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";

const UserResults = () => {
  const [userResult, setUserResult] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [userName, setUserName] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

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
    return <p>No Records Found</p>;
  }

  const handleResultClick = (result) => {
    setSelectedResult((prevState) => (prevState === result ? null : result)); // Toggle selected result visibility
  };

  return (
    <div className="container">
      <h4>Your Results</h4>
      <table className="table table-bordered table-hover table-dark" style={{ width: '60%' }}>
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
          {userResult.map((submission, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
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
    </div>
  );
};

export default UserResults;
