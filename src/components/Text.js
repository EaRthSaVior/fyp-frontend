import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const Text = ({ text, setText }) => {
  const [wordCount, setWordCount] = useState(0);

  const handleTextAreaChange = (event) => {
    const textArea = event.target.value;
    setText(textArea);
    const newWordCount = textArea.trim() === '' ? 0 : textArea.trim().split(/\s+/).length;
    setWordCount(newWordCount);
  };

  const handleClearText = () => {
    setText('');
    setWordCount(0);
  };

  const textareaStyle = {
    outline:"none",
    border:"none",
    resize: 'vertical',
    minHeight: '100px',
    maxHeight: '300px',
     border: wordCount > 2000 ? '2px solid red' : '2px solid #ced4da',
  };

  return (
    <Form>
      <h5>Copy & Paste Text</h5>
      <textarea
        className="w-100"
        value={text}
        onChange={handleTextAreaChange}
        style={textareaStyle}
        placeholder="Enter text... "
      ></textarea>
      <br />
      <div>{wordCount}/2000</div>
      <button type="button" onClick={handleClearText}>Clear</button>
    </Form>
  );
};

export default Text;
