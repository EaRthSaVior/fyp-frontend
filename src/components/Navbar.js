  import React, { useState } from 'react';
  import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
  import { Link, useLocation } from 'react-router-dom';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faUserCircle,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
  import logo from '../img/icon.png';
  import { useDispatch } from 'react-redux';
  import { resetGridCardState,resetSearchState } from '../actionTypes';
  import { connect } from 'react-redux';
  const NavbarLink = (props) => {
    const location = useLocation();
    const [hoveredLink, setHoveredLink] = useState(null);
    const dispatch = useDispatch();
    
    const navLinkStyle = {
      textDecoration: 'none',
      transition: 'color 0.3s', // Transition effect for smooth color change
      width: '100px',
    };

    const hoverNavLinkStyle = {
      color: '#000000', // Hover link color
    };

    const activeNavLinkStyle = {
      color: '#000000', // Active link color
      fontWeight: 'bold',
    };

    const handleLinkHover = (link) => {
      setHoveredLink(link);
    };

    const isActiveLink = (link) => {
      return location.pathname === link;
    };

    const handleResetState = () => {
      dispatch(resetGridCardState());
      dispatch(resetSearchState());
    };
    return (
      <Navbar
        className={`navbar shadow-sm ${isActiveLink('/') ? 'active' : ''}`}
        variant="light"
        expand="lg"
      >
        <Container fluid>
          <Navbar.Brand className="navbrand ms-3 " as={Link} to="/">
            <div className="d-flex justify-content-center align-items-center">
              <img className="me-2" src={logo} alt="Smart Quizzer" height={30} />
              Smart Quizzer
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            
            <Nav className="ms-auto">
            {props.isLoggedIn ? (
              <>
              <Nav.Link
                as={Link}
                to="/search"
                onClick={handleResetState}
                className="nav-link"
                style={
                  hoveredLink === '/search' || isActiveLink('/search')
                    ? { ...navLinkStyle, ...hoverNavLinkStyle, ...activeNavLinkStyle }
                    : navLinkStyle
                }
                onMouseEnter={() => handleLinkHover('/')}
                onMouseLeave={() => handleLinkHover(null)}
              >
  <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/create"
                className="nav-link"
                style={
                  hoveredLink === '/create' || isActiveLink('/create')
                    ? { ...navLinkStyle, ...hoverNavLinkStyle, ...activeNavLinkStyle }
                    : navLinkStyle
                }
                onMouseEnter={() => handleLinkHover('/create')}
                onMouseLeave={() => handleLinkHover(null)}
              >
                Create
              </Nav.Link>
              
              <Nav.Link
                as={Link}
                to="/mylibrary"
                className="nav-link"
                onClick={handleResetState}
                style={
                  hoveredLink === '/mylibrary' || isActiveLink('/mylibrary')
                    ? { ...navLinkStyle, ...hoverNavLinkStyle, ...activeNavLinkStyle }
                    : navLinkStyle
                }
                onMouseEnter={() => handleLinkHover('/mylibrary')}
                onMouseLeave={() => handleLinkHover(null)}
              >
                My Library
              </Nav.Link>
           
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as={Button}
                    variant="light"
                    className="my-dropdown-toggle"
                    style={{
                      borderRadius: '50%',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="fa-2x" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={props.handleLogOut}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </>
              ) : (
                <>
                <Button variant="outline-secondary" as={Link} to="/login">
                  Log In
                </Button>
                <div className='mx-2'></div>
                               <Button variant="secondary" as={Link} to="/signup">
                               Sign Up
                             </Button>
                             </>
              )}
                 <div className='mx-2'> 
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  const mapDispatchToProps = {
    resetGridCardState,
    resetSearchState,
  };
  export default connect(null, mapDispatchToProps)(NavbarLink);
