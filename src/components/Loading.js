import React from 'react';
import { Card, Button } from 'react-bootstrap';


const Loading = () => {
  return (
    <Card className="quiz-card loading">
      <Card.Header>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 loading-text" />
        </div>
      </Card.Header>
      <Card.Body>
        <Button className="loading-button" />
        <Button className="loading-button" />
        <Button className="loading-button" />
        <Button className="loading-button" />
      </Card.Body>
    </Card>
  );
};

export default Loading;
