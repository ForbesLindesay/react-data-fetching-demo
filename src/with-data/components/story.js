import React, {Component} from 'react';
import request from 'then-request';
import withData from './with-data';

class Story extends Component {
  constructor() {
    super();
    this._onVote = this._onVote.bind(this);
  }
  _onVote() {
    request('post', '/api/stories/' + this.props.id + '/vote')
    .getBody('utf8').then(JSON.parse).done(
      story => this.props.onUpdate()
    );
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
