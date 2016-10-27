//libs
import React, { Component } from 'react';
import _ from 'lodash';
import io from '../libs/socket.io.js';

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
    this.handleWebSockets = this.handleWebSockets.bind(this)
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

  toggleActiveColor() {
    let {activeColor} = this.state
    this.setState({
      activeColor: activeColor == 'blue' ? 'red' : 'blue'
    })
  }

  checkForWinner() {
    let {board} = this.state
    if (horizontal(board) || vertical(board) || diagonal(board) || reverseDiagonal(board)) {
      this.setState({
        winner: this.state.activeColor
      })
    } 
  }

  handleSlotState(colIndex, state) {
    let {board, activeColor} = this.state;
    let slot = {
      "state": state,
      "color": activeColor,
      "val": activeColor == 'blue' ? 100 : -100
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

  handleWebSockets() {
    console.log('handleWebSockets')
    io().emit('player_moved', JSON.stringify(this.state));
    io().on('player_moved', (state)=> {
      console.log(JSON.parse(state))
      this.setState(JSON.parse(state))
    })
  }

  handleClick(index, activeColor) {
    this.handleSlotState(index, 'active')
    this.toggleActiveColor()
    this.checkForWinner()
    this.handleWebSockets()
  }

  render() {
    var {active, activeColor, board} = this.state
    if (this.state.winner) {
      var winnerOverlay = (
        <div className="winner-overlay">
          <h2 class="title">{this.state.winner} won!</h2>
        </div>
      );
    } else {
      var winnerOverlay;
    }
    return (
      <div>
        <h1 className="headline">Connect 4</h1>
        <div className="board">
          
          {this.state.winner ? <WinnerOverlay winner={this.state.winner} reset={this.resetGame.bind(this)} /> : ''}
          
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
                        activeColor={activeColor}
                        handleClick={this.handleClick} />
              })}
              
              </div>
          })}
        </div> 
      </div>
    );
  }
}

export default Board;


