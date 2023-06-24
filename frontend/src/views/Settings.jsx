import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import {useNavigate} from "react-router-dom"
const Settings = () => {
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [userId, setUserId] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token")
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                };
                const response = await axios.get(`http://localhost:8080/api/users/me`, config);
                const user = response.data;
                setUserId(user.id);
                setEmail(user.email)
            } catch (error) {
                if (error.response) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                }
            }
        }
        fetchCurrentUser()
    }, [])
    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
        try {
            const requestBody = {
                password: newPassword,
                email: email,
            };
            const response = await axios.put(`http://localhost:8080/api/users/${userId}`,
                requestBody,
                config);
            const { updateUser } = response.data
            console.log(updateUser);

            setPassword("");
            setNewPassword("");
            setEmail("");
            setError("");
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
            }
        }
    }
    const handleCancel = () =>{
        navigate(-1)
    }
    return (
        <div className="container" style={{width:'80%', float:"left"}}>
        <h4>Update your accout</h4>
        {error && <p>{error}</p>}
        <form onSubmit={handleUpdate}>
        <div className="form-group row" style={{marginBottom:'10px', marginTop:'20px'}}>
          <label className="col-sm-2 col-form-label">Email:</label>
          <div className="col-sm-3">
            <input type="email" value={email} className="form-control" onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="form-group row" style={{marginBottom:'10px'}}>
          <label className="col-sm-2 col-form-label">Current Password:</label>
          <div className="col-sm-3">
            <input type="password" value={password} className="form-control" onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="form-group row" style={{marginBottom:'10px'}}>
          <label className="col-sm-2 col-form-label">New Password:</label>
          <div className="col-sm-3">
            <input type="password" value={newPassword} className="form-control" onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{marginRight:'.5em'}}>Update</button>
        <button type="submit" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
      </form>
        </div>
    )
}

export default Settings