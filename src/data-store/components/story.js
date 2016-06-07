import React, {Component} from 'react';
import request from 'then-request';
import {voteStory} from '../data-store';
import withData from './with-data';

class Story extends Component {
  constructor() {
    super();
    this._onVote = this._onVote.bind(this);
  }
  _onVote() {
    voteStory(this.props.id);
  }
  render() {
    return (
      <article>
        <span className="vote-count">
          {this.props.data.votes}
        </span>
        <div className="story-body">{this.props.data.body}</div>
        <button type="button" onClick={this._onVote}>Vote</button>
      </article>
    );
  }
}

export default withData(
  props => '/api/stories/' + props.id,
  Story,
);
