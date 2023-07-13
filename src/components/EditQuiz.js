import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTimesCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

function EditQuiz({ num, question, distractors, answer, id, onQuestionChange, onDistractorsChange, onAnswerChange, onDeleteQuestion }) {
  const handleQuestionEdit = (event) => {
    const newQuestion = event.target.value;
    onQuestionChange(newQuestion);
  };

  const handleDistractorsEdit = (event, index) => {
    const updatedDistractors = [...distractors];
    updatedDistractors[index] = { distractor: event.target.value };
    onDistractorsChange(updatedDistractors);
  };

  const handleAnswerEdit = (event) => {
    const newAnswer = event.target.value;
    onAnswerChange(newAnswer);
  };

  const handleDeleteButtonClick = () => {
    onDeleteQuestion();
  };

  const handleAddDistractor = () => {
    const updatedDistractors = [...distractors, { distractor: '' }];
    onDistractorsChange(updatedDistractors);
  };

  const handleDeleteDistractor = (index) => {
    const updatedDistractors = [...distractors];
    updatedDistractors.splice(index, 1);
    onDistractorsChange(updatedDistractors);
  };

  return (
    <Card className='quiz-card' style={{ width: '100%' }}>
      <Card.Header>
        <p className="question-number m-0" style={{ display: 'flex', justifyContent: 'space-between' }}>Question {num}
        <Button variant="light" onClick={handleDeleteButtonClick} style={{ paddingTop: '0px',paddingBottom: '0px',paddingLeft:"5px",paddingRight:"5px", fontSize: '14px' }}>
    <FontAwesomeIcon icon={faTimes} className="text-danger" />
  </Button></p>
      </Card.Header>
      <Card.Body>
      <div className={`input-question ${distractors.length > 1 ? 'no-margin-bottom' : ''}`}>
        <label className="input">
          <input
            className="input__field input__field--blue"
            type="text"
            placeholder=" "
            value={question}
            onChange={handleQuestionEdit}
          />
          <span className="input__label input__label3">QUESTION</span>
        </label>
        </div>
        {distractors.map((distractor, index) => (
          <div key={index} className="distractor-input">
{distractors.length > 1 && (
  <div className="delete-distractor" onClick={() => handleDeleteDistractor(index)}>
  <div className="horizontal-line-d"></div>
  <FontAwesomeIcon icon={faTimesCircle} className="delete-icon" />
</div>

)}

            <label className="input">
              <input
                className="input__field input__field--orange"
                type="text"
                placeholder=" "
                value={distractor.distractor}
                onChange={(event) => handleDistractorsEdit(event, index)}
              />
              <span className="input__label input__label2">DISTRACTOR</span>
            </label>

          </div>
        ))}
        <div className="add-distractor" onClick={handleAddDistractor}>
          <div className="horizontal-line"></div>
          <FontAwesomeIcon icon={faPlusCircle} className="plus-icon1" />
        </div>
        <label className="input">
          <input
            className="input__field input__field--green"
            type="text"
            placeholder=" "
            value={answer}
            onChange={handleAnswerEdit}
          />
          <span className="input__label input__label1">ANSWER</span>
        </label>
      </Card.Body>
    </Card>
  );
}

export default EditQuiz;
