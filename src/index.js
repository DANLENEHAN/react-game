import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
	render() {
		return (
		<div
			className={this.props.className}
			onClick={this.props.onClick}
		>
			<span
				className='text-box'
			>
				{this.props.value}
			</span>
		</div>
	)
	}
}

class Board extends React.Component {

	renderSquare(key, value, className, onClick) {
		return (
			<Square
				className={className}
				key={key}
				value={value}
				onClick={onClick}
			>
			</Square>
		)
	}

	getBoard(squares) {
		let square_ob_list = [];
		for (let i = 0; i < squares.length; i ++) {
			square_ob_list.push(
				this.renderSquare(
					i,
					squares[i],
					'square-container',
					() => this.props.onClick(i)
				)
			);
		}
		return square_ob_list
	}

	render() {
		return (
			<div className='board-container'>
				{this.getBoard(this.props.squares)}
			</div>
		);
	}
}


class Game extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			current_board: Array(9).fill(null),
			history_index: 0,
		}
	}

	getHistory() {
		let history_list = [];
		for (let i =0; i < this.state.history.length; i ++) {
			history_list.push(
				<li
					className='list'
					key={i}
					onClick={() => this.reloadHistory(i)}
				>
					{(i === 0 ? "Go to Game start": "Go to move " + i)}
				</li>
			);
		}
		return history_list
	}


	reloadHistory(index) {
		const history_pick = this.state.history[index].squares;
		this.setState({
			current_board: history_pick,
			history_index: index,
		});
	}


	render() {
		let status = null;
		if (isWinner(this.state.current_board)) {
			status = "The winner is player " + (((this.state.history_index-1) % 2 === 0) ? "X": "O");
		} else {
			status = "Next player is " + (((this.state.history_index) % 2 === 0) ? "X": "O");
		}
		return (
			<div className='main-container'>
				<Board
					onClick={(index) => this.handleClick(index)}
					squares={this.state.current_board}
				>
				</Board>
				<span>
					{status}
				</span>
				<ul>
					{this.getHistory()}
				</ul>
			</div>
		)
	}

	handleClick(index) {
		const history = this.state.history.slice(0, this.state.history_index + 1);
		const current_board = this.state.history[this.state.history_index].squares.slice();

		if (!isWinner(current_board) && !current_board[index]) {
			let current_player = ((this.state.history_index) % 2 === 0) ? "X": "O";
			if (!current_board[index]) {
				current_board[index] = current_player;
			}
			this.setState({
				history: history.concat({squares: current_board}),
				current_board: current_board,
				history_index: history.length,
			});
		}
	}
}

function isWinner(board) {
	let winningSquares = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	  ];

	  for (let i = 0; i < winningSquares.length; i ++) {
		let matchCount = 0;
		let lastPlayer = null;
		for (let y = 0; y < winningSquares[i].length; y++) {
			let index = winningSquares[i][y];
			if (board[index]) {
				if (!lastPlayer) {
					lastPlayer = board[index];
					matchCount ++;
				} else if (lastPlayer === board[index]) {
					matchCount ++;
				} else {
					break;
				}
			}
		}
		if (matchCount === 3) {
			return true;
		}
	  }
	  return false;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Game></Game>
);