import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddEntry();
    }
  };

  const handleEntryChange = (event) => {
    setNewEntry(event.target.value);
  };

  const clipBoardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNewEntry(text);
    } catch (err) {
      console.error("Failed to read clipboard text: ", err);
    }
  };

  const clipBoardCopy = async (index) => {
    const text = entries[index];
    try {
      await navigator.clipboard.writeText(text);
      console.log(`Copied "${text}" to clipboard.`);
    } catch (err) {
      console.error("Failed to write clipboard text: ", err);
    }
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
              onKeyDown={handleKeyDown}
            />
            <button onClick={clipBoardPaste}>Paste from clipboard</button>
            <button onClick={handleAddEntry}>Add Entry</button>
          </div>
          <ol>
            {entries.map((entry, index) => (
              <ClipboardEntry
                key={index}
                entry={entry}
                index={index}
                onDeleteEntry={handleDelete}
                copyMe={clipBoardCopy}
              />
            ))}
          </ol>
        </div>
      </Draggable>
    </div>
  );
};

function ClipboardEntry({ entry, index, onDeleteEntry, copyMe }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const entryRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  const checkEntryClamped = useCallback(() => {
    const entryElement = entryRef.current;
    if (entryElement) {
      entryElement.classList.add("expanded");
      const fontSize = parseInt(window.getComputedStyle(entryElement).fontSize);
      const lineHeight = Math.ceil(fontSize);
      const height = entryElement.clientHeight;
      setIsClamped(height >= lineHeight * 5.5);
      //set that integer to your desired number of lines of text + 1.5
      entryElement.classList.remove("expanded");
    }
  }, []);
  useEffect(() => {
    checkEntryClamped();
  }, [checkEntryClamped]);

  const entryClasses = isExpanded ? "entry expanded" : "entry";
  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div ref={entryRef} className={entryClasses}>
        {entry}
      </div>
      <div className="buttons">
        {isClamped && (
          <button onClick={handleToggleExpanded}>
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
        <div>
          <button onClick={() => onDeleteEntry(index)}>Delete</button>
          <button onClick={() => copyMe(index)}>Copy</button>
        </div>
      </div>
    </li>
  );
}
export default Board;
