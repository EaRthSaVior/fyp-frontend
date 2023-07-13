import React, { useState } from 'react';
import QuizCard from './QuizCard';
import { saveAs } from 'file-saver';
import Dropdown from 'react-bootstrap/Dropdown';
import { Document as pdfDocument, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Button, Alert, Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, } from '@fortawesome/free-regular-svg-icons';
import { faStar as sFastar, faCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { PDFDocument, StandardFonts } from 'pdf-lib';


const QuestionCard = ({ list, own ,create,setList}) => {
  const [showWaring, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isStarred, setIsStarred] = useState(list.isFavorite);
  if (!list || !list.questions || list.questions.length === 0) {
    return <div></div>;
  }
  const exportCSV = () => {
    const quizData = list.questions.map((question) => {
      const answerChoices = [question.answer, ...question.distractors.map((distractor) => distractor.distractor)];

      shuffleArray(answerChoices); // Randomize the order of answer choices

      const row = {
        question: question.question,
        answer: question.answer,
      };

      // Assign choices dynamically based on available options
      answerChoices.forEach((choice, index) => {
        row[String.fromCharCode(97 + index)] = choice; // Assign choices as a, b, c, d, ...
      });

      return row;
    });

    // Get the maximum number of choices for any question
    const maxChoices = Math.max(...quizData.map((row) => Object.keys(row).length - 2)); // Subtract 2 for question and answer columns

    // Generate header based on maximum number of choices
    const header = {
      question: 'Question',
      answer: 'Answer',
    };
    for (let i = 0; i < maxChoices; i++) {
      header[String.fromCharCode(97 + i)] = String.fromCharCode(65 + i); // Assign labels as A, B, C, D, ...
    }

    const csvData = [header, ...quizData];

    // Convert csvData to CSV format with quoted values
    const csvContent = csvData.map((row) => Object.values(row).map(value => `"${value}"`).join(",")).join("\n");

    // Create a Blob object from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // Save the Blob object as a file
    saveAs(blob, "quiz_data.csv");
  };



  const exportPDF = () => {

  };



  // Function to shuffle an array using the Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const exportWord = () => {
    const doc = new Document({
      creator: "Smart Quizzer",
      description: "My Quiz",
      title: list.title,
      sections: [
        {
          children: list.questions.flatMap((question, index) => {
            const questionText = `Question ${index + 1}:${question.question}`;
            const answerChoices = [question.answer, ...question.distractors.map(distractor => distractor.distractor)];

            shuffleArray(answerChoices); // Randomize the order of answer choices

            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: questionText,
                    size: 24,
                  }),
                ],
              }),
              ...answerChoices.map((choice, choiceIndex) => {
                const choiceLabel = String.fromCharCode(65 + choiceIndex); // Convert index to corresponding letter (A, B, C, D, ...)
                return new Paragraph({
                  children: [
                    new TextRun({ text: `${choiceLabel}. ${choice}`, size: 24, }),
                  ],
                });
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Answer: ${question.answer}`, size: 24, }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: " ", size: 24, }),
                ],
              }),
            ];
          }),
        },
      ],
    });

    // Convert the document to a Blob object
    Packer.toBlob(doc).then((blob) => {
      // Save the Blob object as a file using file-saver
      saveAs(blob, 'quiz_data.docx');
    });
  };


  const handleShowDelete = () => {
    setShowWarning(!showWaring);
  }
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // Make a request to the backend server to delete the list
      await fetch(`http://localhost:5000/list/delete/${list._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Deleting list:', list);
      if(create){
       setList([]);
      }else{
      navigate(-1);
      }
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  }


  const handleEdit = () => {
    navigate(`/edit/${list._id}`);
  }
  const copyLink = () => {
    const link = `http://localhost:3000/question/${list._id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setIsLinkCopied(true);
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Failed to copy link to clipboard:", error);
      });
  };

  const handleStarClick = () => {
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
          setIsStarred(!isStarred);
        } else {
          throw new Error('Failed to update list star status');
        }
      })
      .catch((error) => {
        console.error('Error updating list star status:', error);
      });
  };
  const handleSave = () => {
    console.log(list)
    const token = localStorage.getItem("accessToken");
    fetch(`http://localhost:5000/list/`, {
      method: 'Post',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Server error');
        }
      })
      .then((data) => {
        console.log("Received data:", data); // Log the received data
        navigate(`/question/${data._id}`)
      })
      .catch((error) => {
        console.error('Error :', error);
      });
  }
const handleContinue= ()=>{
  navigate(`/create/${list._id}`);
}
  return (
    <Container className='Container'>
      <div className="d-flex flex-column py-2  justify-content-center">
        <div className="d-flex flex-wrap mb-3 align-items-center justify-content-center w-100">
          <div className="d-flex flex-wrap justify-content-center  align-items-center ">
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="exportDropdown" className='m-1'>
                Export Quiz
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={exportCSV}>CSV</Dropdown.Item>
                {/* <Dropdown.Item onClick={exportPDF}>PDF</Dropdown.Item> */}
                <Dropdown.Item onClick={exportWord}>Word</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button className='m-1'variant="outline-primary" onClick={copyLink}>Copy Link</Button>
            {isLinkCopied && (
              <Alert
                variant="success"
                className="popup-alert"
                onClose={() => setIsLinkCopied(false)}
                dismissible
              >
                Link Copied!
              </Alert>
            )}
          {/* </div> */}
{/* 
          <div className="d-flex flex-wrap align-items-center"> */}
            {own ? (
              <>
               <Button className='m-1' variant="outline-primary" onClick={handleContinue}>Continue Generate</Button>
                <Button className='m-1' variant="outline-primary" onClick={handleEdit}>Edit</Button>
                <Button className='m-1' variant="outline-primary" onClick={handleShowDelete}>Delete</Button>
              </>
            ) : (
              <Button className='m-1' variant="outline-primary" onClick={handleSave}>Save to My Library</Button>
            )}
            <span className={`star-icon ${isStarred ? 'starred' : ''}`} onClick={handleStarClick}>
              {isStarred ? (
                <FontAwesomeIcon  icon={sFastar} className="star-icon-starred m-1" />
              ) : (
                <FontAwesomeIcon icon={faStar} className="star-icon-normal m-1  " />
              )}
            </span>
          </div>
        </div>

        <Card className="quiz-card" style={{ width: '100%' }}>
          <Card.Body>
          <Card.Title ><h1>{list.title} </h1>  </Card.Title>
           
            <div className='center'>
              {list.questions.length}  Questions<span className='center'><FontAwesomeIcon style={{
                color: 'gray',
                fontSize: '5px',
              }} icon={faCircle} />  </span>
              {list.type} <span className='center'><FontAwesomeIcon style={{
                color: 'gray',
                fontSize: '5px',
              }} icon={faCircle} />  </span>
              {list.language}<span className='center'><FontAwesomeIcon style={{
                color: 'gray',
                fontSize: '5px',
              }} icon={faCircle} />  </span>
              {list.public ? (
                <text>Public</text>
              ) : (
                <text>Private</text>
              )}
            </div>
          </Card.Body>
        </Card>
        {list.questions.map((question, index) => (
          <QuizCard
            key={question._id || index}
            num={index + 1}
            question={question.question}
            distractors={question.distractors}
            answer={question.answer}
            id={question._id}
          />
        ))}
      </div>
      {showWaring && (
        <>
          <div className="overlay" onClick={handleShowDelete} />
          <div className="filter-card-pop-up">
            <div className="filter-card-header">
              <span className="filter-card-title">Are you sure you want to delete this?</span>

            </div>
            <div className="text-end">
              <Button variant="outline-secondary" className="me-2" onClick={handleShowDelete}>
                Cancel
              </Button>
              <Button variant="danger" className="me-2" onClick={handleDelete}>
                Delete
              </Button>
            </div>

          </div>
        </>
      )}
    </Container>
  );
};

export default QuestionCard;