import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JoySignInSideTemplate from "./pages/SignInPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<JoySignInSideTemplate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
