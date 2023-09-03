import { useEffect, useState } from 'react'
import { Button, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { toast } from 'react-toastify';
const QuizCat = () => {

  const [quizData, setQuizData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();


  const fetchQuizCategories = () => {
    axios.get("http://localhost:8080/api/quizcat")
      .then(res => {
        console.log(res.data);
        setQuizData(res.data.quizCat)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchQuizCategories()
  }, [])

  const handleRefresh = () => {
    setLoading(true);
    fetchQuizCategories()
  }

  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`http://localhost:8080/api/quizcat/${id}`)
      .then(() => {
        toast.success("Quiz category deleted successfully")
        fetchQuizCategories()
      })
      .catch((error) => {
        console.log(error);
      })
  }
  const handleCreate = () => {
    navigate('/admindashboard/quizcat/create')
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const isAdmin = localStorage.getItem('role') === 'admin'
  const isEditor = localStorage.getItem('role') === 'editor'
  
  const handleBack = () =>{
    navigate(-1)
  }
  return (
    <div className='container'>
      <Typography sx={styles.pageTitle} variant='h5'>Manage Quiz Categories</Typography>
      {isEditor && (
        <Button variant='contained' color='success' onClick={handleCreate} sx={{ marginBottom: 4 }}>Create</Button>

      )}
      <Button variant='outline' onClick={handleRefresh} sx={{ marginBottom: 4 }}><RefreshIcon /></Button>
      <Button variant='outline' onClick={handleBack} sx={{ marginBottom: 4 }}>Back</Button>

      <table className='table' style={{ width: '70%', alignContent: 'center' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Proficiency</th>
            <th>Proficiency Level</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            quizData.map((quiz, index) =>
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.name}</td>
                <td>{quiz.type}</td>
                <td>{quiz.difficulty}</td>
                <td>
                {isAdmin ? (
                  <Link style={{ color: '#222' }} to={`/admindashboard/quizcat/update/${quiz._id}`}>
                    <IconButton><VisibilityIcon /></IconButton>
                  </Link>
                ) : (
                  <>
                    {isEditor && (
                      <>
                        <Link style={{ color: '#222' }} to={`/admindashboard/quizcat/update/${quiz._id}`}>
                          <IconButton><EditIcon /></IconButton>
                        </Link>
                        <IconButton onClick={() => handleDelete(quiz._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </>
                )}
                </td>
              </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}

export default QuizCat



const styles = {
  pageTitle: {
    mb: 2
  },
  buttons: {
    color: 'grey'
  }
}