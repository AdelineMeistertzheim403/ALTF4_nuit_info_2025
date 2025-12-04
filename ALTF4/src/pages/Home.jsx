import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LaserGame from '../components/LaserGameComponent/LaserGame';

function Home() {
  return (
    <div>
      <LaserGame />
      <h1>Mon Site React</h1>
      
    </div>
  );
}

export default Home;
