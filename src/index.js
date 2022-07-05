import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';

/**
class Square extends React.Component {
    render() {
      return (
        <button
            className="square"
            onClick={() => {this.props.onClick();}}
        >
          {this.props.value}
        </button>
      );
    }
  }
*/

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        );
    }

    render() {
        const cols = [0, 1, 2];
        const rows = [0, 1, 2];
        return (
            <div>
                {rows.map((row) => {
                    return (
                        <div
                            className="board-row"
                            key={row}
                        >
                            {cols.map((col) => this.renderSquare(row * 3 + col))}
                        </div>
                    );
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: new Array(9).fill(null),
                location: {
                    col: null,
                    row: null,
                },
            }],
            stepNumber: 0,
            isAscendingOrder: true,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: {
                    col: i % 3,
                    row: Math.trunc(i / 3),
                },
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseHistoryOrder() {
        this.setState({
            isAscendingOrder: !this.state.isAscendingOrder,
        });
    }

    render() {
        const history = this.state.isAscendingOrder ? this.state.history : this.state.history.slice().reverse();
        const currentStepNumber = this.state.isAscendingOrder ? this.state.stepNumber : history.length - 1 - this.state.stepNumber; 
        const current = history[currentStepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const moveIndex = this.state.isAscendingOrder ? move : this.state.history.length - 1 - move;
            const desc = moveIndex ?
                `Go to move #${moveIndex}(${step.location.col}, ${step.location.row})` :
                `Go to game start`;
            return (
                <li key={moveIndex}>
                    <button
                        className={move === currentStepNumber ? 'text-bold' : ''}
                        onClick={() => this.jumpTo(moveIndex)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.reverseHistoryOrder()}>Riverse history order</button>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
            return squares[a];
        }
    }
    return null;
}
