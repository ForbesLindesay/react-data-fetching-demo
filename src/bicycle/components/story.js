import React, {Component} from 'react';
import request from 'then-request';
import {connect} from 'react-bicycle';

class Story extends Component {
  render() {
    return (
      <article>
        <span className="vote-count">
          {this.props.story.votes}
        </span>
        <div className="story-body">{this.props.story.body}</div>
        <button type="button" onClick={this.props.onVote}>Vote</button>
      </article>
    );
  }
}

const StoryContainer = connect(
  undefined,
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
