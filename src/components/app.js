import React, { Component } from 'react';
import ChannelView from './channel_view';
import MessageView from './message_view';
import '../App.css';

class App extends Component {
  constructor(props) {
    super(props);
    // "notifyChannel": when new messages comes in any channel, that channelId will added here(multiple occurence)
    this.state = { channelId : "1", notifyChannel: [] }
    this.handleChannelClick = this.handleChannelClick.bind(this);
    this.handleNotifyChannel = this.handleNotifyChannel.bind(this);
    this.removeChannelId = this.removeChannelId.bind(this);
  }

  handleChannelClick(channelId){
    this.setState({ channelId })
  }

  // if current channel is the same which having new messages, then remove it from "notifyChannel"
  removeChannelId(channelId){
    let array = this.state.notifyChannel;
    for (var i = array.length - 0; i >= 0; i--) {
      if (array[i] === channelId) {
        array.splice(i, 1);
      }
    }
    this.setState({ notifyChannel: array });
  }

  // whenever newMessage comes in any channel, it's channelId will be added in "notifyChannel"
  handleNotifyChannel(channelId){
    const arr = this.state.notifyChannel;
    arr.push(channelId);
    this.setState({ notifyChannel: arr });
  }

  render() {
    const { channelId, notifyChannel } = this.state;
    return (
      <div className="App container">
        <div className="row">
          <div className="col-md-3 col-12">
            <ChannelView
              channelId={channelId}
              handleChannelClick={this.handleChannelClick}
              notifyChannel={notifyChannel}
              removeChannelId={this.removeChannelId}
            />
          </div>
          <div className="col-md-7 col-12">
            <MessageView
              channelId={channelId}
              handleNotifyChannel={this.handleNotifyChannel}
              // quick fix, make function which will give total count(also thing for if IDs are different, unlike here sequentially)
              totalChannels={2}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
