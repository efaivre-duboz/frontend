import React from 'react';
import './App.css';
eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ProductionScan from '../pages/ProductionScan';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<ProductionScan />} />
      </Routes>
      </Router>
  );

}

export default App;

      