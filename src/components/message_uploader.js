import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const POST_MUTATION = gql`
  mutation PostMessageMutation($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
    }
  }
`

class MessageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = { messageText: '' }
    this.handleChange = this.handleChange.bind(this);
    this.uploadMessageNow = this.uploadMessageNow.bind(this);
  }

  handleChange(e) {
    this.setState({ messageText: e.target.value });
  }

  uploadMessageNow(message) {
    const messageInput = {
      channelId: this.props.channelId,
      text: this.state.messageText
    }
    message({
      variables: { message: messageInput }
    })
    this.setState({ messageText : '' });
  }

  uploadMessage(e, message) {
    if (e.key === 'Enter') {
      this.uploadMessageNow(message);
    }
  }

  render() {
    return (
      <div className="message-uploader row">
        <Mutation mutation={POST_MUTATION}>
          {message => (
            <React.Fragment>
              <input className="message-input col-md-9 col-12" type="text" onKeyPress={(e) => { this.uploadMessage(e, message) }}
                placeholder="write something..." onChange={this.handleChange} value={this.state.messageText} />
              <button onClick={() => { this.uploadMessageNow(message) }} className="col-md-3 submit-btn">
                Submit
              </button>
            </React.Fragment>
          )}
        </Mutation>
      </div>
      // #another way of Mutation
      /* <div className="message-uploader row">
        <input className="message-input col-md-10" type="text"
          placeholder="write something..." onChange={this.handleChange} value={this.state.messageText} />
        <Mutation mutation={POST_MUTATION} variables={{ message }}>
          {addMessage => (
            <button onClick={addMessage} className="col-md-2 submit-btn">
              Submit
          </button>
          )}
        </Mutation>
      </div> */
    );
  }
}

export default MessageUploader;