import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Messages from './messages';
import MessageUploader from './message_uploader';

const GET_MESSAGES_QUERY = gql`
  query GetMessagesQuery($id: ID!){
    channel(id: $id) {
      id,
      name,
      messages{
        id,
        text
      }
    }
  }
`
const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    messageAdded(channelId: $id) {
      id
      text
    }
  }
`

class MessageView extends Component {
  _subscribeToNewMessages = (subscribeToMore, channelId) => {
    subscribeToMore({
      document: NEW_MESSAGES_SUBSCRIPTION,
      variables: { id: channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newMessage = subscriptionData.data.messageAdded;
        let i=0;
        let exists = false;
        for(i=0; i< prev.channel.messages.length; i=i+1){
          exists = prev.channel.messages[i].id === newMessage.id;
          if(exists){
            break;
          }
        }
        if (exists) return prev;

        return Object.assign({}, prev, {
          channel: {
            id: prev.channel.id,
            name: prev.channel.name,
            messages: [...prev.channel.messages, newMessage],
            __typename: prev.channel.__typename
          }
        })
      }
    })
  }
  render() {
    const channelId = this.props.channelId;
    return (
      <React.Fragment>
        <Query query={GET_MESSAGES_QUERY} variables={{ id: channelId }} >
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div>

            this._subscribeToNewMessages(subscribeToMore, channelId);

            return (
              <React.Fragment>
                <Messages data={data} />
              </React.Fragment>
            )
          }}
        </Query>
        <MessageUploader channelId={channelId} />
      </React.Fragment>
    );
  }
}

export default MessageView;