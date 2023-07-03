import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const QuestionList = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/questions/category/${id}`)
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleAttempt = (categoryName, questionId, questionTitle, questionDescription) => {
    const targetQuestion = question.questions.find(q => q._id === questionId);
    const formattedTestcases = targetQuestion.testCases.map(testcase => ({
      input: testcase.input,
      output: testcase.output
    }));

    console.log('categoryName:', categoryName);
    console.log('questionId:', questionId);
    console.log('questionTitle:', questionTitle);
    console.log('questionDescription:', questionDescription);
    console.log('questionTestcases:', formattedTestcases);

    navigate(`/dashboard/code`, {
      state: {
        categoryName,
        questionId,
        questionTitle,
        questionDescription,
        questionTestcases: formattedTestcases
      }
    });
  };

  return (
    <>
      <div className='container'>
        <h5>{question.category}</h5>
        <div className='row'>
          <div className='col-12 col-md-8'>
            {question &&
              question.questions.map((q) => (
                <div className='card text-white bg-dark mb-3' key={q._id}>
                  <div className='card-body d-flex justify-content-between' style={{display:"inline-flex"}}>
                    <div className='col-8'><h6>{q.title}</h6></div>
                    <StarBorderIcon/>
                    <button
                      className="btn btn-light"
                      onClick={() =>
                        handleAttempt(
                          question.category,
                          q._id,
                          q.title,
                          q.description
                        )}
                    >
                      Solve Challenge
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className='col-12 col-md-4'>
            lorem
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionList;