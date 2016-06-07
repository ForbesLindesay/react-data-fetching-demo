import React, {Component} from 'react';
import request from 'then-request';
import Spinner from './spinner';

class Story extends Component {
  constructor() {
    super();
    this.state = {loading: true, story: null};
    this._onVote = this._onVote.bind(this);
  }
  componentDidMount() {
    request('get', '/api/stories/' + this.props.id)
    .getBody('utf8').then(JSON.parse).done(
      story => this.setState({loading: false, story})
    );
  }
  _onVote() {
    // Optimistic update
    this.setState({
      story: {
        ...this.state.story,
        votes: this.state.story.votes + 1,
      }
    });
    // actual update
    request('post', '/api/stories/' + this.props.id + '/vote')
    .getBody('utf8').then(JSON.parse).done(
      result => {
        this.setState({loading: false, story: result.story})
        this.props.onUpdateOrder();
      }
    );
  }
  render() {
    if (this.state.loading) return <Spinner />;
    return (
      <article style={{marginBottom: 20}}>
        <span style={{
          background: 'black', color: 'white', borderRadius: 4,
          height: 20, width: 40, display: 'inline-block',
          textAlign: 'center',
          padding: 4,
        }}>
          {this.state.story.votes}
        </span>
        {this.state.story.body}
        <button type="button" onClick={this._onVote}>Vote</button>
      </article>
    );
  }
}

export default Story;
