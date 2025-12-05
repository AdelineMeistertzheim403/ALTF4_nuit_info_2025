import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import KeysPage from "./pages/KeysPage.jsx";
// import DigicodePage from "./pages/DigicodePage.jsx";
import DigicodePage from "./pages/AdminLogin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/keys" element={<KeysPage/>}/>
          <Route path="/digicode" element={<DigicodePage/>}/>


        <Route path="*" element={<Home />} /> {/* Route 404 : redirige vers la page principale */}
      </Routes>
    </div>
  );
}

export default App;
