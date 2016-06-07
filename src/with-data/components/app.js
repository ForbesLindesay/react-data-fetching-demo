import React, {Component} from 'react';
import request from 'then-request';
import withData from './with-data';
import Story from './story';

class App extends Component {
  constructor() {
    super();
    this.state = {body: ''};
    this._onChangeBody = this._onChangeBody.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }
  _onChangeBody(e) {
    this.setState({body: e.target.value});
  }
  _onSubmit(e) {
    e.preventDefault();
    if (!this.state.body) return;
    request('put', '/api/stories', {
      json: {body: this.state.body},
    }).getBody('utf8').then(JSON.parse).done(
      () => this.props.onUpdate()
    );
    this.setState({body: ''});
  }
  render() {
    return (
      <div>
        {this.props.data.map(id => (
          <Story key={id} id={id} onUpdate={this.props.onUpdate}/>
        ))}
        <form onSubmit={this._onSubmit}>
          <input onChange={this._onChangeBody} value={this.state.body} />
          <button type="submit">Add Story</button>
        </form>
      </div>
    );
  }
}

export default withData(
  () => '/api/stories',
  App,
);
