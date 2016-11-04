import React, { Component } from 'react';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      connectedList: []
    };
    this.handleMessageSubmission = this.handleMessageSubmission.bind(this)
  }

  handleMessageSubmission(event) {
    let {socket} = this.props;
    let {messages} = this.state;
    let {chatWindow} = this.refs;
    if (event.key == 'Enter') {
      event.preventDefault()
      let message = {
        color: this.props.color,
        value: event.target.value
      }
      messages.push(message)
      this.setState({ messages })
      socket.emit('chat_message', JSON.stringify(message))
      event.target.value = ''
      setTimeout(()=> chatWindow.scrollTop = chatWindow.scrollHeight , 50)
    }
  }

  componentWillReceiveProps() {
    let {messages, connectedList, readyToPlay} = this.state;
    let {connected} = this.props;
    connectedList.push(connected[connected.length - 1])
    this.setState({connectedList})
  }

  componentDidMount() {
    let {socket} = this.props;
    let {messages} = this.state;
    let {chatWindow} = this.refs;
    socket.on('chat_message', (val)=> {
      let message = JSON.parse(val)
      messages.push(message)
      this.setState({ messages })
      chatWindow.scrollTop = chatWindow.scrollHeight;
    })

    socket.on('disconnected', (val)=> {
      messages.push({
        color: this.props.color == 'blue' ? 'red' : 'blue',
        value: 'I left the game.'
      })
      this.setState({ messages })
    })

    socket.on('ready_to_play', ()=> {
      messages.push({
        color: this.props.color == 'blue' ? 'red' : 'blue',
        value: 'I\'m connected and ready to play!'
      })
      this.setState({ messages })
    })
  }

  render() {
    var {messages, connectedList, readyToPlay} = this.state;
    var {gameState, color} = this.props;
    return (
      <div className="chat">
        <div className="chat__window" ref="chatWindow">
          {color == 'blue' ? <div className="chat__message chat__message--blue">you are blue player</div> : <div className="chat__message chat__message--red">you are red player</div>}
          {messages.map((message, i) => <div key={i} className={`chat__message chat__message--${message.color}`}>{message.value}</div>)}
        </div>
        <textarea ref="message" className="chat__textarea" placeholder="Hit return to send" onKeyPress={this.handleMessageSubmission}>
          
        </textarea>
      </div>
    );
  }
}

export default Chat;


