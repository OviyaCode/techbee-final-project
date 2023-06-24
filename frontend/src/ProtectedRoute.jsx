import { Navigate } from "react-router-dom"


// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
    const isSignedIn = !!localStorage.getItem('token');

    if(!isSignedIn){
        return <Navigate to="/" replace/>
    }

    return children
}

export default ProtectedRoute