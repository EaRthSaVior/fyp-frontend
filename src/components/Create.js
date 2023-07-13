import React, { useState, useEffect } from 'react';
import { Container, Col, Form, Button } from 'react-bootstrap';
import { Switch } from 'antd';
import Loading from './Loading';
import 'pdfjs-dist/build/pdf.worker.entry';
import QuestionCard from './QuestionCard'
import * as PDFJS from 'pdfjs-dist'
import { useParams  } from "react-router-dom";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const Create = ({ isLoggedIn }) => {
  const { id } = useParams();

  const [continueGenerate,setContinueGenerate] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('MCQ');
  const [number, setNumber] = useState(1);
  const [language, setLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState('Easy');

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    
    if(id!==undefined){
    setLoading(true);
    const token = localStorage.getItem("accessToken");
  
    fetch(`http://localhost:5000/list/own/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Unauthorized');
        }
      })
      .then((data) => {
        console.log("Received data onwer:", data); // Log the received data
        if(data.own){
        setList(data);
        setContinueGenerate(true)
        }else{
          throw new Error('Unauthorized');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        
          setLoading(false);
      
      });
    }

  }, [id]);
  const handleDifficulty = (event) => {
    setDifficulty(event.target.value);
  };
  const handleLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const handleQuizTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleNumOfQuestionsChange = (event) => {
    setNumber(event.target.value);
  };





  const handleRequest = () => {
    setError('');
    setLoading(true);

    if (message.trim() === "") {
      setError('It cannot be empty');
      setLoading(false);
      return;
    }
    if(continueGenerate&&list.length!==0){

    }else{
    if (title.trim() === '') {
      setError('Title cannot be empty');
      setLoading(false);
      return;
    }}
    const words = message.trim().split(/\s+/);
    const truncatedWords = words.slice(0, 1500);
    const truncatedMessage = truncatedWords.join(' ');
    const token = localStorage.getItem('accessToken');
    if (!isLoggedIn) {
      try {
        throw new Error('Please Login');
      } catch (error) {
        // Display the error to the user
        alert(error.message);
        setLoading(false);
        return;
      }
    }
    console.log(title,
      message,
      type,
      language,
      difficulty,)
    fetch('http://localhost:5000/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.trim(),
        ...(continueGenerate && list.length!==0 && {_id: list._id }),
        message :truncatedMessage,
        type,
        language,
        difficulty,
        number,
      }),
 
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error. Please try again later or make your text shorter');
        }
      })
      .then((list) => {
        // Do something with the list...
        setList(list);
        setLoading(false);

      })
      .catch((error) => {
        // handle the error
        setLoading(false);
        console.log(error);
        setError(error.message);
      });
  };


  const handleTextAreaChange = (event) => {
    const textArea = event.target.value;
    setMessage(textArea);
    const newWordCount = textArea.trim() === '' ? 0 : textArea.trim().split(/\s+/).length;
    setWordCount(newWordCount);
  };

  const handleClearText = () => {
    setMessage('');
    setWordCount(0);
  };

  const textareaStyle = {
    padding:"10px",
    whiteSpace: 'pre-wrap',
    overflowX: 'hidden',
    width: '100%',
    outline:"none",
    resize: 'vertical',
    minHeight: '300px',
    borderRadius:"2px",
     border: wordCount > 1500 ? '3px solid red' : '3px solid grey',
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
  
    try {
      const loadingTask = PDFJS.getDocument(URL.createObjectURL(file));
      const pdf = await loadingTask.promise;
  
      const numPages = pdf.numPages;
      let text = '';
  
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const words = textContent.items.map((item) => item.str.trim().split(/\s+/));
        text += words.flat().join(' ');
      }
  
      setMessage(message + text);
      console.log(text);
  
      // Update the word count after setting the message
      const newWordCount = (message + text).trim() === '' ? 0 : (message + text).trim().split(/\s+/).length;
      setWordCount(newWordCount);
    } catch (error) {
      console.error('Error reading PDF:', error);
    }
  };

  const onChangeToggle = (checked) => {
    setContinueGenerate(checked);
    console.log(`Switch changed to ${checked}`);
  };  
  const textStyle = {
    color: wordCount > 1500 ? 'red' : 'black'
  };
  return (
    <Container fluid className="Container">
      <Col className="shadow-sm bg-white m-2 p-3 mx-auto" style={{ width: '100%' }}>
      <div className='m-3'>
      <Form>
      <div className='d-flex flex-column flex-md-row align-items-baseline justify-content-between'>
  <h2 className="fw-bold">Copy & Paste Text</h2>
  <div className="text-end"><span style={textStyle}>{wordCount}/1500</span></div>
</div>

      <textarea
        className="w-100"
        value={message}
        onChange={handleTextAreaChange}
        style={textareaStyle}
        placeholder="Enter text... you can also write a topic to generate quiz but make sure write as specific as possible. Each quiz generation have a text input with a maximum limit of 1500 words. If the input exceeds this limit, the extra text will be ignored or truncated."
      ></textarea>
      <br />
      <div className='row'>
      <div className='col-lg-6 col-md-12 mt-3'>
  <label htmlFor="fileInput" className="btn btn-outline-primary w-100">
    Import Text from PDF
    <input
      type="file"
      id="fileInput"
      accept=".pdf"
      onChange={handleFileChange}
      style={{ display: 'none' }}
    />
  </label>
</div>
      <div className='col-lg-6 col-md-12 mt-3'>
      <Button className='w-100' variant='outline-secondary' onClick={handleClearText}>Clear</Button>
      </div>

      </div>
    </Form>
    </div>
        {/* <Tabs
          activeKey={selectedTab}
          onSelect={handleTabSelect}
          id="justify-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="Text" title="Text">
            <Text text={text} setText={setText} />
          </Tab>
          <Tab eventKey="PDF" title="PDF">
            <FileUpload setPdfText={setPdfText} />
          </Tab>
        </Tabs> */}
        <Form>
          <div className='m-3'>
            <div className='mb-3'>
              <Form.Group controlId="title">
                <Form.Label className="fw-bold">Title</Form.Label>
                <Form.Control type="text" value={title} onChange={handleTitleChange} disabled={continueGenerate}/>
              </Form.Group>
            </div>
            <div className='row'>
              <div className='col-lg-6 col-md-12 mb-3'>
                <Form.Group controlId="quizType">
                  <Form.Label className="fw-bold">Type of Quiz</Form.Label>
                  <Form.Select value={type} onChange={handleQuizTypeChange}>
                    <option>MCQ</option>
                    <option>True/False</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className='col-lg-6 col-md-12 mb-3'>
                <Form.Group controlId="numOfQuestions">
                  <Form.Label className="fw-bold">Number of Questions</Form.Label>
                  <Form.Select value={number} onChange={handleNumOfQuestionsChange}>
                    {[...Array(15)].map((_, index) => (
                      <option key={index + 1}>{index + 1}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-6 col-md-12 mb-3'>
                <Form.Group controlId="language">
                  <Form.Label className="fw-bold">Language</Form.Label>
                  <Form.Select value={language} onChange={handleLanguage}>
                    <option>English</option>
                    <option>Malay</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className='col-lg-6 col-md-12 mb-3'>
                <Form.Group controlId="difficulty">
                  <Form.Label className="fw-bold">Difficulty</Form.Label>
                  <Form.Select value={difficulty} onChange={handleDifficulty}>
                    <option>Easy</option>
                    <option>Average</option>
                    <option>Hard</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className='row'>
            <div className='col-lg-6 col-md-12 mb-3 d-flex'>
            <Form.Label className="fw-bold ">Continue Generate</Form.Label>
            <div style={{marginLeft:"10px"}}>  <Switch checked={continueGenerate} onChange={onChangeToggle}  disabled={list.length === 0}/></div>
          
            </div>
            <div className='col-lg-6 col-md-12 mb-3'>
              <Button className='w-100' onClick={handleRequest} disabled={loading}>
                {loading ? 'Loading...' : 'Generate'}
              </Button>
            </div>
            </div>
            <div style={{color:"red"}}>{error}</div>
          </div>

        
        </Form>
      </Col>
      <Col >
        {loading ? <Loading /> : <QuestionCard list={list} own={true} create={1} setList={setList}/>}
      </Col>

    </Container>

  );
};

export default Create;
