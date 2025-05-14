import React from 'react';
import './style.css';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, onPlay, onWinning }) {
  //handleClick
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    if (xIsNext) nextSquares[i] = 'X';
    else nextSquares[i] = 'O';
    onPlay(nextSquares);
  }

  const winnerSequence = calculateWinner(squares);
  let status;
  if (winnerSequence) {
    onWinning(winnerSequence);
    ApplyGreenBorder(winnerSequence);
    status = 'Winner: ' + squares[winnerSequence[0]];
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [order, setOrder] = useState('Ascending');
  let winnerSequence = null;

  function jumpTo(nextMove) {
    if (winnerSequence) {
      const elements = document.querySelectorAll('.board .square');
      for (let i = 0; i < winnerSequence.length; i++) {
        const classArray = Array.from(elements[winnerSequence[i]].classList);
        classArray.forEach((cls) => {
          if (cls.includes('border-green'))
            elements[winnerSequence[i]].classList.remove(cls);
        });
      }
    }
    setCurrentMove(nextMove);
  }

  function SetWinnerSeq(winnerSeq) {
    winnerSequence = winnerSeq;
  }

  const movesAsc = history.map((squares, move) => {
    let description;
    let moveLocation;
    let givenMove;
    let row;
    let col;
    if (move > 0) givenMove = history[move - 1];
    else givenMove = null;
    const nextMove = history[move];

    if (givenMove != null) {
      for (let i = 0; i < givenMove.length; i++) {
        if (givenMove[i] != nextMove[i]) {
          moveLocation = i;
          break;
        }
      }
      row = Math.floor(moveLocation / 3 + 1);
      col = (moveLocation % 3) + 1;
    }

    if (move > 0) {
      description = 'Go to move #' + move + ` (${row}, ${col})`;
    } else description = 'Go to game start';

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  let moves;
  if (order === 'Ascending') moves = movesAsc;
  else moves = movesAsc.reverse();

  function toggleOrder() {
    order === 'Ascending' ? setOrder('Descending') : setOrder('Ascending');
  }

  function handleOnPlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          xIsNext={xIsNext}
          onPlay={handleOnPlay}
          onWinning={SetWinnerSeq}
        />
      </div>
      <div className="move-number">You are at move #{currentMove}</div>
      <div className="moves-order">
        <button onClick={toggleOrder}>Toggle Order</button>
        Current Order: {order}
      </div>
      <div className="game-info">
        <ol>{moves} </ol>
      </div>
    </div>
  );
}

//calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function ApplyGreenBorder(arr) {
  const selectedElements = [];
  if (arr[0] + 4 === arr[1] || arr[0] + 2 === arr[1]) {
    for (let i = 0; i < arr.length; i++) {
      const element = document.querySelector(
        `.board .square:nth-child(${arr[i] + 1})`
      );
      element.classList.add('border-green');
    }
  } else if (arr[0] + 1 === arr[1]) {
    for (let i = 0; i < arr.length; i++) {
      const element = document.querySelector(
        `.board .square:nth-child(${arr[i] + 1})`
      );
      element.classList.add('border-green-block');
      if (arr[i] % 3 === 0) element.classList.add('border-green-left');
      else if (arr[i] % 3 === 2) element.classList.add('border-green-right');
      else continue;
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      const element = document.querySelector(
        `.board .square:nth-child(${arr[i] + 1})`
      );
      element.classList.add('border-green-inline');
      if (Math.floor(arr[i] / 3) === 0)
        element.classList.add('border-green-top');
      else if (Math.floor(arr[i] / 3) === 2)
        element.classList.add('border-green-bottom');
      else continue;
    }
  }
}
