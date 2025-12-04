import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* exemple d'une autre route */}
        {/* <Route path="/about" element={<About />} /> */}

        <Route path="*" element={<Home />} /> {/* Route 404 : redirige vers la page principale */}
      </Routes>
    </div>
  );
}

export default App;
