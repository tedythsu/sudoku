import React, { useState, useEffect, useRef } from 'react';
import './Board.css';

const Board = () => {
  const [board, setBoard] = useState(null);
  const renderAfterCalled = useRef(false);

  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetch('https://sudoku-api.vercel.app/api/dosuku')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBoard(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }
    renderAfterCalled.current = true;
  }, []);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <div>Difficulty: {board.newboard.grids[0].difficulty}</div>
      <div className='board'>
        {board.newboard.grids[0].value.map((row, rowIndex) => (
          <div key={rowIndex} className='row'>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className='cell'>
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
