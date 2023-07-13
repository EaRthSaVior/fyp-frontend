import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import logo from '../img/icon.png';
function ChangeEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    if (!token) {
      // Handle the case where the token is not present in the URL
      setError('Invalid reset password link');
    }
  }, [token]);
  const handleNewEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@\S+[^\s@]+\.[^\s@]+$/;
    if (!newEmail) {
      setEmailError('Email is required');
    } else if (!regex.test(newEmail)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (  ) => {
   
  
      const regex = /^[^\s@]+@\S+[^\s@]+\.[^\s@]+$/;
      if (!newEmail) {
        setEmailError('Email is required');
        return;
      } else if (!regex.test(newEmail)) {
        setEmailError('Invalid email format');
        return;
      } else {
        setEmailError('');
        const data = {
          token: token,
          newEmail: newEmail
        };
    
        // Send the POST request to the backend API for email change
        fetch('http://localhost:5000/reset/changenewemail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (response.status === 200) {
              setError("")
              setSuccessMessage('Email changed successfully!');
            //   navigate('/profile'); // Redirect to the profile page or any desired destination
            } else {
              throw new Error('Request failed with status ' + response.status);
            }
          })
          .catch(error => {
            console.error(error);
            setError('Failed to change email');
          });
      }}



  return (
    <div style={ {backgroundColor: "lightskyblue"}}>
      
      <Container className="d-flex align-items-center justify-content-center" style={{ width: '500px', minHeight: '100vh' }}>
        <Card className="shadow p-3 mt-5 mb-5" style={{ width: '500px' }}>
          <Card.Body>
          <div className='not-card-body mb-3'>
            <Card.Title className="m-5 text-center">
            <img className='image-style'src={logo}  />
              <h1>Change Email</h1>
            </Card.Title>
            <Card.Text>
         <Form.Floating className="m-3">
                <Form.Control
                  id="floatingEmailCustom"
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={handleNewEmailChange}
                  onBlur={validateEmail}
                  required
                  className={emailError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingEmailCustom">New Email</label>
                {emailError && <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>}
              </Form.Floating>
              <div className="mx-3">
              <Button
                className="w-100 "
                variant="primary"
                onClick={handleSubmit}
              >
                Change Email
              </Button>
              </div>
              {successMessage && <p className="text-success m-3">{successMessage}</p>}
              {error && <p className="text-danger m-3">{error}</p>}
             
            </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ChangeEmail;
