import React, { Component } from 'react';
import Board from './components/Board';
import Chat from './components/Chat';
import Clipboard from 'clipboard/dist/clipboard';
import io from './libs/socket.io.js';
var socket = io(window.location.pathname);

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
   		connected: [],
   		gameState: 'pre_start',
   		activePlayer: 'blue',
   		color: ' '
    };
    this.toggleActivePlayer = this.toggleActivePlayer.bind(this)
  }

  toggleActivePlayer() {
    let {activePlayer} = this.state
    this.setState({activePlayer: activePlayer == 'blue' ? 'red' : 'blue'})
    socket.emit('set_active_player', activePlayer == 'blue' ? 'red' : 'blue')
  }
  
  componentDidMount() {
  	var {connected} = this.state;
    socket.on('connected', (client) => {
    	this.setState({
    		connected,
    		gameState: 'game_started',
    		color: client == 0 ? 'blue' : 'red'
    	})
    })

    socket.on('set_active_player', (activePlayer)=> {
    	this.setState({activePlayer: activePlayer})
    })
  }
  
  render() {
  	var {connected, gameState, color, activePlayer} = this.state;
    return (
      <div>
	      <div className="container">
	        <h1 className="headline">Connect 4</h1>
	        <div className="col col--left">
	        	<Board 
	        		socket={socket}
	        		color={color}
	        		disabled={activePlayer != color}
	        		connected={connected}
	        		toggleActivePlayer={this.toggleActivePlayer}
	        		activePlayer={this.state.activePlayer} />
	      	</div>
	        <div className="col col--right">
	          <span className="col__title">Send this link to someone:</span>
	          <input ref="url" className="col__url" type="text" defaultValue={window.location.origin + window.location.pathname} />
	          <Chat 
	          	socket={socket}
	          	gameState={gameState}
	          	connected={connected}
	          	color={color} />
	        </div>
	      </div>
      </div>
    );
  }
}

export default App;


