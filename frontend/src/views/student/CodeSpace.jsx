/* eslint-disable no-unused-vars */
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-twilight';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'
const CodeSpace = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { categoryName, questionId, questionTitle, questionDescription, questionTestcases } = location.state;
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token');
  const decodedToken = jwt.decode(token);
  const userId = decodedToken ? decodedToken.id : '';
  const [testResult, setTestResult] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);



  const [codeData, setCodeData] = useState({
    user: userId,
    code: '',
    language: '62',
    questionId: questionId,
    testCases: questionTestcases || [],
    overAllResult: ''
  });

  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    setCodeData((prevCodeData) => ({
      ...prevCodeData,
      language: selectedLanguage,
    }));
    if (error && codeData.code === '') {
      setError(null);
    }
  };

  const handleRun = async (e) => {
    e.preventDefault();
    setError(null)

    try {

      const { questionId, testCases, code, language, user } = codeData;

      
      // console.log("User ID:", user);

      setLoading(true)
      setExecuting(true)

      const formattedTestCases = testCases.map((testCase) => {
        let formattedInput;
        let formattedOutput;

        if (testCase.input.startsWith('[') && testCase.input.endsWith(']')) {
          // Array input
          formattedInput = JSON.parse(testCase.input);
        } else {
          // String input
          formattedInput = testCase.input;
        }

        if (testCase.output.startsWith('[') && testCase.output.endsWith(']')) {
          // Array output
          formattedOutput = JSON.parse(testCase.output);
        } else {
          // String output
          formattedOutput = testCase.output;
        }

        return {
          input: formattedInput,
          output: formattedOutput,
        };
      });

      const requestData = {
        userId: codeData.user,
        questionId: questionId,
        code: code,
        languageId: language,
        testCases: formattedTestCases,
      };
      console.log(JSON.stringify(requestData, null, 2));
      
      await axios.post(`http://localhost:8080/api/submissions/${questionId}`, requestData).then((res) => {
        console.log(res.data.results);
        const result = res.data.results[0];

        setTestResult(result.finalAnswer);
        setSubmissionId(res.data.submissionToken);


      });
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
      setExecuting(false)
    }
  };

  console.log("submissionId :", submissionId)
  const handleSubmission = async (e) => {
    e.preventDefault();

    const submissionCode = {
      userId: codeData.user,
      questionId: codeData.questionId,
      code: codeData.code,
      languageId: codeData.language,
      score: testResult,
      submissionId: submissionId,
      status: 'solved'
    };

    console.log(submissionCode);

    // Get the submission count
    await axios.get(`http://localhost:8080/api/submissions/${submissionCode.userId}/${submissionCode.questionId}`)
      .then(async (res) => {
        const submissionCount = res.data.count;

        // Check if submission count is more than 3
        if (submissionCount > 3) {
          // return setError("You have reached the maximum limit of submissions for this question");
        } else {
          // Submit the code
          await axios.post(`http://localhost:8080/api/submissions/save/${submissionCode.questionId}`, submissionCode)
            .then(async (res) => {
              if (res.data) {
                console.log(res.data);
                if (res.data.message) {
                  setError(res.data.message)
                }
                return res;
              }
            })
            .catch((error) => {
              if (error.response) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
              }
            });
        }
      })
      .catch((error) => {
        // Handle error while retrieving the submission count
        console.error(error);
      });

    console.log(submissionCode.userId);
    navigate(`/dashboard/user/${submissionCode.userId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div style={{ marginTop: '-24px' }}>
        <div className='row'>
          <div className='col-6 col-md-4'>
            <div className='container'>
              <div className='row'>
                <h6>Quiz category: {categoryName}</h6>
                <h6>Question: {questionTitle}</h6>
                <p>{questionDescription}</p>
                <p>Note that you can made <span style={{ color: "#f00" }}>only 3 submissions</span> </p>
              </div>
              <div className='row'>
                <button type='button' className='btn btn-outline-primary' onClick={handleGoBack} style={{ width: '100px' }}>
                  Go back
                </button>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-8'>
            <form>
              <div className='row'>
                <div className='.col-12 .col-md-4'>
                  <label style={{ color: '#f2f2f2' }}>Select language:</label>
                  <span style={{ marginLeft: 5 }}>
                    <select className='form-select-sm mb-3 bg-dark text-white' name='language' value={codeData.language} onChange={handleChange}>
                      <option value='62'>Java</option>
                      <option value='53'>C++</option>
                    </select>
                  </span>
                </div>
                <div className='.col-12 .col-md-8'>
                  <div className='row'>
                    <div className='.col-12 .col-md-8'>
                      <AceEditor
                        mode='java'
                        theme='twilight'
                        name='code'
                        fontSize={14}
                        value={codeData.code}
                        editorProps={{ $blockScrolling: Infinity }}
                        setOptions={{
                          showLineNumbers: true,
                          tabSize: 2,
                        }}
                        height='400px'
                        width='90%'
                        onChange={(value) => setCodeData({ ...codeData, code: value })}
                      />
                    </div>
                  </div>
                  <div className='row' style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <button className='run-btn' type='submit' onClick={handleRun}>Execute</button>
                        {loading ? <ClipLoader color="#36d7b7" /> : ' '}
                        {error ? <p style={{ color: "#f00", fontSize: ".9em", marginTop: '0.5em' }}>{error}</p> : " "}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className='row' style={{ marginTop: '10px' }}>
              <div className='col-12 col-md-3'>
                <div style={{ maxWidth: '10rem', maxHeight: '5rem' }}>
                  {codeData.testCases.map((tc, index) => (
                    <button
                      key={index}
                      className='testcase'
                      style={{
                        fontSize: '14px',
                        background: testResult === 'Fail' ? 'red' : 'green'
                      }}
                    >
                      <LockIcon /> Test case: {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              {testResult && !executing && (
                <div>
                  {testResult === 'Pass' ? (
                    <div>
                      <p style={{ display: 'inline-block', marginTop: '1.2em', color: '#0f0' }}>
                        Test cases are passed. You can submit your code.
                        <button style={{ marginLeft: '.2em' }} className='btn btn-success' onClick={handleSubmission}>
                          Submit
                        </button>
                      </p>
                    </div>
                  ) : (
                    <p style={{ display: 'inline-block', marginTop: '1.2em', color: '#f00' }}>Test cases are failed. Retry </p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeSpace;
