import React, { Component } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../messages.css'

class Messages extends Component {
  render() {
    const data = this.props.data;
    return (
      <ScrollToBottom className="messages-wrp container">
        {data.channel.messages.map(message => (
          <div key={message.id} className="message-list">
            <span className="message">{message.text}</span>
          </div>
        ))}
      </ScrollToBottom>
    );
  }
}

export default Messages;