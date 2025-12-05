import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import KeysPage from "./pages/KeysPage.jsx";
// import DigicodePage from "./pages/DigicodePage.jsx";
import DigicodePage from "./pages/AdminLogin";
import GrooveBoxMain from './pages/GrooveBoxMain'

import SnakeSoulsApp from './SnakeSouls/App';
import Scenario from './pages/Scenarios/Scenario';
import Defis1 from "./pages/Defis1";
import Defis2 from "./pages/Defis2";
import Defis3 from "./pages/Defis3";


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/keys" element={<KeysPage/>}/>
          <Route path="/digicode" element={<DigicodePage/>}/>
        <Route path="/scenario" element={<Scenario />} />
        <Route path="/" element={<Scenario />} />

        <Route path="/groovebox" element={<GrooveBoxMain/>}/>
          <Route path="/defis1" element={<Defis1/>}/>
          <Route path="/defis2" element={<Defis2/>}/>
          <Route path="/defis3" element={<Defis3/>}/>
        <Route path="/snake" element={<SnakeSoulsApp />} />


        <Route path="*" element={<Scenario />} /> {/* Route 404 : redirige vers la page principale */}
      </Routes>
    </div>
  );
}

export default App;
