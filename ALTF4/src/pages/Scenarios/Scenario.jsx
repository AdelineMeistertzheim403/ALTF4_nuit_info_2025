import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dialogs from '../../lib/utils/dialogs.js';

const dialog = new Dialogs();

function App() {

    dialog.showDialog('My Title', 'This is the alert message. blablablablablablablablablablablablablablablablablabla', 20);

    return (
        <div>
            <h1>Scenario</h1>
        </div>
    );
}

export default App;