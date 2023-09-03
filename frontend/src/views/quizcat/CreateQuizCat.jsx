/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import axios from 'axios';
import { useState } from 'react'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';

const CreateQuizCat = () => {
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState({
        name: '',
        type: '',
        difficulty: ''
    })

    const handleChange = (e) => {
        setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    }

    const [selectedType, setSelectedType] = useState('')
    const [selectedDiff, setSelectedDiff] = useState('')

    const diffOptions = [
        { value: 'Primary', label: 'Primary' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advance', label: 'Advance' },
    ]

    const typeOptions = [
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Expert', label: 'Expert' },
    ]

    const handleTypeSelectChange = (selectedType) => {
        setQuestionData((prevData) => ({
            ...prevData,
            type: selectedType ? selectedType.value : ''
        }))
    }

    const handleDiffSelectChange = (selectedDiff) => {
        setQuestionData((prevData) => ({
            ...prevData,
            difficulty: selectedDiff ? selectedDiff.value : ''
        }))
    }

    const handleQuizCatCreate = (e) => {
        e.preventDefault()
        if (questionData.name === '' || !questionData.type || !questionData.difficulty) {
            toast.error('Please fill all fields')
        }
        else {
            axios.post('http://localhost:8080/api/quizcat', questionData)
                .then((res) => {
                    console.log(res.data);
                    navigate('/admindashboard/quizcat')
                })
                .catch((error) => {
                    if (error.response) {
                        const errorMessage = error.res.data.message;
                        console.log(errorMessage);
                    }
                })
        }
    }
    const handleCancel = () =>{
        navigate('/admindashboard/question')
    }
    return (
        <Box>
            <form onSubmit={handleQuizCatCreate}>
                <h3>Create Quiz Category</h3>
                <div className='mb-3 row'>
                    <label className='col-sm-6 col-form-label'>Quiz Category Name</label>
                    <input type='text'
                        className='form-control' name='name' placeholder='Enter Quiz Category'
                        value={questionData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-3 row'>
                    <label className='col-sm-5 col-form-label'>Proficiency</label>
                    <Select name='type'
                        options={typeOptions}
                        value={typeOptions.find((typeOptions) => typeOptions.value === questionData.type)}
                        onChange={handleTypeSelectChange}
                        isClearable={true}
                        
                    />
                </div>
                <div className='mb-3 row'>
                    <label className='col-sm-6 col-form-label'>Proficiency Level</label>
                    <Select name='difficulty'
                        options={diffOptions}
                        value={diffOptions.find((diffOptions) => diffOptions.value === questionData.difficulty)}
                        onChange={handleDiffSelectChange}
                        isClearable={true}
                    />
                </div>
                <div className='form-group'>
                    <button type='submit' className='btn btn-success' style={{ marginRight: '.5em' }}>Create</button>
                    <button  className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </Box>
    )

}

export default CreateQuizCat