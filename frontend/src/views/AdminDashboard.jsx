import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { BsFillPatchQuestionFill, BsFillBarChartFill } from 'react-icons/bs';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [quizCategoryCount, setQuizCategoryCount] = useState(0);
    const [resultCount, setResultCount] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userResponse = await axios.get('http://localhost:8080/api/users');
            const userCount = userResponse.data.users.length || 0;
            setUserCount(userCount);

            const quizResponse = await axios.get('http://localhost:8080/api/quizcat');
            const quizCategoryCount = quizResponse.data.quizCat.length || 0;
            setQuizCategoryCount(quizCategoryCount);

            const questionResponse = await axios.get('http://localhost:8080/api/questions')
            const questionsCount = questionResponse.data.questions.length || 9;
            setQuestionCount(questionsCount)

            const resultResponse = await axios.get('http://localhost:8080/api/submissions');
            const resultCount = resultResponse.data.submissions.length || 0;
            setResultCount(resultCount);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-6'>
                    <div>
                        <div>
                            <h3>Welcome to TechBee</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4 col-xl-3'>
                    <div className='card bg-c-blue order-card'>
                        <div className='card-block'>
                            <div className='card-body'>
                                <h6 className='m-b-20'>Total Users</h6>
                                <h2 className='text-right'><FaUsers /></h2>
                                <p className="m-b-0">Registered<span className="f-right"><CountUp end={userCount} duration={1.5} prefix='0'
                                    /></span></p>
                                <Link to={'/admindashboard/admin'} style={{ color: "#f2f2f2" }}>More Details</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-xl-3'>
                    <div className='card bg-c-green order-card'>
                        <div className='card-block'>
                            <div className='card-body'>
                                <h6 className='m-b-20'>Total Quiz Categories</h6>
                                <h2 className='text-right'> <MdCategory /></h2>
                                <p className="m-b-0">Created<span className="f-right"><CountUp end={quizCategoryCount} duration={1.5} prefix='0'
                                    /></span></p>
                                <Link to={'/admindashboard/quizcat'} style={{ color: "#f2f2f2" }}>More Details</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-xl-3'>
                    <div className='card bg-c-yellow order-card'>
                        <div className='card-block'>
                            <div className='card-body'>
                                <h6 className='m-b-20'>Total Questions</h6>
                                <h2 className='text-right'><BsFillPatchQuestionFill /></h2>
                                <p className="m-b-0">Created<span className="f-right"><CountUp end={questionCount} duration={1.5} prefix='0'
                                    /></span></p>
                                <Link to={'/admindashboard/question'} style={{ color: "#f2f2f2" }}>More Details</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-xl-3'>
                    <div className='card bg-c-pink order-card'>
                        <div className='card-block'>
                            <div className='card-body'>
                                <h6 className='m-b-20'>Total Results</h6>
                                <h2 className='text-right'><BsFillBarChartFill /></h2>
                                <p className="m-b-0">Results recorded<span className="f-right"><CountUp end={resultCount} duration={1.5} prefix='0'
                                    /></span></p>
                                <Link to={'/admindashboard/results'} style={{ color: "#f2f2f2" }}>More Details</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-8">
                    <section className="card" style={{ height: "300px" }}>
                        <div className="card-body text-secondary">
                            <p>Recently Accessed</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, hic.</p>

                        </div>
                    </section>
                </div>
                <div className="col-sm-4">
                    <section className="card" style={{ height: "300px" }}>
                        <div className="card-body text-secondary">
                            <p>Notification</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, hic.</p>

                        </div>
                    </section>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
