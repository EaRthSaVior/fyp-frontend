import React from 'react';
import './Home.css'; // Create a CSS file to style the home page
import { useNavigate } from 'react-router-dom';

export default function Home({isLoggedIn}) {
  const navigate = useNavigate();

  const handleClick =()=>{
    if(isLoggedIn){
      navigate("/create");
    }else{
      navigate("/login");
    }
 
  }
  return (
    <div className="home">
      <div className='home-content'>
      <h1>Smart Quizzer</h1>
      <h4>Discover The Easiest Way to Create </h4>
      <h4>Interactive Quizzes with Our State-of-The-Art </h4>
      <h4>Quiz Generation Tools</h4>
      <button onClick={handleClick}>Start Now</button>
      </div>
    </div>
  );
}
