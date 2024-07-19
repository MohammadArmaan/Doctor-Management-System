/* eslint-disable react/no-unescaped-entities */
// src/components/NotFound.jsx

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className='main'>
    <div className="error">
        <div className='error__title'>
             <h2 className='heading__secondary'>Oops! The page you're looking for doesn't exist.</h2>
        </div>
    </div>
    <div className='error__information'>
        <h2 className='error__status'>404</h2>
      <p className='error__msg'>Please go back to home page</p>
    </div>
    <br></br>
    <br></br>
    <br></br>
      <Link to="/" className="warning__link login__link">Go back to Home</Link>
    </main>
  );
};

export default NotFound;
