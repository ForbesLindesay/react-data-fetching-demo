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
      <article style={{marginBottom: 20}}>
        <span style={{
          background: 'black', color: 'white', borderRadius: 4,
          height: 20, width: 40, display: 'inline-block',
          textAlign: 'center',
          padding: 4,
        }}>
          {this.props.data.votes}
        </span>
        {this.props.data.body}
        <button type="button" onClick={this._onVote}>Vote</button>
      </article>
    );
  }
}

export default withData(
  props => '/api/stories/' + props.id,
  Story,
);
