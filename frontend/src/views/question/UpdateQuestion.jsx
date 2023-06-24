/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateQuestion = () => {
  const { id } = useParams();

  const [quizValue, setQuizValue] = useState([]);
  const [numTestCase, setNumTestCase] = useState(1);
  const [questionData, setQuestionData] = useState({
    question: '',
    category: '',
    description: '',
    testCases: [
      { input: '', output: '' }
    ]
  });

  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/quizcat");
      setQuizValue(response.data.quizCat);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/api/questions/${id}`)
      .then((res) => {
        const question = res.data.question;
        const { title, description, testCases, categoryData } = question;

        setQuestionData({
          ...questionData,
          question: title,
          description,
          testCases,
          category: categoryData._id
        });

        // Set the number of test cases
        setNumTestCase(testCases.length);
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
      });
  }, [id]);

  const isEditor = localStorage.getItem('role') === 'editor';
  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleNumTestCasesChange = (event) => {
    const value = event.target.value.trim();
    setNumTestCase(value !== '' ? parseInt(value) : 1);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setQuestionData((prevState) => ({
      ...prevState,
      category
    }));
  };

  const handleTestCaseChange = (event, index, field) => {
    const value = event.target.value;
    const updatedTestCases = [...questionData.testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value
    };
    setQuestionData((prevState) => ({
      ...prevState,
      testCases: updatedTestCases
    }));
  };

  const handleQuestionChange = (event) => {
    const question = event.target.value;
    setQuestionData((prevState) => ({
      ...prevState,
      question
    }));
  };

  const handleDescriptionChange = (event) => {
    const description = event.target.value;
    setQuestionData((prevState) => ({
      ...prevState,
      description
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const testCases = questionData.testCases.map((testCase) => ({
      input: testCase.input,
      output: testCase.output
    }));

    const postData = {
      category: questionData.category,
      title: questionData.question,
      description: questionData.description,
      testCases: testCases
    };

    console.log(JSON.stringify(postData, null, 2));

    if (
      questionData.question === '' ||
      questionData.category === '' ||
      questionData.description === '' ||
      questionData.testCases.some((testCase) => testCase.input === '' || testCase.output === '')
    ) {
      toast.error('Please fill in all fields');
    } else {
      // Send the PUT request
      console.log(questionData.question + '\n' + questionData.category + '\n' + questionData.description + '\n' + questionData.testCases);
      axios
        .put(`http://localhost:8080/api/questions/${id}`, postData)
        .then((res) => {
          toast.success('Question updated successfully');
          console.log(res.data);
          navigate('/admindashboard/question');
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
          }
        });
    }
  };

  const renderTestCases = () => {
    const testCases = [];
    for (let i = 0; i < numTestCase; i++) {
      const testCase = questionData.testCases[i] || { input: '', output: '' };
      testCases.push(
        <div className="form-group col-md-6" key={i}>
          <div className="form-group">
            <label htmlFor={`input${i}`} className="form-label">Input {i + 1}</label>
            <input
              type="text"
              className="form-control"
              id={`input${i}`}
              name={`input${i}`}
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(e, i, 'input')}
              readOnly={!isEditor}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`output${i}`} className="form-label">Output {i + 1}</label>
            <input
              type="text"
              className="form-control"
              id={`output${i}`}
              name={`output${i}`}
              value={testCase.output}
              onChange={(e) => handleTestCaseChange(e, i, 'output')}
              readOnly={!isEditor}
            />
          </div>
        </div>
      );
    }
    return testCases;
  };

  const handleCancel = () => {
    navigate('/admindashboard/question');
  };

  return (
    <div className="container">
      <form onSubmit={handleUpdate}>
        <h2>Update Question</h2>
        <div className="form-row">
          <div className="form-group col-lg-3 col-sm-6">
            <label htmlFor="category">Select the category</label>
            <select
              name="category"
              value={questionData.category}
              className="form-select"
              onChange={handleCategoryChange}
              disabled={!isEditor}
            >
              {quizValue.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.name} / {option.difficulty} / {option.type}
                </option>
              ))}
            </select>
            <span style={{ marginTop: '1em', marginLeft: '.1em', fontSize: '.8em', color: '#344' }}>
              Select the difficulty and proficiency levels
            </span>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-5">
            <label htmlFor="question">Enter the question title</label>
            <input
              type="text"
              className="form-control"
              id="question"
              name="question"
              value={questionData.question}
              placeholder="Enter the question title..."
              onChange={handleQuestionChange}
              readOnly={!isEditor}
            />
          </div>
          <div className="form-group col-md-5">
            <label htmlFor="question">Enter the question description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={questionData.description}
              placeholder="Enter the question description..."
              onChange={handleDescriptionChange}
              readOnly={!isEditor}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-3">
            <label htmlFor="numTestCases">Number of Test Cases</label>
            <input
              type="number"
              className="form-control"
              id="numTestCases"
              name="numTestCases"
              min="1"
              value={numTestCase}
              onChange={handleNumTestCasesChange}
              disabled={!isEditor}
            />
          </div>
        </div>
        <div className="row">{renderTestCases()}</div>
        <div className="form-row" style={{marginTop:'1em'}}>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary" style={{marginRight:'.8em'}} disabled={!isEditor}>
              Update
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateQuestion;
