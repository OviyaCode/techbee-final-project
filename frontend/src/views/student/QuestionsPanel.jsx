import{ useEffect, useState } from 'react';
import axios from 'axios';
import { Link, } from 'react-router-dom';

const QuestionsPanel = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/quizcat');
      console.log(response.data);
      setCategories(response.data.quizCat);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="container">
      <div className="row">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {categories.map((quiz) => (
            <div className="col" key={quiz._id}>
              <div className="card h-100 border-primary">
                <div className="card-body">
                  <h5 className="card-title">{quiz.name}</h5>
                  <p className="card-text">For {quiz.type} | Difficulty: {quiz.difficulty}</p>
                  <Link className='btn btn-primary' to={`/dashboard/quizzes/${quiz._id}`}>Attempt the quizzes</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPanel;

