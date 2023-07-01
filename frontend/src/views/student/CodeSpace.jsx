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
  const token = localStorage.getItem('token');
  const decodedToken = jwt.decode(token);
  const userId = decodedToken ? decodedToken.id : '';
  // console.log(userId);
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
  };

  const handleRun = async (e) => {
    e.preventDefault();
    console.log(codeData)
    try {
      const { questionId, testCases, code, language, userId } = codeData;
      setLoading(true)
      setExecuting(true)
      const formattedTestCases = testCases.map((testCase) => ({
        input: JSON.parse(testCase.input),
        output: testCase.output,
      }));

      const requestData = {
        userId: userId,
        questionId: questionId,
        code: code,
        languageId: language,
        testCases: formattedTestCases,
      };

      await axios.post(`http://localhost:8080/api/submissions/${questionId}`, requestData).then((res) => {
        console.log(res.data.testResult);
        // setTestResult(res.data.testResult.result);
        const { submissionId, testResult } = res.data;

        setTestResult(testResult.result)
        console.log("testResult", testResult.result);
        setSubmissionId(submissionId)
        console.log("resSubmissionId", submissionId);

      });
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      }
    } finally {
      setLoading(false)
      setExecuting(false)
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    const submissionCode = {
      userId: codeData.user,
      questionId: codeData.questionId,
      code: codeData.code,
      languageId: codeData.language,
      score: testResult,
      submissionId: submissionId
    };

    await axios.post(`http://localhost:8080/api/submissions/save/${questionId}`, submissionCode)
      .then(async (res) => {
        console.log(res.data);
      })
    console.log(userId)
    navigate(`/dashboard/user/${userId}`)
      .catch((error) => {
        console.error(error);
      });
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
                      <option value='71'>C++</option>
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
