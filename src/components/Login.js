import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Container, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/icon.png';
function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError('Email is required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError('');
    }

  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError('Password is required.');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }

  };

  const handleClick = () => {
    setLoading(true);
    setError('');
    if (emailError) {
      document.getElementById('floatingInputCustom').focus();
      setLoading(false);
      return;
    } else if (passwordError) {
      document.getElementById('floatingPasswordCustom').focus();
      setLoading(false);
      return;
    }
    if (!email) {
      setEmailError('Email is required.');
      setLoading(false);
      document.getElementById('floatingInputCustom').focus();
      return;
    } else {
      setEmailError('');
    }
  
    if (!password) {
      setPasswordError('Password is required.');
      setLoading(false);
      document.getElementById('floatingPasswordCustom').focus();
      return;
    } else {
      setPasswordError('');
    }

    // Prepare the data to be sent in the request body
    const userData = {
      email: email,
      password: password
    };

    // Send the POST request to the backend API
    fetch('http://localhost:5000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {
        const accessToken = data.accessToken;
        props.setAccessToken(accessToken)
        localStorage.setItem('accessToken', accessToken);
        props.handleLogin();
      })
      .catch(error => {
        console.error(error);
        setError('Invalid email or password.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={ {backgroundColor: "lightskyblue"}}>
    <Container className="d-flex align-items-center justify-content-center" style={{ minwidth: '200px', minHeight: '100vh' }}>
      <Card className="shadow p-3 mt-5 mb-5" style={{ width: '500px'}}>
        <Card.Body>
        <div className='not-card-body'>
          <Card.Title className="m-5 text-center">
          <img className='image-style'src={logo}  />
              
            <h1>Login</h1>
          </Card.Title>
          <Form.Floating className="m-3">
            <Form.Control
              id="floatingInputCustom"
              type="email"
              placeholder="Email Address"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              value={email}
              className={emailError ? 'is-invalid' : ''}
            />
            <label htmlFor="floatingInputCustom">Email Address</label>
            {emailError && <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>}
          </Form.Floating>
          
          <Form.Floating className="m-3">
      <Form.Control
        id="floatingPasswordCustom"
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handlePasswordBlur}
        className={passwordError ? 'is-invalid' : ''}
      />
            <div className="password-toggle" onClick={togglePasswordVisibility}>
        <FontAwesomeIcon icon={showPassword ?   faEye:faEyeSlash} />
      </div>
      <label htmlFor="floatingPasswordCustom">Password</label>
      {passwordError && <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>}

    </Form.Floating>

          <div className="m-3">
            <p>Don't remember your password? <Link to="/forgetpassword">Forget Password</Link></p>
          </div>
          {error && <p className="text-danger m-3">{error}</p>}
          <div className="mx-3">
            <Button
              className="w-100"
              variant="primary"
              disabled={isLoading}
              onClick={handleClick}
            >
              {isLoading ? 'Loading…' : 'Log In'}
            </Button>
          </div>
          <div className="m-3">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
  
  
}

export default Login;
