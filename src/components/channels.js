import React, { Component } from 'react';
import '../channels.css';

class Channels extends Component {
  constructor(props) {
    super(props);
    this.handleChannelClick = this.handleChannelClick.bind(this);
  }

  handleChannelClick(channelId){
    this.props.handleChannelClick(channelId);
  }

  render() {
    let data = this.props.data;
    return (
      <div className="channel-list">
        {data.channels.map(channel => (
          <div key={channel.id} className="channel">
            <button className={channel.id===this.props.channelId ? 'channel-button active-channel': 'channel-button'} onClick={() => {this.handleChannelClick(channel.id)}}>
              {channel.name}
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default Channels;