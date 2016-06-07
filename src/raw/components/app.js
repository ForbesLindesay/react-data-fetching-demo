import React, {Component} from 'react';
import request from 'then-request';
import Story from './story';
import Spinner from './spinner';

class App extends Component {
  constructor() {
    super();
    this.state = {loading: true, stories: null, body: ''};
    this._onUpdateOrder = this._onUpdateOrder.bind(this);
    this._onChangeBody = this._onChangeBody.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }
  componentDidMount() {
    this._onUpdateOrder();
  }
  _onUpdateOrder() {
    request('get', '/api/stories').getBody('utf8').then(JSON.parse).done(
      stories => this.setState({loading: false, stories})
    );
  }
  _onChangeBody(e) {
    this.setState({body: e.target.value});
  }
  _onSubmit(e) {
    e.preventDefault();
    request('put', '/api/stories', {
      json: {body: this.state.body},
    }).getBody('utf8').done(
      () => this._onUpdateOrder()
    );
  }
  render() {
    if (this.state.loading) return <Spinner />;
    return (
      <div>
        {this.state.stories.map(id => (
          <Story key={id} id={id} onUpdateOrder={this._onUpdateOrder}/>
        ))}
        <form onSubmit={this._onSubmit}>
          <input onChange={this._onChangeBody} value={this.state.body} />
          <button type="submit">Add Story</button>
        </form>
      </div>
    );
  }
}

export default App;
