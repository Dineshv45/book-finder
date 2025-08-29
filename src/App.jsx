import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import BookDetails from "./components/BookDetails.jsx";
import Preloader from "./components/Preloader.jsx";
import "./App.css";

export default function App() {
  const [loadingFinished, setLoadingFinished] = useState(false);

  return (
    <>
      {!loadingFinished && <Preloader onFinish={() => setLoadingFinished(true)} />}
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </>
  );
}
