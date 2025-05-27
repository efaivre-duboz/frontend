import React from 'react';
import './App.css';
eslint-disable-next-line
// Import par défaut pour react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Ou essayez ceci si l'erreur persiste :
// import Router from 'react-router-dom/BrowserRouter';
// import Routes from 'react-router-dom/Routes';
// import Route from 'react-router-dom/Route';

import { CssBaseline } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <div className="App">
        <h1>ProdMaster Frontend</h1>
        <p>Interface utilisateur en cours de développement...</p>
      </div>
    </Router>
  );
}

export default App;