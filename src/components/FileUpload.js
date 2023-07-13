
import React from 'react';
import { Form } from 'react-bootstrap';
import * as PDFJS from 'pdfjs-dist'



const FileUpload = ({ setPdfText }) => {
const handleFileChange = async (event) => {
const file = event.target.files[0];
if (!file) {
  setPdfText('')
  return; }
  // if no file selected, do nothing
// Load the PDF document
try {
  const loadingTask = PDFJS.getDocument(URL.createObjectURL(file));
  const pdf = await loadingTask.promise;

  // Retrieve the number of pages in the PDF
  const numPages = pdf.numPages;

  // Initialize the text and word count
  let text = '';
  let wordCount = 0;

  // Process each page in the PDF
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);

    // Extract text content from the page
    const textContent = await page.getTextContent();

    // Extract words from the text content
    const words = textContent.items.map((item) => item.str.trim().split(/\s+/));

    // Calculate the remaining words to reach the 2000-word limit
    const remainingWords = 2000 - wordCount;

    // Check if the current page exceeds the remaining word count
    if (words.flat().length > remainingWords) {
      // Truncate the words to the remaining word count
      const truncatedWords = words.flat().slice(0, remainingWords);

      // Concatenate the truncated words to the text
      text += truncatedWords.join(' ');

      // Update the word count
      wordCount += remainingWords;

      // Break the loop since the word count limit is reached
      break;
    }

    // Concatenate the words to the text
    text += words.flat().join(' ');

    // Update the word count
    wordCount += words.flat().length;
  }

  setPdfText(text);
  console.log(text+1);
} catch (error) {
  console.error('Error reading PDF:', error);
}
};

return (
<div>
<Form>
<Form.Group controlId="formFile" className="mb-3">
<Form.Label>Upload File</Form.Label>
<Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
</Form.Group>
</Form>
<p>More than 2000 words will be ignored.</p>
</div>
);
};

export default FileUpload;