/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { BsFileEarmarkCodeFill, BsFillBarChartFill } from 'react-icons/bs'

const StudentDashboard = () => {
  const [username, setUserName] = useState('')

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserName(storedUsername)
    }
  }, [])
  const userId = localStorage.getItem("userId")
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
        <h4>Hello...! {username}  👏</h4>
          <div className="bg-c-dark-blue" style={{ width: '100%' }}>
            <div className="card-body">

              <h5>Your Preparation</h5>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>

        <div className='col-md-4 col-xl-3'>
          <div className='card order-card bg-dark text-white' style={{ height: "10em" }}>
            <div className='card-block'>
              <div className='card-body'>
                <h6 className='m-b-20'>Your Practices</h6>
                <h2 className="text-right"><BsFileEarmarkCodeFill /></h2>
                <Link className="text-right" to={'/dashboard/questions'} style={{ color: "#f2f2f2" }}>Click to Continue...</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4 col-xl-3'>
          <div className='card order-card bg-dark text-white' style={{ height: "10em" }}>
            <div className='card-block'>
              <div className='card-body'>
                <h6 className='m-b-20'>View Results</h6>
                <h2 className="text-right"><BsFillBarChartFill /></h2>
                <Link className="f-right" to={`/dashboard/user/${userId}`} style={{ color: "#f2f2f2" }}>More Details</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard

