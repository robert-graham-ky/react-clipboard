import React, { useState } from "react";
import Draggable from "react-draggable";
import axios from "axios";
const Board = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };
  const handleAddEntry = () => {
    if (newEntry) {
      setEntries([...entries, newEntry]);
      setNewEntry("");
    }
  };
  const handleEntryChange = (event) => {
    setNewEntry(event.target.value);
  };

  const clipBoardPaste = async () => {
    const response = await axios.get("http://localhost:5000/clipboard");
    setNewEntry(response.data);
  };

  const clipBoardCopy = async (index) => {
    console.log(entries[index]);
    const data = { text: entries[index] };
    axios
      .post("http://localhost:5000/clipboard", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const handleDelete = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  return (
    <div>
      <Draggable position={position} handle=".handle" onStop={handleStop}>
        <div className="draggable">
          <div className="handle">Drag me</div>
          <div>I will move with the handle</div>
          <div className="entry-form">
            <input
              type="text"
              placeholder="New entry"
              value={newEntry}
              onChange={handleEntryChange}
            />
            <button onClick={clipBoardPaste}>Paste from clipboard</button>
            <button onClick={handleAddEntry}>Add Entry</button>
          </div>
          <ol>
            {entries.map((entry, index) => (
              <li key={index}>
                {entry}
                <button onClick={() => handleDelete()}>Delete</button>
                <button onClick={() => clipBoardCopy(index)}>Copy</button>
              </li>
            ))}
          </ol>
        </div>
      </Draggable>
    </div>
  );
};

export default Board;
