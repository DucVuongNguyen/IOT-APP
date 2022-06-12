import './App.scss';
import Login from '../components/Login/login';
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from '../components/Home/home';



function App() {

  return (

    <Routes>
      <Route index element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />

    </Routes>
  );
}

export default App;
