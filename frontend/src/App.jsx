import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Welcome, Home } from "./views/index";
import {bell} from './assets'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Welcome />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
