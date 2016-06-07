import React, {Component} from 'react';
import request from 'then-request';
import {subscribe} from '../data-store';
import Spinner from './spinner';

function equal(a, b) {
  return a === b;
}
function withData(getQuery, Component) {
  return class DataFetching extends Component {
    constructor() {
      super();
      this.state = {loading: true, data: null};
    }
    subscribe(props) {
      this._unsubscribe = subscribe(
        getQuery(props),
        (loading, data) => this.setState({loading, data}),
      );
    }
    componentDidMount() {
      this.subscribe(this.props);
    }
    componentWillReceiveProps(newProps) {
      if (!equal(getQuery(this.props), getQuery(newProps))) {
        this._unsubscribe();
        this.subscribe();
      }
    }
    componentWillUnmount() {
      this._unsubscribe();
    }
    render() {
      if (this.state.loading) return <Spinner />;
      return <Component {...this.props} data={this.state.data} />;
    }
  }
}

export default withData;
