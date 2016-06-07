import React, {Component} from 'react';
import request from 'then-request';
import Spinner from './spinner';

function withData(getUrl, Component) {
  return class DataFetching extends Component {
    constructor() {
      super();
      this.state = {loading: true, data: null};
      this._onUpdate = this._onUpdate.bind(this);
    }
    componentDidMount() {
      this._onUpdate();
    }
    _onUpdate() {
      request('get', getUrl(this.props)).getBody('utf8').then(JSON.parse).then(
        data => {
          this.setState({loading: false, data});
          if (this.props.onUpdate) {
            this.props.onUpdate();
          }
        }
      );
    }
    render() {
      if (this.state.loading) return <Spinner />;
      return (
        <Component
          {...this.props}
          data={this.state.data}
          onUpdate={this._onUpdate}
        />
      );
    }
  }
}

export default withData;
