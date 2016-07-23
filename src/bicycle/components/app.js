import React, {Component} from 'react';
import {connect} from 'react-bicycle';
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
    this.props.addStory(this.state.body);
    this.setState({body: ''});
  }
  render() {
    return (
      <div>
        {this.props.stories.map(story => (
          <Story key={story.id} story={story}/>
        ))}
        <form onSubmit={this._onSubmit}>
          <input onChange={this._onChangeBody} value={this.state.body} />
          <button type="submit">Add Story</button>
        </form>
      </div>
    );
  }
}

export default connect(
  props => ({stories: {id: true, ...Story.fields}}),
  (client, props) => ({
    addStory(body) {
      client.update('Story.create', {body});
    },
  }),
)(App);
