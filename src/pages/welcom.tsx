import React from 'react';
import { Link } from 'react-router-dom';

interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <div className="bg-red-900 ">
      <h1 className="bg-red-400">bienenido</h1>
      <p>Nos alegra tenerte aquí. Disfruta tu experiencia.</p>
      <Link
        to="/login"
        className=" bg-blue-500 rounded hover:bg-red-600"
      >
        Ir al Login paarque se mas grande
      </Link>
      <h1 className='bg-red-200'>
        toth hb
      </h1>
    </div>
  );
};

export default Welcome;
