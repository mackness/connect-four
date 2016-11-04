//libs
import React, { Component } from 'react';
import _ from 'lodash';

//components
import Slot from './Slot.js';
import WinnerOverlay from './WinnerOverlay';
import resetGame from '../utils/resetGame';

//utils
import {horizontal, vertical, diagonal, reverseDiagonal} from '../utils/sequenceFinder';

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
      ],
      activeColor: 'blue',
      winner: '',
    };
    this.handleClick = this.handleClick.bind(this)
    this.handleSlotState = this.handleSlotState.bind(this)
    this.checkForWinner = this.checkForWinner.bind(this)
    this.playerMoved = this.playerMoved.bind(this)
  }

  resetGame() {
    this.setState({
      board: [
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ],
      ],
      activeColor: 'blue',
      winner: '',
    })
  }

  checkForWinner() {
    let {board} = this.state
    let {socket} = this.props;
    if (horizontal(board) || vertical(board) || diagonal(board) || reverseDiagonal(board)) {
      this.setState({winner: this.props.color})
      socket.emit('winner', this.props.color);
    }
    socket.on('winner', (color) => this.setState({ winner: color }))
  }

  handleSlotState(colIndex, state) {
    let {board} = this.state;
    let {color} = this.props;
    let slot = {
      "state": state,
      "color": color,
      "val": color == 'blue' ? 100 : -100
    };
    
    let slotIndex = -1;

    board[colIndex].forEach((slot, i)=> {
      if (slot === 0) {
        slotIndex = i
      }
    })

    if (state == 'preview') {
      board[colIndex][slotIndex] = slot
    } else {
      board[colIndex][slotIndex + 1] = slot
    }

    this.setState({board})
  }

  setSlotPreview = (colIndex) => this.handleSlotState(colIndex, 'preview')

  clearSlotPreview(colIndex) {
    let {board, activeColor} = this.state;
    
    board[colIndex].forEach((slot, i)=> {
      if (slot && slot.state == 'preview') {
        board[colIndex][i] = 0
      }
    })

    this.setState({ board })
  }

  playerMoved() {
    let {socket} = this.props;
    socket.emit('player_moved', JSON.stringify(this.state));
  }

  handleClick(index) {
    this.handleSlotState(index, 'active')
    this.checkForWinner()
    this.playerMoved()
    this.props.toggleActivePlayer()
  }

  componentDidMount() {
    let {socket} = this.props;
    socket.on('player_moved', (state)=> {
      var {board} = JSON.parse(state)
      this.setState({board})
    })
  }

  render() {
    var {active, activeColor, board, winner} = this.state;
    var {activePlayer, color, disabled} = this.props;
    return (
      <div className={`board ${disabled == true && winner == false ? 'board--disabled' : ''}`}>
        
        {winner ? <WinnerOverlay winner={this.state.winner} reset={this.resetGame.bind(this)} /> : ''}
        
        {board.map((col, colIndex)=> {
          return <div 
                  className="column"
                  key={colIndex} 
                  onMouseEnter={this.setSlotPreview.bind(this, colIndex)}
                  onMouseLeave={this.clearSlotPreview.bind(this, colIndex)}>
            
            {col.map((slot, slotIndex)=> {
              return <Slot 
                      key={slotIndex}
                      slot={slot}
                      colIndex={colIndex}
                      slotIndex={slotIndex}
                      activeColor={this.props.color}
                      handleClick={this.handleClick} />
            })}

            </div>
        })}
      </div> 
    );
  }
}

export default Board;


