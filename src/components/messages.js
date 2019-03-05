import React, { Component } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../messages.css'

class Messages extends Component {
  render() {
    const data = this.props.data;
    // "data" contains all the channels messages
    const channelId = this.props.channelId;
    // we will show user only those data with respected channel
    const dataToShow = data[channelId-1];
    return (
      <ScrollToBottom className="messages-wrp container">
        {dataToShow && dataToShow.messages.map(message => (
          <div key={message.id} className="message-list">
            <span className="message">{message.text}</span>
          </div>
        ))}
      </ScrollToBottom>
    );
  }
}

export default Messages;