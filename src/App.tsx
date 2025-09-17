
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Pacientes from "./pacientes/page";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold"></div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
