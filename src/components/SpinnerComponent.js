import Spinner from 'react-bootstrap/Spinner';

const SpinnerComponent = () => (
  <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default SpinnerComponent;