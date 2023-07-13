
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSearch, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Mylibrary.css'
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateSearchTerm, updateGridCardState, updatePageRef, updateActiveTab } from '../actionTypes';
import SpinnerComponent from './SpinnerComponent';

const tabsData = [
  "MCQ",
  "True/False",
  "Custom",
  "Favorites",
  "Recent",

];

const MyLibrary = ({ searchTerm, cards, pageRef, activeTabData }) => {
  // Define a state to store the index of the deleted list
  const [deletedListIndex, setDeletedListIndex] = useState(null);

  const dispatch = useDispatch();
  const [info, setInfo] = useState([])
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [deletedList, setDeletedList] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (activeTabData) {
      const tabs = Array.from(tabsBoxRef.current.children);
      tabs.forEach((tab) => {
        tab.classList.remove("active");
        if (tab.textContent === activeTabData) {
          tab.classList.add("active");
        }
      });

    }
    if ((cards.length === 0)) {
      dispatch(updateGridCardState([]));
      setIsLoading(true);
      fetchCards("MCQ");
      dispatch(updateActiveTab("MCQ"))
    }

    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/list/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setInfo(data);


    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }
  }
  const fetchCards1 = async (category) => {
    try {

      const token = localStorage.getItem('accessToken');
      let url = '';

      if (category === "Recent" || category === "Favorites") {
        url = new URL('http://localhost:5000/list/other');
      } else {
        url = new URL('http://localhost:5000/list/');
      }

      url.searchParams.append('category', category);
      url.searchParams.append('page', 1);
      url.searchParams.append('perPage', '12');
      console.log(url.toString());
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.length < 12 || data === null) {
        setHasMore(false);
        console.log('No more data');
      }
      console.log(data)
      dispatch(updateGridCardState(data));
      dispatch(updatePageRef(2));

    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }

    setIsLoading(false);
  };
  const fetchCards = async (category) => {
    try {

      const token = localStorage.getItem('accessToken');
      let url = '';

      if (category === "Recent" || category === "Favorites") {
        url = new URL('http://localhost:5000/list/other');
      } else {
        url = new URL('http://localhost:5000/list/');
      }
      if (searchTerm) {
        url.searchParams.append('title', searchTerm);
      }
      url.searchParams.append('category', category);
      url.searchParams.append('page', 1);
      url.searchParams.append('perPage', '12');
      console.log(url.toString());
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.length < 12 || data === null) {
        setHasMore(false);
        console.log('No more data');
      }
      console.log(data)
      dispatch(updateGridCardState(data));
      dispatch(updatePageRef(2));

    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }

    setIsLoading(false);
  };
  const fetchMoreCards = async () => {
    try {

      const token = localStorage.getItem('accessToken');
      let url = '';

      if (activeTabData === "Recent" || activeTabData === "Favorites") {
        url = new URL('http://localhost:5000/list/other');
      } else {
        url = new URL('http://localhost:5000/list/');
      }
      if (searchTerm) {
        url.searchParams.append('title', searchTerm);
      }
      url.searchParams.append('category', activeTabData);
      url.searchParams.append('page', pageRef);
      url.searchParams.append('perPage', '12');
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.length < 12 || data === null) {
        setHasMore(false);
        console.log('No more data');
      }

      console.log(data)
      dispatch(updateGridCardState([...cards, ...data]));
      dispatch(updatePageRef(pageRef + 1));


    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }

    setIsLoading(false);
  };
  const handleCardClick = (card) => {
    navigate(`/question/${card._id}`);

  };
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight && !isLoading && hasMore) {
        dispatch(updateGridCardState([]));
        setIsLoading(true);
        fetchMoreCards();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, hasMore]);

  const handleDelete = async (card) => {
    try {
      const token = localStorage.getItem('accessToken');
      // Make a request to the backend server to delete the list
      await fetch(`http://localhost:5000/list/delete/${card._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Deleting list:', card);
      setDeletedList(card);
      // Find the index of the deleted list in the original cards array
      const index = cards.findIndex((c) => c._id === card._id);

      // Set the deleted list index in the state
      setDeletedListIndex(index);


      const updatedCards = cards.filter((c) => c._id !== card._id);
      dispatch(updateGridCardState(updatedCards));
      setTimeout(() => {
        setDeletedList(null);
        setDeletedListIndex(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  const handleUndoDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // Make a request to the backend server to restore the list
      await fetch(`http://localhost:5000/list/undelete/${deletedList._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Restoring list:', deletedList);
      const updatedCards = [
        ...cards.slice(0, deletedListIndex),
        deletedList,
        ...cards.slice(deletedListIndex),
      ];

      dispatch(updateGridCardState(updatedCards));
      setDeletedListIndex(null);
      setDeletedList(null);
    } catch (error) {
      console.error('Failed to restore list:', error);
    }
  };
  const handleUnFavorite = async (list) => {
    const token = localStorage.getItem("accessToken");

    fetch(`http://localhost:5000/users/toggleFavorite/${list._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

    })
      .then((response) => {
        if (response.ok) {
          const updatedCards = cards.filter((c) => c._id !== list._id);
          dispatch(updateGridCardState(updatedCards));
        } else {
          throw new Error('Failed to update list star status');
        }
      })
      .catch((error) => {
        console.error('Error updating list star status:', error);
      });
  };



  const handleClear = () => {
    dispatch(updateSearchTerm(""));
    setIsLoading(true);
    fetchCards1(activeTabData);
  };


  const handleSearchChange = (e) => {

    dispatch(updateSearchTerm(e.target.value));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(updateGridCardState([]));
      setIsLoading(true);
      fetchCards(activeTabData)
    }
  };



  const tabsBoxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollVal, setScrollVal] = useState(0);

  const handleIcons = (scrollVal) => {
    const maxScrollableWidth =
      tabsBoxRef.current.scrollWidth - tabsBoxRef.current.clientWidth;
    setScrollVal(scrollVal);
    const leftIcon = document.getElementById("left");
    const rightIcon = document.getElementById("right");
    if (leftIcon && rightIcon) {
      leftIcon.parentElement.style.display = scrollVal <= 10 ? "none" : "flex";
      rightIcon.parentElement.style.display =
        maxScrollableWidth - scrollVal <= 10 ? "none" : "flex";
    }
  };


  const handleIconClick = (iconId) => {
    let scrollWidth =
      tabsBoxRef.current.scrollLeft + (iconId === "left" ? -100 : 100);
    tabsBoxRef.current.scrollTo({
      left: scrollWidth,
      behavior: "smooth"
    });
    handleIcons(scrollWidth);
  };

  const handleTabClick = (index) => {
    const tabs = Array.from(tabsBoxRef.current.children);
    tabs.forEach((tab) => tab.classList.remove("active"));
    tabs[index].classList.add("active");
    dispatch(updateActiveTab(tabsData[index]));
    dispatch(updateGridCardState([]));
    setIsLoading(true);
    fetchCards(tabsData[index]);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };


  const handleMouseMove = (e) => {
    if (!isDragging) return;
    tabsBoxRef.current.classList.add("dragging");
    tabsBoxRef.current.scrollLeft -= e.movementX;
    handleIcons(tabsBoxRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    tabsBoxRef.current.classList.remove("dragging");
  };
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setInitialTouchX(e.touches[0].clientX);
    setInitialScrollLeft(tabsBoxRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    tabsBoxRef.current.scrollLeft = initialScrollLeft - (e.touches[0].clientX - initialTouchX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    tabsBoxRef.current.classList.remove("dragging");
  };
  const [initialTouchX, setInitialTouchX] = useState(null);
  const [initialScrollLeft, setInitialScrollLeft] = useState(null);
  return (
    <Container className='Container'>

      <div className='wrapper1'>
      <div className='library-header'>
        <h1>My Library</h1>
        <div className='center'>
          {info.mcqCount} MCQ <span className='center'> <FontAwesomeIcon style={{
            color: 'gray',
            fontSize: '5px',
          }} icon={faCircle} />  </span> {info.trueFalseCount} True/False  <span className='center'> <FontAwesomeIcon style={{
            color: 'gray',
            fontSize: '5px',
          }} icon={faCircle} />  </span>{info.customCount} Custom
        </div>
      </div>
        <div className="wrapper">
          <div className="icon" onClick={() => handleIconClick("left")}>
            <i id="left" className="fas fa-angle-left"></i>
          </div>
          <ul
            className="tabs-box"
            ref={tabsBoxRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {tabsData.map((tab, index) => (
              <li
                className={`tab ${index === 0 ? "active" : ""}`}
                key={index}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </li>
            ))}
            <li className='SearchLibrary'>
              <FontAwesomeIcon icon={faSearch} className='library-search-icon' />
              <input type='text' placeholder='Search' value={searchTerm} onKeyPress={handleKeyPress} onChange={handleSearchChange} className='library-search-input' />
              {searchTerm && (
                <button className="closes-button" onClick={handleClear}>
                  <FontAwesomeIcon icon={faTimes} style={{ width: '24px', height: '24px' }} />
                </button>)}
            </li>
          </ul>

          <div className="icon" onClick={() => handleIconClick("right")}>
            <i id="right" className="fas fa-angle-right"></i>
          </div>
        </div>


      </div>
      <Row>

        {cards.map((card) => (
          <Col className="p-2" key={card._id} sm={12} md={6} lg={4}>
            <Card style={{height:"188px"}}
              className="rounded-3 card-hover"

              onClick={() => handleCardClick(card)}
            >

              <Card.Body className='card-body'>
                {activeTabData === "Favorites" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnFavorite(card);
                    }}
                    className="circle-hover"
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{
                        fontSize: '1.5rem',
                        color: "lightblue",
                      }}
                    />
                  </button>
                ) : activeTabData === "Recent" ? (
                  null // Don't render anything if active tab is "Recent"
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(card);
                    }}
                    className="circle-hover"
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{
                        fontSize: '1.5rem',
                        color: 'gray',
                      }}
                    />
                  </button>
                )}
                <Card.Title style={{paddingRight:"25px"}}className="card-title-two-line">{card.title}</Card.Title>

                <p>{card.questions.length} Questions</p>
                <p>{card.type}  <span > <FontAwesomeIcon style={{
                  color: 'gray',
                  fontSize: '5px',
                }} icon={faCircle} />  </span>{card.language} </p>
                <p>
                  {(activeTabData === "Favorites" || activeTabData === "Recent") && (
                    <>
                      {card.username}  <span > <FontAwesomeIcon style={{
                        color: 'gray',
                        fontSize: '5px',
                      }} icon={faCircle} />  </span></>

                  )}

                  {card.duration}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {isLoading && <SpinnerComponent/>}

      {/* End of cards */}
      {!isLoading && !hasMore && cards.length === 0 && searchTerm !== "" && (
        <Alert variant="info">No quiz found.</Alert>
      )}

      {/* End of list */}
      {!isLoading && !hasMore && cards.length > 0 && (
        <Alert variant="info">End of list.</Alert>
      )}

      {/* Undo delete */}
      {deletedList && (
        <Alert variant="danger" className='popup-alert'>
          List deleted.{' '}
          <Button variant="link" onClick={handleUndoDelete}>
            Undo
          </Button>
        </Alert>
      )}
    </Container>
  );
}

const mapDispatchToProps = {
  updateSearchTerm,
  updateGridCardState,
  updatePageRef,
  updateActiveTab,
};
const mapStateToProps = (state) => {
  return {
    searchTerm: state.search.searchTerm,
    cards: state.gridCard.cards, // Assuming you have defined the grid card state in the gridCard reducer
    pageRef: state.gridCard.pageRef,
    activeTabData: state.gridCard.activeTabData,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyLibrary);