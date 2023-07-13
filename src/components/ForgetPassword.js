import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import logo from '../img/icon.png';
function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
    } else if (!regex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the input field
    validateEmail();

    if (emailError) {
      // There are validation errors, do not proceed with the submission
      return;
    }

    // Prepare the data to be sent in the request body
    const data = {
      email: email
    };

    // Send the POST request to the backend API for password reset
    fetch('http://localhost:5000/reset/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.status === 200) {
          setSuccessMessage('Password reset instructions sent to your email!');
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .catch(error => {
        console.error(error);
        setError('Please make sure your email is correct!');
      })
  };

  return (
    <div style={ {backgroundColor: "lightskyblue"}}>
      <Container className="d-flex align-items-center justify-content-center" style={{ minwidth: '200px', minHeight: '100vh' }}>
        <Card className="shadow p-3 mt-5 mb-5" style={{ width: '500px' }}>
          <Card.Body>
          <div className='not-card-body'>
            <Card.Title className='m-5 text-center'>
            <img className='image-style'src={logo}  />
            <h1>Forgot Password</h1></Card.Title>
            <Card.Text>
              {successMessage && <p className="text-success m-3">{successMessage}</p>}
              {error && <p className="text-danger m-3">{error}</p>}
              <Form.Floating className="m-3">
                <Form.Control
                  id="floatingInputCustom"
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleEmailChange}
                  value={email}
                  onBlur={validateEmail}
                  required
                  className={emailError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingInputCustom">Email address</label>
                {emailError && <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>}
              </Form.Floating>
              <div className="mx-3">
                <Button
                  className='w-100'
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Reset Password
                </Button>
              </div>
              <p className='m-3'>Remember your password? <Link to="/login">Log in</Link></p>
            </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ForgotPassword;
