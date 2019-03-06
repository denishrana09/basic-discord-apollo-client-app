import React, { Component } from 'react';
import '../channels.css';

class Channels extends Component {
  constructor(props) {
    super(props);
    this.handleChannelClick = this.handleChannelClick.bind(this);
    this.removeChannelId = this.removeChannelId.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.mainArray !== this.props.mainArray){
      this.handleChannelIdRemove();
    }
  }

  handleChannelClick(channelId){
    this.props.handleChannelClick(channelId);
  }

  removeChannelId(channelId){
    this.props.removeChannelId(channelId);
  }

  handleChannelIdRemove(){
    let mainArray = this.props.mainArray;
    const channelId = this.props.channelId;

    let idArray = mainArray[0];

    if(idArray.includes(channelId)){
      this.removeChannelId(channelId);
    }
  }

  render() {
    let data = this.props.data;
    let mainArray = this.props.mainArray;
    const channelId = this.props.channelId;

    let idArray = mainArray[0];
    let counterArray = mainArray[1];

    return (
      <div className="channel-list">
        <h3>Channels</h3>
        {data.channels.map(channel => (
          <div key={channel.id} className="channel">
            <button
              className={channel.id===channelId ? 'channel-button active-channel': 'channel-button'}
              onClick={() => {this.handleChannelClick(channel.id)}}>
              {channel.name}
              <span
                className={
                  (counterArray[idArray.indexOf(channel.id)]!==undefined)
                  ? "notify"
                  : "hide"
                }
              >
                {counterArray[idArray.indexOf(channel.id)]}
              </span>
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default Channels;