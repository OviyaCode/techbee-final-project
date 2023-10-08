import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/users/forgot-password', { email })
            .then((response) => {
                console.log(response.data);
               toast.success('Check your mail please...')
                navigate('/')
                
            })
    }
    return (
        <div className='Login-form-container'>
            <form className='Login-form' onSubmit={handleSubmit}>
                <div className='Login-form-content'>
                    <h3 className='Login-form-title'>Reset Password</h3>
                    <div className='form-group mt-3'>

                    </div>
                    <div className='form-group mt-3'>
                        <label>Email</label>
                        <input
                            type='email'
                            className='form-control mt-1'
                            name='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='d-flex justify-content-center mt-3'>
                        <button type='submit' className='btn btn-primary btn-rounded w-50'>
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword