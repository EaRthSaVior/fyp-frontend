import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import NavbarLink from './components/Navbar';
import Create from './components/Create';
import Home from './pages/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Search from './components/Search';
import Question from './components/Question';
import ShareList from './components/ShareList';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';

import ChangeEmail from './components/ChangeEmail';
import MyLibrary from './components/MyLibrary';
import MCQ from './components/MCQ';
import TrueFalse from './components/TrueFalse';
import Edit from './components/Edit';
import { useWindowScroll } from "react-use";
import Loading from './components/Loading';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp } from "@fortawesome/free-solid-svg-icons";

import { useLocation } from 'react-router-dom';
import SpinnerComponent from './components/SpinnerComponent';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { y: scrollY } = useWindowScroll();
  const [showScrollButton, setShowScrollButton] = useState(false);
   // Reset scroll position to top when the location changes
   useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    // Show the scroll button if the user has scrolled down
    setShowScrollButton(scrollY > 0);
  }, [scrollY]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/');
  };
  const fetchCurrentUser = async (jwtToken) => {
    if (jwtToken) {
      try {
        const response = await fetch('http://localhost:5000/users/current', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
  
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username);
          setEmail(userData.email);
          console.log(111111111)
          setIsLoggedIn(() => true); // Use state updater function
        } else {
          // JWT is invalid or expired
          setIsLoggedIn(() => false); // Use state updater function
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    } else {
      // JWT not found, user is not logged in
      setIsLoggedIn(() => false); // Use state updater function
    }
  };
  
  
  useEffect(() => {
    const jwtToken = localStorage.getItem('accessToken');
    setAccessToken(jwtToken);
  }, []);

  useEffect(() => {
    
    fetchCurrentUser(accessToken);
  }, [accessToken]);

  return (
    <>
      <NavbarLink isLoggedIn={isLoggedIn} handleLogOut={handleLogOut} />
     
     
      <div className="min-vh-100">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
          <Route path="/create" element={<Create isLoggedIn={isLoggedIn}/>} />
          <Route path="/create/:id" element={<Create isLoggedIn={isLoggedIn}/>} />
          <Route path="/question/:id" element={<Question />} />
          <Route path="/search"  element={<Search />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} setAccessToken={setAccessToken}/>} />
          <Route path="/signup" element={<SignUp handleLogin={handleLogin} />} />
          <Route path="/share/:id" element={<ShareList />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/changeemail"element={<ChangeEmail />} />
          {/* <Route path="/test" element={<Test />} /> */}
          <Route path="/profile" element={<Profile username={username} email={email} setAccessToken={setAccessToken} fetchCurrentUser={fetchCurrentUser}/>} />
          <Route path="/mylibrary" element={<MyLibrary />} />
          <Route path="/mylibrary/mcq" element={<MCQ />} />
          <Route path="/mylibrary/truefalse" element={<TrueFalse />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </div>
                  {/* Scroll to top button */}
                  {showScrollButton && (
        <button className="scroll-button" onClick={handleScrollToTop}>
          <FontAwesomeIcon icon={faAnglesUp} />
        </button>
      )}
      <Footer />

    </>
  );
}

export default App;
