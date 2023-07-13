
import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Button, Spinner, FloatingLabel } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';


const Profile = ({ username, email, setAccessToken ,fetchCurrentUser}) => {
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailChangeSuccess, setEmailChangeSuccess] = useState('');

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      setSuccessMessage('')
    );
  
    return (
      <div style={{ margin: '5px',display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: '1' }}>{children}</div>
      <div className="edit-profile-button" onClick={decoratedOnClick}>
        <FontAwesomeIcon
          icon={faPenToSquare}
          style={{ fontSize: '1rem' }}
        />
      </div>
    </div>
    );
  }
  useEffect(() => {
    const jwtToken = localStorage.getItem('accessToken');
    setAccessToken(jwtToken);
    fetchCurrentUser(jwtToken)
  }, []);
  const updateUser = async (userData) => {
    try {
      const jwtToken = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem('accessToken',data.accessToken);
          // setAccessToken(data.accessToken);
          // console.log(data.accessToken)
          // fetchCurrentUser(data.accessToken)
        }
        console.log('User updated successfully');
        setSuccessMessage('Update successful');
      } else {
        console.error('Error updating user:', response.statusText);
        setPasswordError("Password Invalid")
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleSaveUsername = async () => {
    setUsernameError('');
    setSuccessMessage('');
    if (newUsername.trim() === '') {
      setUsernameError('Please enter a valid username');
      return;
    }

    if (newUsername.trim().length > 14) {
      setUsernameError('Username must be 14 characters or less');
      return;
    }

    const userData = {
      username: newUsername.trim(),
    };

    try {
      await updateUser(userData);
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error.message);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError('');
    setSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (currentPassword.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    const userData = {
      currentPassword,
      password: newPassword.trim(),
    };

    try {
      await updateUser(userData);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error.message);
    }
  };
  const handleForgotPassword = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/reset/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setSuccessMessage(data.message)
      } else {
        console.error('Error sending reset password email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending reset password email:', error.message);
    }
    setIsLoading(false);
  };
  const handleEmailChange = async () => {
    setIsLoading(true)
    setIsEmailButtonDisabled(true);
    try {
      const response = await fetch('http://localhost:5000/reset/validate-old-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmailChangeSuccess(data.message);
      } else {
        console.error('Error sending email change validation email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending email change validation email:', error.message);
    }
    setIsLoading(false)
  };

  return (
    <div style={{ backgroundColor: "lightskyblue" }}>
      <Container className="d-flex align-items-center justify-content-center" style={{ minwidth: '200px', minHeight: '100vh' }}>
        <Card className="shadow p-3 mt-5 mb-5" style={{ width: '500px' }}>
          <Card.Body >
            <div className='mb-3'>
           
              <Card.Title className='mt-2 mb-2 text-center'> <FontAwesomeIcon icon={faUser} style={{ fontSize: '8rem' }} /><h1>Profile</h1></Card.Title>
              <Accordion defaultActiveKey="0">
                <Card>
                <Card.Header>
                    <CustomToggle eventKey="1"> Username: {username}</CustomToggle>
                    </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body> <div>

                      <Form >
                        <Form.Group controlId="formNewUsername">
                          <FloatingLabel
                            controlId="floatingInput"
                            label="New username"
                            className="mb-3"
                            style={{ maxWidth: "460px" }}
                          >
                            <Form.Control
                              type="text"
                              placeholder="New username"
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}

                            />
                          </FloatingLabel>
                        </Form.Group>
                        <Button onClick={handleSaveUsername}>Save</Button>
                      </Form>
                      {isLoading && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>}
                      {successMessage && <p className="success-message" style={{ color: "green" }}>{successMessage}</p>}
                      {usernameError && <p className="error-message" style={{ color: "red" }}>{usernameError}</p>}

                    </div></Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <CustomToggle eventKey="2"> Email: {email}</CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body> <div>
                      <p>
                        Click{' '}
                        <button className='email-button' type="button" onClick={handleEmailChange} disabled={isEmailButtonDisabled}>
                          here
                        </button>{' '}
                        to get a link to change your email address.
                      </p>
                      {isLoading && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>}
                      {emailChangeSuccess && !isLoading && <p style={{ color: "green" }} className="success-message">{emailChangeSuccess}</p>}

                    </div></Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card>
                  <Card.Header>
                    <CustomToggle eventKey="3">Password: **********</CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="3">
                    <Card.Body>
                      <div>
                        <h2>Update Password</h2>
                        <Form>
                          <Form.Group controlId="currentPassword">
                            <FloatingLabel
                              controlId="floatingInput"
                              label="Current password"
                              className="mb-3"
                            >
                              <Form.Control
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                              />
                            </FloatingLabel>
                          </Form.Group>

                          <Form.Group controlId="newPassword">
                            <FloatingLabel
                              controlId="floatingInput"
                              label="New password"
                              className="mb-3"
                            >
                              <Form.Control
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </FloatingLabel>
                          </Form.Group>

                          <Form.Group controlId="confirmNewPassword">
                            <FloatingLabel
                              controlId="floatingInput"
                              label="Confirm new password"
                              className="mb-3"
                            >

                              <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                              />
                            </FloatingLabel>
                          </Form.Group>

                          <Button onClick={handleSavePassword}>Change Password</Button>
                        </Form>
                        <p>
                          Forgot your password?{' '}
                          <Button variant="link" onClick={handleForgotPassword}>
                            Reset Password
                          </Button>
                        </p>
                        {isLoading && <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>}
                        {passwordError && <p className="error-message" style={{ color: "red" }}>{passwordError}</p>}
                        {successMessage && <p className="success-message" style={{ color: "green" }}>{successMessage}</p>}

                      </div></Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
