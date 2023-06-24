import { useEffect, useState } from 'react'
import { Button, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

const Question = () => {
  const [questionData, setQuestionData] = useState({
    category: '',
    questions: []
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);

  const fetchQuestions = () => {
    axios.get('http://localhost:8080/api/questions')
      .then(res => {
        console.log(res.data);
        setQuestionData(res.data.questions)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchQuestions()
  }

  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`http://localhost:8080/api/questions/${id}`)
      .then(() => {
        toast.success("Question deleted successfully")
        fetchQuestions()
      }).catch((error) => {
        console.log(error);
      })
  }

  const handleCreate = () => {
    navigate('/admindashboard/question/create')
  }
  
  const handleBack = () =>{
    navigate(-1)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  const isAdmin = localStorage.getItem('role') === 'admin'
  const isEditor = localStorage.getItem('role') === 'editor'

  // Get current questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questionData.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container'>
      <Typography sx={styles.pageTitle} variant='h5'>Manage Questions</Typography>
      {isEditor &&(
        <Button variant='contained' color='success' onClick={handleCreate} sx={{ marginBottom: 4 }}>Create</Button>
      )}
      <Button variant='outline' onClick={handleRefresh} sx={{ marginBottom: 4 }}><RefreshIcon /></Button>
      <Button variant='outline' onClick={handleBack} sx={{ marginBottom: 4, marginLeft:4 }}>Back</Button>
      <table className='table' style={{ width: '70%', alignContent: 'center' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Category</th>
            <th>Proficiency</th>
            <th>Difficulty</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((ques, index) => (
            <tr key={ques._id}>
              <td>{index + 1}</td>
              <td>{ques.title}</td>
              <td>{ques.categoryData[0].name}</td>
              <td>{ques.categoryData[0].type}</td>
              <td>{ques.categoryData[0].difficulty}</td>
              <td>
                {isAdmin ? (
                  <>
                    <Link style={{ color: '#222' }} to={`/admindashboard/question/update/${ques._id}`}>
                      <IconButton><VisibilityIcon /></IconButton>
                    </Link>
                  </>) : (
                  <>
                    {isEditor && (
                      <>
                        <Link style={{ color: '#222' }} to={`/admindashboard/question/update/${ques._id}`}>
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton onClick={() => handleDelete(ques._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Pagination */}
      <nav>
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(questionData.length / questionsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className='page-link' onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Question

const styles = {
  pageTitle: {
    mb: 2
  },
  buttons: {
    color: 'grey'
  }
}
