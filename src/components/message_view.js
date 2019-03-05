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
    this.state = {
      data:
        {
          channels: []
        }
    }
  }

  subscriptionThing(){
    this.props.data.subscribeToMore({
      document: NEW_MESSAGES_SUBSCRIPTION,
      variables: { id: this.props.channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const channelId = this.props.channelId;

        // console.log('48 ', channelId);
        const newMessage = subscriptionData.data.messageAdded;

        console.log('50 ', newMessage);
        // console.log('51 ', prev.channels);

        let i = 0;
        let exists = false;
        for (i = 0; i < prev.channels[newMessage.channelId-1].messages.length; i = i + 1) {
          exists = prev.channels[newMessage.channelId-1].messages[i].id === newMessage.id;
          if (exists) {
            break;
          }
        }
        if (exists) return prev;

        // let latestData = Object.assign({}, prev, {
        //   channels: {
        //     id: prev.channels[channelId-1].id,
        //     name: prev.channels[channelId-1].name,
        //     channelId,
        //     messages: [...prev.channels[channelId-1].messages, newMessage],
        //     __typename: prev.channels[channelId-1].__typename
        //   }
        // })

        this.state.data.channels && this.state.data.channels[newMessage.channelId-1].messages.push(newMessage);
        // this.state.data.channels && this.state.data.channels[this.props.channelId-1].messages.push(newMessage);


        console.log('73 ', this.state.data.channels);


        // console.log('69 ', latestData);
        // this.setState({ data: latestData });

        return this.state.data;
        // if (newMessage.channelId === prev.channel.id)
        //   this.setState({ data: latestData });
      }
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData(){
    const { client } = this.props;
    const result = await client.query({
      query: GET_MESSAGES_QUERY
    });
    // console.log('82 ', result.data.channels);
    this.setState({ data: { channels : result.data.channels } });
    // this.state.data.channels.push(result.data.channels);
    // console.log('84 ', this.state.data);
  }

  render() {
    this.subscriptionThing();
    const channelId = this.props.channelId;
    const { data } = this.state;
    return (
      <React.Fragment>
        {/* pass "data" as prop only when it's available, o/w get error */}
        {data && <Messages data={data.channels} channelId={channelId} />}
        <MessageUploader channelId={channelId} />
      </React.Fragment>
    );
  }
}

// "withApollo" will give you "client" object
export default compose(graphql(GET_MESSAGES_QUERY, { options: (props) => ({ variables: { id: props.channelId } }) }), withApollo)(MessageView);