/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import jwt from 'jsonwebtoken';

const QuestionList = () => {
  const [question, setQuestion] = useState(null);
  const [questionIds, setQuestionIds] = useState([]);
  const [attempt, setAttempt] = useState([]);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSolved, setShowSolved] = useState(false);
  const [showUnsolved, setShowUnsolved] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = jwt.decode(token);
  const userId = decodedToken ? decodedToken.id : '';

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/questions/category/${id}`)
      .then((res) => {
        setQuestion(res.data);
        const questionIds = res.data.questions.map((q) => q._id); // Collect all question IDs
        setQuestionIds(questionIds);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          const errMsg = error.response.data.message;
          console.log(errMsg);
        }
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchQuestionStatus = async () => {
      for (const questionId of questionIds) {
        try {
          const response = await axios.get(`http://localhost:8080/api/submissions/${userId}/${questionId}`);
          const statuses = response.data.submissions.map((submission) => ({
            questionId: submission.question,
            status: submission.status
          }));
          if (statuses.length > 0) {
            setState((prev) => [...prev, ...statuses]);
          }
        } catch (error) {
          if (error.response) {
            const errMsg = error.response.data.message;
            console.log(errMsg);
          }
        }
      }
    };

    fetchQuestionStatus();
  }, [userId, questionIds]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleAttempt = (categoryName, questionId, questionTitle, questionDescription) => {
    const targetQuestion = question.questions.find((q) => q._id === questionId);
    const formattedTestcases = targetQuestion.testCases.map((testcase) => ({
      input: testcase.input,
      output: testcase.output
    }));
  
    const attemptCount = state.filter((s) => s.questionId === questionId).length;
    const isAttemptDisabled = attemptCount >= 3;
  
    if (!isAttemptDisabled) {
      navigate(`/dashboard/code`, {
        state: {
          categoryName,
          questionId,
          questionTitle,
          questionDescription,
          questionTestcases: formattedTestcases
        }
      });
    }
  };
  

  const toggleShowSolved = () => {
    setShowSolved(!showSolved);
  };

  const toggleShowUnsolved = () => {
    setShowUnsolved(!showUnsolved);
  };

  const filteredQuestions = question.questions.filter((q) => {
    const questionState = state.find((s) => s.questionId === q._id)?.status;
    if ((!showSolved && !showUnsolved) || (showSolved && questionState === 'solved') || (showUnsolved && questionState !== 'solved')) {
      return true;
    }
    return false;
  });

  return (
    <>
      <div className='container'>
        <h5>{question.category}</h5>
        <div className='row'>
          <div className='col-12 col-md-8'>
            {filteredQuestions.map((q) => {
              const questionState = state.find((s) => s.questionId === q._id)?.status;
              const attemptCount = state.filter((s) => s.questionId === q._id).length;
              const isAttemptDisabled = attemptCount >= 3;

              return (
                <div className='card text-white bg-dark mb-3' key={q._id}>
                  <div className='card-body d-flex justify-content-between' style={{ display: 'inline-flex' }}>
                    <div className='col-8'>
                      <h6>{q.title}</h6>
                    </div>

                    {questionState === 'solved' ? (
                      <StarIcon sx={{ color: '#FFBF00' }} />
                    ) : (
                      <StarBorderIcon />
                    )}

                    <button
                      className='btn btn-success'
                      onClick={() =>
                        handleAttempt(question.category, q._id, q.title, q.description)
                      }
                      disabled={isAttemptDisabled}
                    >
                      {isAttemptDisabled ? 'Attempt Limit Exceeded' : 'Attempt'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='col-12 col-md-4'>
            <div className='mb-3'>
              <label style={{color:"#777"}}>
                <input
                  type='checkbox'
                  checked={showSolved}
                  onChange={toggleShowSolved}
                  style={{ marginRight: '0.5rem' }}
                />{' '}
                Solved
              </label>
            </div>
            <div className='mb-3'>
              <label style={{color:"#777"}}>
                <input
                  type='checkbox'
                  checked={showUnsolved}
                  onChange={toggleShowUnsolved}
                  style={{ marginRight: '0.5rem' }}
                />{' '}
                Unsolved
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionList;
