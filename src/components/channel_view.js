import React, { Component } from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Channels from './channels';

const GET_CHANNELS_QUERY = gql`
  query{
    channels {
      id,
      name
    }
  }
`

class ChannelView extends Component {
  constructor(props) {
    super(props);
    this.handleChannelClick = this.handleChannelClick.bind(this);
    this.removeChannelId = this.removeChannelId.bind(this);
  }

  removeChannelId(channelId){
    this.props.removeChannelId(channelId);
  }

  handleChannelClick(channelId) {
    this.props.handleChannelClick(channelId);
  }

  //eg: arr = ["1","1","2","1"]
  //      a = ["1","2"]
  //      b = ["3","1"]
  countItemsOfArray(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
  }

  render() {
    let channelId = this.props.channelId;
    let notifyChannel = this.props.notifyChannel;
    let m = this.countItemsOfArray(notifyChannel);
    return (
      <Query query={GET_CHANNELS_QUERY} >
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          return (
            <Channels
              channelId={channelId}
              mainArray={m}
              removeChannelId={this.removeChannelId}
              handleChannelClick={this.handleChannelClick}
              data={data}
            />
          )
        }}
      </Query>
    );
  }
}

export default ChannelView;