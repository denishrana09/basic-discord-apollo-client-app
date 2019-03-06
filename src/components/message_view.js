import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose, withApollo } from "react-apollo";
import Messages from './messages';
import MessageUploader from './message_uploader';

const GET_MESSAGES_QUERY = gql`
  query{
    channels {
      id,
      name,
      messages{
        id,
        text,
        channelId
      }
    }
  }
`
const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    messageAdded(channelId: $id) {
      id
      text
      channelId
    }
  }
`

class MessageView extends Component {
  constructor(props) {
    super(props);
    // make state based on return object of given Query
    this.state = {
      data:
        {
          channels: []
        }
    }
  }

  subscriptionThing(cId){
    this.props.data.subscribeToMore({
      document: NEW_MESSAGES_SUBSCRIPTION,
      variables: { id: cId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageAdded;
        if(this.props.channelId !== newMessage.channelId){
          this.props.handleNotifyChannel(newMessage.channelId);
        }
        let i = 0;
        let exists = false;
        for (i = 0; i < prev.channels[newMessage.channelId-1].messages.length; i = i + 1) {
          exists = prev.channels[newMessage.channelId-1].messages[i].id === newMessage.id;
          if (exists) {
            break;
          }
        }
        if (exists) return prev;

        this.state.data.channels && this.state.data.channels[newMessage.channelId-1].messages.push(newMessage);
        // this "return" of "subscribeToMore" will make sure that you see updated data instantly
        return this.state.data;
      }
    });
  }

  componentDidMount() {
    this.fetchData();

    let totalChannels = this.props.totalChannels;
    // start subscription for all the channels only for one time
    for(let i=0;i<totalChannels;i++)
      this.subscriptionThing(i+1);
  }

  async fetchData(){
    const { client } = this.props;
    const result = await client.query({
      query: GET_MESSAGES_QUERY
    });
    this.setState({ data: { channels : result.data.channels } });
  }

  render() {
    const channelId = this.props.channelId;
    const { data } = this.state;
    return (
      <React.Fragment>
        <h3 className="message-h3">Messages</h3>
        {/* pass "data" as prop only when it's available, o/w get error */}
        {data && <Messages data={data.channels} channelId={channelId} />}
        <MessageUploader channelId={channelId} />
      </React.Fragment>
    );
  }
}

// "withApollo" will give you "client" object
export default compose(graphql(GET_MESSAGES_QUERY, { options: (props) => ({ variables: { id: props.channelId } }) }), withApollo)(MessageView);