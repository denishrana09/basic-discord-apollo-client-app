import React, { Component } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../messages.css'

class Messages extends Component {
  render() {
    const data = this.props.data;
    const channelId = this.props.channelId;
    // console.log('8 ', data);
    const dataToShow = data[channelId-1];
    // console.log('11 ', dataToShow);
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