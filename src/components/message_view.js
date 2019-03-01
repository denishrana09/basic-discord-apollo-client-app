import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose, withApollo } from "react-apollo";
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
  constructor(props) {
    super(props);
    this.state = { data: '' }
  }

  componentDidMount() {
    this.fetchData();

    this.props.data.subscribeToMore({
      document: NEW_MESSAGES_SUBSCRIPTION,
      variables: { id: this.props.channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newMessage = subscriptionData.data.messageAdded;
        let i = 0;
        let exists = false;
        for (i = 0; i < prev.channel.messages.length; i = i + 1) {
          exists = prev.channel.messages[i].id === newMessage.id;
          if (exists) {
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
    });
  }

  async fetchData(){
    const { client } = this.props;
    const result = await client.query({
      query: GET_MESSAGES_QUERY,
      variables: { id: this.props.channelId }
    });
    this.setState({ data: result.data });
    console.log('73 ', this.state.data);
  }

  componentDidUpdate(prev) {
    // whenever we changes channel, it checks if "current opended channed" === "prev opened channel"
    if(this.props.channelId !== prev.channelId){
      // then again call componentDidMount which will again call query to get that particular channel's data
      this.componentDidMount();
    }
  }

  render() {
    const channelId = this.props.channelId;
    const { data } = this.state;
    return (
      <React.Fragment>
        {/* pass "data" as prop only when it's available, o/w get error */}
        {data && <Messages data={data} />}
        <MessageUploader channelId={channelId} />
      </React.Fragment>
    );
  }
}

// "withApollo" will give you "client" object
export default compose(graphql(GET_MESSAGES_QUERY, { options: (props) => ({ variables: { id: props.channelId } }) }),withApollo)(MessageView);