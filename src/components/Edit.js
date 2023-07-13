
import React, { useState, useEffect } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faPlus  } from '@fortawesome/free-solid-svg-icons';
import EditQuiz from './EditQuiz';
export default function MCQ() {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(null);


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const shouldShowShadow = scrollTop > 0;
      setHasScrolled(shouldShowShadow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    fetch(`http://localhost:5000/list/own/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data:", data); // Log the received data
        setList(data);
        setLoading(false);
      
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);


  if (loading) {
    return <p>Loading...</p>;
  }
  if (!list) {
    return <p>List not found.</p>;
  }


  const handleDone = () => {
    console.log(list);
    const token = localStorage.getItem("accessToken");
    fetch(`http://localhost:5000/list/${list._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
     
      body: JSON.stringify(list),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`/question/${list._id}`);
        } else {
          throw new Error('Failed to update list');
        }
      })
      .catch((error) => {
        console.error('Error updating list :', error);
      });
  }

  const handleBack = () => {
navigate(-1);
  }



  const handleQuestionChange = (index, newQuestion) => {
    const updatedQuestions = [...list.questions];
    updatedQuestions[index].question = newQuestion;
    setList({ ...list, questions: updatedQuestions });
  };

  const handleDistractorsChange = (index, newDistractors) => {
    const updatedQuestions = [...list.questions];
    updatedQuestions[index].distractors = newDistractors;
    setList({ ...list, questions: updatedQuestions });
  };

  const handleAnswerChange = (index, newAnswer) => {
    const updatedQuestions = [...list.questions];
    updatedQuestions[index].answer = newAnswer;
    setList({ ...list, questions: updatedQuestions });
  };
  const handleDeleteQuestion = (index) => {
    // Create a copy of the current list of questions
    const updatedQuestions = [...list.questions];
  
    // Remove the question at the specified index
    updatedQuestions.splice(index, 1);
  
    // Update the list with the modified questions
    setList(prevList => ({
      ...prevList,
      questions: updatedQuestions
    }));
  };
  const handleTitleChange = (event) => {
    setList({ ...list, title: event.target.value });
  };

  const handleAccessChange = (event) => {
    setList({ ...list, public: event.target.value });
  };

  const handleTypeChange = (event) => {
    setList({ ...list, type: event.target.value });
  };

  const handleLanguageChange = (event) => {
    setList({ ...list, language: event.target.value });
  };
  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      distractors: [{distractor:""}],
      answer: ""
    };
  
    // Update the list of questions by adding the new question
    setList(prevList => ({
      ...prevList,
      questions: [...prevList.questions, newQuestion]
    }));
  };
  return (
    <>

      <div className={`header ${hasScrolled ? 'header-shadow' : ''}`}>
        <div className="header-content">
          <div className='back-button' onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="arrow-icon" style={{ color: '#000000' }} />
            <h3 className="m-0">Back</h3>
          </div>
          <Button className="header-button" onClick={handleDone}>Done</Button>
        </div>
      </div>
      <Container className='Container'>
      <div className='edit-header'>
      <label className="input">
        <input
          className="input__field"
          type="text"
          placeholder=" "
          value={list.title}
          onChange={handleTitleChange}
        />
        <span className="input__label">TITLE</span>
      </label>

      <div className="edit-setting">
        <div className="input-container">
          <label htmlFor="access">Access</label>
          <select id="access" value={list.public} onChange={handleAccessChange}>
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="type">Type</label>
          <select id="type" value={list.type} onChange={handleTypeChange}>
            <option value="MCQ">MCQ</option>
            <option value="True/False">True/False</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="language">Language</label>
          <select id="language" value={list.language} onChange={handleLanguageChange}>
            <option value="English">English</option>
            <option value="Malay">Malay</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>
    </div>
        <div className='edit-content'>
          {list.questions.map((question, index) => (
            <EditQuiz 
              key={question._id || index}
              num={index + 1}
              question={question.question}
              distractors={question.distractors}
              answer={question.answer}
              id={question._id}
              onQuestionChange={(newQuestion) => handleQuestionChange(index, newQuestion)}
              onDistractorsChange={(newDistractors) => handleDistractorsChange(index, newDistractors)}
              onAnswerChange={(newAnswer) => handleAnswerChange(index, newAnswer)}
              onDeleteQuestion={() => handleDeleteQuestion(index)}
            />
          ))}
        </div>
        <div className="edit-add-quiz" onClick={handleAddQuestion}>
      <Card className="add-quiz-card">
        <Card.Body className="add-quiz-card-body">
          <div className="plus-icon">
            <FontAwesomeIcon icon={faPlus} className="add-icon" />
          </div>
        </Card.Body>
      </Card>
    </div>
      </Container>
    </>
  )
}
