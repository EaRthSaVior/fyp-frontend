import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import logo from '../img/icon.png';
function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cpasswordError, setCPasswordError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      // Handle the case where the token is not present in the URL
      setError('Invalid reset password link');
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCPasswordChange = (e) => {
    setCPassword(e.target.value);
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

  const handleSubmit = (e) => {
    e.preventDefault();
 
      if (!password) {
        setPasswordError('Password is required');
        return;
      } else if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      } else {
        setPasswordError('');
        if (!cpassword) {
          setCPasswordError('Confirm Password is required');
          return;
        } else if (cpassword !== password) {
          setCPasswordError('Passwords do not match');
          return;
        } else {
          setCPasswordError('');
          const data = {
            token: token,
            password: password,
            confirmPassword: cpassword
          };
      
          // Send the POST request to the backend API for password reset
          fetch('http://localhost:5000/reset/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => {
              if (response.status === 200) {
                setSuccessMessage('Password reset successfully!');
      
              } else {
                throw new Error('Request failed with status ' + response.status);
              }
            })
            .catch(error => {
              console.error(error);
              setError('Failed to reset password');
            })
        }
      }
 
  };

  return (
    <div style={ {backgroundColor: "lightskyblue"}}>
      <Container className="d-flex align-items-center justify-content-center" style={{ minwidth: '200px', minHeight: '100vh' }}>
        <Card className="shadow p-3 mt-5 mb-5" style={{ width: '500px' }}>
          <Card.Body className='not-card-body'>
            <Card.Title className='m-5 text-center'>
            <img className='image-style'src={logo}  />
              <h1>Reset Password</h1></Card.Title>
            <Card.Text>
        <Form.Floating className='m-3'>
                <Form.Control
                  id="floatingPasswordCustom"
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePassword}
                  required
                  className={passwordError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingPasswordCustom">New Password</label>
                {passwordError && <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>}
              </Form.Floating>
              <Form.Floating className='m-3 mb-4'>
                <Form.Control
                  id="floatingCPasswordCustom"
                  type="password"
                  placeholder="Confirm New Password"
                  value={cpassword}
                  onChange={handleCPasswordChange}
                  onBlur={validateCPassword}
                  required
                  className={cpasswordError ? 'is-invalid' : ''}
                />
                <label htmlFor="floatingCPasswordCustom">Confirm New Password</label>
                {cpasswordError && <Form.Control.Feedback type="invalid">{cpasswordError}</Form.Control.Feedback>}
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
              {successMessage && <p className="text-success m-3">{successMessage}</p>}
              {error && <p className="text-danger m-3">{error}</p>}
              
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ResetPassword;
