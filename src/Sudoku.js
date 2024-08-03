import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.scss';

const Sudoku = () => {
  const [board, setBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const isInitialRender = useRef(false);

  useEffect(() => {
    if (!isInitialRender.current) {
      const storedBoard = sessionStorage.getItem('sudokuBoard');
      if (storedBoard) {
        setBoard(JSON.parse(storedBoard));
      } else {
      fetchSudokuData();
    }
    }
    isInitialRender.current = true;
  }, []);

  useEffect(() => {
    if (board) {
      sessionStorage.setItem('sudokuBoard', JSON.stringify(board));
    }
  }, [board]);

  const restart = () => {
    setBoard(null);
    fetchSudokuData();
  }

  const fetchSudokuData = async () => {
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      const data = await response.json();
      console.log(data);
      setBoard(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const handleNumberSelection = (number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const answer = board.newboard.grids[0].solution[row][col];

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
    <div className='sudoku'>
      <div className='sudoku__difficulty'>Difficulty: {board.newboard.grids[0].difficulty}</div>
      <div className='sudoku__board'>
        {board.newboard.grids[0].value.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className={`sudoku__row ${selectedCell?.row === rowIndex ? 'sudoku__row--selected' : ''}`.replace(/\s+/g," ").trim()}
          >
            {row.map((cell, cellIndex) => (
              <div 
                key={cellIndex} 
                className={`
                  sudoku__cell
                  ${selectedCell?.row === rowIndex && selectedCell?.col === cellIndex ? 'sudoku__cell--selected' : ''}
                  ${cell === 0 ? 'sudoku__cell--empty' : ''}
                  ${selectedCell?.col === cellIndex && selectedCell?.row !== rowIndex ? 'sudoku__cell--col-selected' : ''}
                `.replace(/\s+/g," ").trim()} 
                onClick={() => handleCellClick(rowIndex, cellIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='sudoku__number-list'>
        {numbers.map((number) => (
          <div className='sudoku__number-item' key={number} onClick={() => handleNumberSelection(number)}>{number}</div>
        ))}
      </div>
    </div>
  );
};

export default Sudoku;