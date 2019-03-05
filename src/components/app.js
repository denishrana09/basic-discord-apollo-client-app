import React, { Component } from 'react';
import ChannelView from './channel_view';
import MessageView from './message_view';
import '../App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { channelId : "1"}
    this.handleChannelClick = this.handleChannelClick.bind(this);
  }

  handleChannelClick(channelId){
    this.setState({ channelId })
  }

  render() {
    const { channelId } = this.state;
    return (
      <div className="App container">
        <div className="row">
          <div className="col-md-3">
            <ChannelView
              channelId={channelId}
              handleChannelClick={this.handleChannelClick}
            />
          </div>
          <div className="col-md-7">
            <MessageView channelId={channelId} totalChannels={2} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
