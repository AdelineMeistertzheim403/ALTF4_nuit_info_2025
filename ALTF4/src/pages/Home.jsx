import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dialogs from '../lib/utils/dialogs.js'

const dialog = new Dialogs();

function App() {
    const openAlertDialog = () => {
        dialog.showDialog('My Title', 'This is the alert message. blablablablablablablablablablablablablablablablablabla', 20);
    };
  return (
    <div>
      <h1>Mon Site React</h1>
        <button onClick={openAlertDialog}>Show Alert</button>
    </div>
  );
}

export default App;