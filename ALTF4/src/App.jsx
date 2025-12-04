import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import GrooveBoxMain from './pages/GrooveBoxMain'

function App() {
  return (
    <div className="App">
      <h1>Mon Site React</h1>
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* exemple d'une autre route */}
        {/* <Route path="/about" element={<About />} /> */}

        <Route path="*" element={<Home />} /> {/* Route 404 redirige page principale */}
        <Route path="/groovebox" element={<GrooveBoxMain/>}/>
      </Routes>
    </div>
  );
}

export default App;
