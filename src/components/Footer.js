import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light text-center">
      <Container>
        <Row>
          <Col>
            <div
              style={{
                fontSize: 'smaller',
                color: 'black',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              © 2023 SmartQuizzer, All rights reserved
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
