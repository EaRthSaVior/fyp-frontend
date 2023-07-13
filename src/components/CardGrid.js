import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faEllipsisVertical, faPeriod } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';

import { updateGridCardState, updatePageRef } from '../actionTypes';
import SpinnerComponent from './SpinnerComponent';
const CardGrid = ({ done, hasMore, setHasMore, isLoading, setIsLoading, filterOptions, searchTerm, pageRef, cards, updateGridCardState, updatePageRef }) => {

  const [deletedList, setDeletedList] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  // Load the quiz from the server
  const loadMoreCards = async () => {
    if (searchTerm.trim() !== '') {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        const url = new URL('http://localhost:5000/list/search/');
        url.searchParams.append('title', searchTerm);
        url.searchParams.append('page', pageRef); // Access the mutable reference
        url.searchParams.append('perPage', '12');
        url.searchParams.append('order', filterOptions.sort);
        url.searchParams.append('type', filterOptions.type);
        url.searchParams.append('language', filterOptions.language);
        url.searchParams.append('num', filterOptions.numQues);
        console.log(url.toString());
        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.length < 12 || data === null) {
          setHasMore(false);
          console.log('No more data');
        }

        console.log(data)
        updateGridCardState([...cards, ...data]);
        updatePageRef(pageRef + 1);

      } catch (error) {
        console.error('Failed to load cards:', error);
      }

      setIsLoading(false);
    }
  };

  // const debounceSearch = useRef(null);

  // useEffect(() => {
  //   updateGridCardState([]); // Reset the cards state to an empty array
  //   setHasMore(true);

  //   if (searchTerm === '') {
  //     // Handle empty search term case if needed
  //   } else {
  //     if (debounceSearch.current) {
  //       clearTimeout(debounceSearch.current);
  //     }

  //     debounceSearch.current = setTimeout(async () => {
  //       await loadCards();
  //     }, 1500);
  //   }

  //   return () => {
  //     if (debounceSearch.current) {
  //       clearTimeout(debounceSearch.current);
  //     }
  //   };
  // }, [searchTerm, filterOptions]);

  const fetchData = useCallback(async () => {

    if (searchTerm === '') {
      // Handle empty search term case if needed
    } else {
      await loadMoreCards();
    }
  }, [loadMoreCards]);

  // Scroll down and call loadCards
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight && !isLoading && hasMore && searchTerm !== '') {

        fetchData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, hasMore, searchTerm]);

  // Click to go to the question page
  const handleCardClick = (card) => {
    navigate(`/question/${card._id}`);
  };

  // Soft delete
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
      const updatedCards = cards.filter((c) => c._id !== card._id);
      updateGridCardState(updatedCards);
      setTimeout(() => {
        setDeletedList(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  // Restore back
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
      // await loadCards();
      setDeletedList(null);
    } catch (error) {
      console.error('Failed to restore list:', error);
    }
  };


  return (
    <Container>


      {/* Render filtered and sorted cards */}
      <Row>

        {cards.map((card) => (
          <Col className="p-2" key={card._id} sm={12} md={6} lg={4}>
            <Card style={{height:"188px"}}
              className="rounded-3 card-hover"

              onClick={() => handleCardClick(card)}
            >

              <Card.Body className='card-body'>
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(card);
                  }}

                  className="circle-hover"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    style={{
                      fontSize: '1.5rem',
                      color: 'gray',
                    }}
                  />
                </button> */}
                <Card.Title className="card-title-two-line">{card.title}</Card.Title>

                <p>{card.questions.length} Questions</p>
                <p>{card.type}  <span> <FontAwesomeIcon style={{
                  color: 'gray',
                  fontSize: '5px',
                }} icon={faCircle} />  </span>{card.language}</p>
                <p>
                  {card.username}
                  <span>
                    <FontAwesomeIcon
                      style={{
                        color: 'gray',
                        fontSize: '5px',
                      }}
                      icon={faCircle}
                    />
                  </span>
                  {card.duration}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Loader */}
      {isLoading && <SpinnerComponent />}

      {/* End of cards */}
      {!isLoading && !hasMore && done && cards.length === 0 && searchTerm !== "" && (
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
};
const mapStateToProps = (state) => {
  return {
    searchTerm: state.search.searchTerm,
    filterOptions: state.search.filterOptions,
    cards: state.gridCard.cards, // Assuming you have defined the grid card state in the gridCard reducer
    pageRef: state.gridCard.pageRef
  };
};

const mapDispatchToProps = {
  updateGridCardState,
  updatePageRef,
};
export default connect(mapStateToProps, mapDispatchToProps)(CardGrid);
// export default CardGrid;