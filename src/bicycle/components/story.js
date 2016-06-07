import React, {Component} from 'react';
import request from 'then-request';
import {connect} from 'react-bicycle';

class Story extends Component {
  render() {
    return (
      <article style={{marginBottom: 20}}>
        <span style={{
          background: 'black', color: 'white', borderRadius: 4,
          height: 20, width: 40, display: 'inline-block',
          textAlign: 'center',
          padding: 4,
        }}>
          {this.props.story.votes}
        </span>
        {this.props.story.body}
        <button type="button" onClick={this.props.onVote}>Vote</button>
      </article>
    );
  }
}

const StoryContainer = connect(
  props => ({}),
  (client, props) => ({
    onVote() {
      client.update('Story.vote', {id: props.story.id});
    },
  }),
)(Story);

StoryContainer.fields = {
  id: true,
  votes: true,
  body: true,
};

export default StoryContainer;
