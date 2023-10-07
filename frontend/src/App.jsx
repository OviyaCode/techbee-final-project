import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminBaseLayout from './layouts/AdminBaseLayout';
import Admin from './views/admin/Admin';
import CreateUser from './views/admin/CreateUser';
import UpdateUser from './views/admin/UpdateUser';
import Question from './views/question/Question';
import CreateQuestion from './views/question/CreateQuestion';
import UpdateQuestion from './views/question/UpdateQuestion';
import QuizCat from './views/quizcat/QuizCat';
import CreateQuizCat from './views/quizcat/CreateQuizCat';
import UpdateQuizCat from './views/quizcat/UpdateQuizCat';
import Results from './views/result/Results';


import Settings from './views/Settings';

import StudentBaseLayout from './layouts/StudentBaseLayout'
import StudentDashboard from './views/student/StudentDashboard';
import CodeSpace from './views/student/CodeSpace';
import QuestionList from './views/student/QuestionList';
import QuestionsPanel from './views/student/QuestionsPanel';
import ResultPanel from './views/student/ResultPanel';

import PageNotFound from './layouts/PageNotFound';
import PageNotFound2 from './layouts/PageNotFound2';
import StudSettings from './views/StudSettings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SingleResult from './views/result/SingleResult';
import UserResult from './views/student/UserResult';
import AdminDashboard from './views/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import LeaderBoard from './views/student/LeaderBoard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/admindashboard" element={<ProtectedRoute><AdminBaseLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route exact path="admin" element={<Admin />} />
            <Route exact path="admin/create" element={<CreateUser />} />
            <Route exact path="admin/update/:id" element={<UpdateUser />} />
            <Route exact path="question" element={<Question />} />
            <Route exact path="question/create" element={<CreateQuestion />} />
            <Route exact path="question/update/:id" element={<UpdateQuestion />} />
            <Route exact path="quizcat" element={<QuizCat />} />
            <Route exact path="quizcat/create" element={<CreateQuizCat />} />
            <Route exact path="quizcat/update/:id" element={<UpdateQuizCat />} />
            <Route exact path="results" element={<Results />} />
            <Route exact path='results/view/:id' element={<SingleResult />} />
            <Route exact path="settings" element={<Settings />} />
          </Route>
          <Route exact path="/dashboard" element={<ProtectedRoute><StudentBaseLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route exact path='code' element={<CodeSpace />} />
            <Route exact path='questions' element={<QuestionsPanel />} />
            <Route exact path='quizzes/:id' element={<QuestionList />} />
            <Route exact path='quizzes' element={<QuestionList />} />
            <Route exact path='results/:userId' element={<ResultPanel />} />
            <Route exact path='user/:id' element={<UserResult />} />
            <Route exact path='settings' element={<StudSettings />} />
            <Route exact path='ranking' element={< LeaderBoard/>} />
          </Route>
          <Route path='/dashboard/*' element={<PageNotFound2 />} />
          <Route path='/admindashboard/*' element={<PageNotFound2 />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
