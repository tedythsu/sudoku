import React, { useState, useEffect, useRef } from 'react';
import './Board.css';

const Board = () => {
  const [board, setBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
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

  const handleCellClick = (param1, param2) => {
    setSelectedCell({ row: param1, col: param2 });
    console.log(selectedCell)
  };

  const selectNumber = (number) => {
    const answer = board.newboard.grids[0].solution[selectedCell.row][selectedCell.col];

    if (number === answer) {
      const updatedBoard = JSON.parse(JSON.stringify(board));
      updatedBoard.newboard.grids[0].value[selectedCell.row][selectedCell.col] = number;
      setBoard(updatedBoard);
    } else {
      window.alert('錯誤!')
    }
  }

  const numbers = Array.from({ length: 9 }, (_, index) => index + 1);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <div>Difficulty: {board.newboard.grids[0].difficulty}</div>
      <div className='board'>
        {board.newboard.grids[0].value.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className={`row ${selectedCell && selectedCell.row === rowIndex ? 'row--selected' : ''}`.trim()}
          >
            {row.map((cell, cellIndex) => (
              <div 
                key={cellIndex} 
                className={`cell ${selectedCell && selectedCell.row === rowIndex && selectedCell.col === cellIndex ? 'cell--selected' : ''} ${cell === 0 ? 'clickable-cell' : ''} ${selectedCell && selectedCell.col === cellIndex ? 'col--selected' : ''}`.trim()}  
                onClick={() => handleCellClick(rowIndex, cellIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='number-list'>
        {numbers.map((number) => (
          <div className='number-list__item' key={number} onClick={() => selectNumber(number)}>{number}</div>
        ))}
      </div>
    </div>
  );
};

export default Board;
