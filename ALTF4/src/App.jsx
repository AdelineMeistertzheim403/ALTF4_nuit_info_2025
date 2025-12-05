import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import GrooveBoxMain from './pages/GrooveBoxMain'

import Scenario from './pages/Scenarios/Scenario';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Scenario />} />

        <Route path="/groovebox" element={<GrooveBoxMain/>}/>

        {/* exemple d'une autre route */}
        {/* <Route path="/about" element={<About />} /> */}

        <Route path="*" element={<Scenario />} /> {/* Route 404 : redirige vers la page principale */}
      </Routes>
    </div>
  );
}

export default App;
