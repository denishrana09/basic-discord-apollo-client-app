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
  }

  handleChannelClick(channelId) {
    this.props.handleChannelClick(channelId);
  }

  render() {
    return (
      <Query query={GET_CHANNELS_QUERY} >
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          return (
            <Channels channelId={this.props.channelId} handleChannelClick={this.handleChannelClick} data={data} />
          )
        }}
      </Query>
    );
  }
}

export default ChannelView;