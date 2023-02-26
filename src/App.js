import "./App.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Board from "./components/draggable";

function App() {
  return (
    <div className="App">
      <div>
        <Board />
      </div>
    </div>
  );
}

export default App;
