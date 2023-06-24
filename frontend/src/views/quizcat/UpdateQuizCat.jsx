/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom';

const UpdateQuizCat = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [questionData, setQuestionData] = useState({
    name: '',
    type: '',
    difficulty: ''
  })

  useEffect(() => {
    axios.get('http://localhost:8080/api/quizcat/' + id)
      .then((res) => {
        console.log(res.data.quizCat);
        setQuestionData({
          name: res.data.quizCat.name,
          type: res.data.quizCat.type,
          difficulty: res.data.quizCat.difficulty
        })
      })
  }, [id])

  const isEditor = localStorage.getItem('role') === 'editor';


  const handleChange = (e) => {
    if (isEditor) {
      setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    }
  }

  const [selectedType, setSelectedType] = useState('')
  const [selectedDiff, setSelectedDiff] = useState('')

  const diffOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ]

  const typeOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Expert', label: 'Expert' },
  ]

  const handleTypeSelectChange = (selectedType) => {
    if (isEditor) {
      setQuestionData((prevData) => ({
        ...prevData,
        type: selectedType ? selectedType.value : ''
      }))
      setSelectedType(selectedType);
    }
  }

  const handleDiffSelectChange = (selectedDiff) => {
    if (isEditor) {
      setQuestionData((prevData) => ({
        ...prevData,
        difficulty: selectedDiff ? selectedDiff.value : ''
      }))
      setSelectedDiff(selectedDiff);
    }
  }

  const handleQuizCatUpdate = (e) => {
    e.preventDefault()
    if (questionData.name === '' || !questionData.type || !questionData.difficulty) {
      toast.error('Please fill all fields')
    } else {
      axios.put(`http://localhost:8080/api/quizcat/${id}`, questionData)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.res.data.message;
            console.log(errorMessage);
          }
        })
    }

  }

  const handleCancel = () => {
    navigate('/admindashboard/quizcat')
  }

  return (
    <Box>
      <form onSubmit={handleQuizCatUpdate}>
        <h3>Update Quiz Category</h3>
        <div className='mb-3 row'>
          <label className='col-sm-5 col-form-label'>Quiz Category Name</label>
          <input
            type='text'
            className='form-control'
            name='name'
            placeholder='Enter Quiz Category'
            value={questionData.name}
            onChange={handleChange}
            readOnly={!isEditor} // Set input field as read-only if user is not an admin
          />
        </div>
        <div className='mb-3 row'>
          <label className='col-sm-2 col-form-label'>Proficiency</label>
          <Select
            name='type'
            options={typeOptions}
            value={typeOptions.find((typeOptions) => typeOptions.value === questionData.type)}
            onChange={handleTypeSelectChange}
            isClearable={true}
            isDisabled={!isEditor} // Disable select field if user is not an admin
          />
        </div>
        <div className='mb-3 row'>
          <label className='col-sm-2 col-form-label'>Difficulty</label>
          <Select
            name='difficulty'
            options={diffOptions}
            value={diffOptions.find((diffOptions) => diffOptions.value === questionData.difficulty)}
            onChange={handleDiffSelectChange}
            isClearable={true}
            isDisabled={!isEditor} // Disable select field if user is not an editor
          />
        </div>
        <div className='form-group'>
          <button
            type='submit'
            className='btn btn-primary'
            style={{ marginRight: 10 }}
            disabled={!isEditor} // Disable update button if user is not an editor
          >
            Update
          </button>
          <button
            type="submit"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </Box>
  )
}

export default UpdateQuizCat;
