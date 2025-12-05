import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import KeysPage from "./pages/KeysPage.jsx";
// import DigicodePage from "./pages/DigicodePage.jsx";
import DigicodePage from "./pages/AdminLogin";
import GrooveBoxMain from './pages/GrooveBoxMain'
import Scenario from './pages/Scenarios/Scenario';
import Defis1 from "./pages/Defis1.jsx";
import Defis2 from "./pages/Defis2.jsx";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/keys" element={<KeysPage/>}/>
          <Route path="/digicode" element={<DigicodePage/>}/>
        <Route path="/scenario" element={<Scenario />} />
        <Route path="/groovebox" element={<GrooveBoxMain/>}/>
          <Route path="/defis1" element={<Defis1/>}/>
          <Route path="/defis2" element={<Defis2/>}/>

        <Route path="*" element={<Home />} /> {/* Route 404 : redirige vers la page principale */}
      </Routes>
    </div>
  );
}

export default App;
