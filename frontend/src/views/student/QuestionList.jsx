import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
        <h5>You choose {question.category} category</h5>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {question && question.questions.map((q) => (
              <tr key={q._id}>
                <th scope="row">{q.title}</th>
                <th scope="row">{q.description}</th>
                <th scope="row">
                  <button className='btn btn-success'
                    onClick={() =>
                      handleAttempt(
                        question.category,
                        q._id,
                        q.title,
                        q.description
                      )}>Attempt</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QuestionList;