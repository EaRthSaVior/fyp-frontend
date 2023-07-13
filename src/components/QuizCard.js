import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const QuizCard = ({ num, question, distractors, answer, id }) => {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const correctChoiceId = id;

  const shuffleChoices = useCallback(() => {
    // Create a copy of the distractors array
    const copiedChoices = [...distractors];

    // Add the correct answer as a choice
    const correctChoice = {
      _id: correctChoiceId,
      distractor: answer,
    };
    copiedChoices.push(correctChoice);

    // Shuffle the copied array using Fisher-Yates algorithm
    for (let i = copiedChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copiedChoices[i], copiedChoices[j]] = [copiedChoices[j], copiedChoices[i]];
    }

    // Set the shuffled choices
    setShuffledChoices(copiedChoices);
  }, [distractors, correctChoiceId, answer]);

  useEffect(() => {
    shuffleChoices();
  }, [shuffleChoices]);

  const handleChoiceSelection = (event) => {
    setSelectedChoice(event.target.value);
  };

  const isCorrectChoice = (choice) => {
    return choice === correctChoiceId;
  };

  const buttonStyle = {
    width: '100%',
    height: '50px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  };

  return (
    <Card className="quiz-card"style={{ width: '100%' }}>
      <Card.Header>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">Question {num}</div>
          {/* <Button variant="light" className="mr-2">
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button variant="light">
            <FontAwesomeIcon icon={faTrash} className="text-danger" />
          </Button> */}
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text>{question}</Card.Text>
        <Form>
          {shuffledChoices.map((choice) => (
            <Button
              key={choice._id}
              variant={selectedChoice === choice._id ? (isCorrectChoice(choice._id) ? 'success' : 'danger') : 'light'}
              style={buttonStyle}
              onClick={handleChoiceSelection}
              value={choice._id}
            >
              {choice.distractor}
            </Button>
          ))}
        </Form>
        <div>
          {selectedChoice ? (
            isCorrectChoice(selectedChoice) ? (
              <span className="text-success">
                <FontAwesomeIcon icon={faCheck} /> Correct!
              </span>
            ) : (
              <span className="text-danger">
                <FontAwesomeIcon icon={faTimes} /> Wrong! Please Try Again!
              </span>
            )
          ) : (
            <span className="invisible-text">1</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuizCard;
