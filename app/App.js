import React, { Component } from 'react';
import Board from './components/Board';
import Chat from './components/Chat';

class App extends Component {
  render() {
    return (
      <div>
        <Board />
        <Chat />
      </div>
    );
  }
}

export default App;


