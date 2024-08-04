import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.scss';
import * as Dialog from '@radix-ui/react-dialog';

const Sudoku = () => {
  const [board, setBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNum, setSelectedNum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState(null);
  const isInitialRender = useRef(false);
  const [open, setOpen] = useState(false);
  const [dialogDescription, setDialogDescription] = useState(null);
  const [errorMessages] = useState([
    "Sorry, wrong number. Give it another shot!",
    "Hmm, that's not correct. Try again!",
    "Oops, that's not the right number!"
  ]);

  useEffect(() => {
    if (!isInitialRender.current) {
      const storedBoard = sessionStorage.getItem('sudokuBoard');
      if (storedBoard) {
        setTimeout(() => {
          setBoard(JSON.parse(storedBoard));
          setIsLoading(false);
        }, 1800);
      } else {
        fetchSudokuData();
      }
    }
    isInitialRender.current = true;
  }, []);

  useEffect(() => {
    if (board) {
      sessionStorage.setItem('sudokuBoard', JSON.stringify(board));
      setDifficulty(board.newboard.grids[0].difficulty);
    }
  }, [board]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'sudoku__difficulty--easy';
      case 'Medium':
        return 'sudoku__difficulty--medium';
      case 'Hard':
        return 'sudoku__difficulty--hard';
      default:
        break;
    }
  }

  const openDialog = () => {
    setOpen(true);
  }

  const startNewGame = () => {
    setIsLoading(true);
    setBoard(null);
    fetchSudokuData();
  }

  const fetchSudokuData = async () => {
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      const data = await response.json();
      console.log(data);
      setTimeout(() => {
        setBoard(data);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Fetch error:', error);
      setIsLoading(false);
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    const selectedNum = board.newboard.grids[0].value[rowIndex][colIndex];
    setSelectedCell({ row: rowIndex, col: colIndex });
    setSelectedNum(selectedNum);
  };

  const handleNumberSelection = (number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const answer = board.newboard.grids[0].solution[row][col];

    if (number === answer) {
      const updatedBoard = JSON.parse(JSON.stringify(board));
      updatedBoard.newboard.grids[0].value[selectedCell.row][selectedCell.col] = number;
      setBoard(updatedBoard);
      setSelectedNum(number);
    } else {
      const randomIndex = Math.floor(Math.random() * errorMessages.length);
      setDialogDescription(errorMessages[randomIndex]);
      openDialog();
    }
  }

  const checkNumberCompleteness = (number) => {
    let isCompleted = true;
    const boardValue = board.newboard.grids[0].value;

    boardValue.forEach(row => {
      if (!row.includes(number)) {
        isCompleted = false;
        return;
      }
    });

    return isCompleted;
  }

  const numbers = Array.from({ length: 9 }, (_, index) => index + 1);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div className='sudoku'>
      <div className='sudoku__heading'>
        <h1>Sudoku</h1>
      </div>
      <div className='sudoku__difficulty'>
        Difficulty: <span className={`${getDifficultyColor(difficulty)}`}>{difficulty}</span>
      </div>
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
                  ${selectedNum === cell && cell !== 0 ? 'sudoku__cell--same-num' : ''}
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
          <div className={`sudoku__number-item ${checkNumberCompleteness(number) ? 'sudoku__number-item--completed' : ''}`.trim()} key={number} onClick={() => handleNumberSelection(number)}>{number}</div>
        ))}
      </div>
      <div>
        <button className='btn' onClick={() => startNewGame()}>New Game</button>
      </div>
      <footer className="sudoku__footer">
        <p>
          Data sourced from <a href="https://dosuku.com" target="_blank" rel="noopener noreferrer">Dosuku</a> | 
          Developed by <a href="https://github.com/tedythsu" target="_blank" rel="noopener noreferrer">Ted Hsu</a>
        </p>
      </footer>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Message</Dialog.Title>
            <Dialog.Description className="DialogDescription">
            {dialogDescription}
            </Dialog.Description>
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <button className='btn'>OK</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Sudoku;
