import { IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ResultPanel = () => {
  const [result, setResult] = useState(null);
  const [userName, setUserName] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/submissions/${id}`)
      .then((res) => {
        setResult(res.data);
        fetchUserName(res.data.user._id);
        fetchQuestionTitle(res.data.question.questionId);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const fetchUserName = (userId) => {
    axios
      .get(`http://localhost:8080/api/users/${userId}`)
      .then((res) => {
        setUserName(res.data.user.name);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchQuestionTitle = (questionId) => {
    axios
      .get(`http://localhost:8080/api/questions/${questionId}`)
      .then((res) => {
        setQuestionTitle(res.data.question.title);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!result || !userName || !questionTitle) {
    return <div>Loading...</div>;
  }

  const handleBack = () =>{
    navigate('/dashboard')
  }
  return (
    <div className="contianer">
    <IconButton onClick={handleBack}><ArrowBackIcon/></IconButton>
      <h3>Single Result</h3>
      <div className="card" style={{width:'18rem'}}>
        <div className="card-body">
          <h5 className="card-title">User: {userName}</h5>
          <p className="card-text">Quiz Category: {result.quizCat}</p>
          <p className="card-text">Question: {questionTitle}</p>
          <p className="card-text">Submission Count: {result.submissionCount}</p>
          <details className="card-text">
          <summary>Code:</summary>
          <pre>{result.submission.code}</pre>
          </details>
          <p className="card-text">Score: {result.result}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
