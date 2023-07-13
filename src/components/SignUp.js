import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import logo from '../img/icon.png';
function SignUp(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cpasswordError, setCPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCPasswordChange = (e) => {
    setCPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@\S+[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
    } else if (!regex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  const validateCPassword = () => {
    if (!cpassword) {
      setCPasswordError('Confirm Password is required');
    } else if (cpassword !== password) {
      setCPasswordError('Passwords do not match');
    } else {
      setCPasswordError('');
    }
  };

  const validateUsername = () => {
    if (!username) {
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the input fields
    validateEmail();
    validatePassword();
    validateCPassword();
    validateUsername();

    if (emailError || passwordError || cpasswordError || usernameError) {
      // There are validation errors, do not proceed with the submission
      return;
    }

    // Prepare the data to be sent in the request body
    const userData = {
      email: email,
      password: password,
      username: username
    };

    // Send the POST request to the backend API
    fetch('http://localhost:5000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {
        console.log(data.accessToken);
        const accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        props.handleLogin();
      })
      .catch(error => {
        console.error(error);
        setError('Fail to register, please try again later!');
      })
  };

  return (
    <div style={ {backgroundColor: "lightskyblue"}}>
      <Container className="d-flex align-items-center justify-content-center" style={{ minwidth: '200px', minHeight: '100vh'}}>
        <Card className="shadow p-3 mt-5 mb-5" style={{ width: '500px' }}>
          <Card.Body >
            <div className='not-card-body'>
            <Card.Title className='m-5 text-center'>  
              <img className='image-style'src={logo}  />
              <h1>Sign Up</h1></Card.Title>
            <Card.Text>
              <Form.Floating className="m-3">
                <Form.Control
                  id="floatingInputCustom"
                  type="username"
                  placeholder="Username"
                  onChange={handleUsernameChange}
                  value={username}
                  onBlur={validateUsername}
                  required
                  className={usernameError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingInputCustom">Username</label>
                {usernameError && <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>}
              </Form.Floating>
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
              <Form.Floating className='m-3'>
                <Form.Control
                  id="floatingPasswordCustom"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePassword}
                  required
                  className={passwordError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingPasswordCustom">Password</label>
                {passwordError && <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>}
              </Form.Floating>
              <Form.Floating className='m-3 mb-4'>
                <Form.Control
                  id="floatingCPasswordCustom"
                  type="password"
                  placeholder="Confirm Password"
                  value={cpassword}
                  onChange={handleCPasswordChange}
                  onBlur={validateCPassword}
                  required
                  className={cpasswordError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingCPasswordCustom">Confirm Password</label>
                {cpasswordError &&<Form.Control.Feedback type="invalid">{cpasswordError}</Form.Control.Feedback>}
              </Form.Floating>
              {error && <p className="text-danger m-3">{error}</p>}
              <div className="mx-3">
                <Button
                  className='w-100'
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
              </div>
              <p className='m-3'>Already have an account? <Link to="/login">Log in</Link></p>
            </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SignUp;
