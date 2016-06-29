import React from 'react';
import ErrorTryAgain from './ErrorTryAgain';
import LoadingSpinner from './LoadingSpinner';
import * as fetchConstants from '../../lib/fetchConstants.js';

/**
 * Use this with the JS Composition pattern to make a Container do an async fetch for you.
 * The container MUST expose a `asyncFetch` method that takes no arguments. Most likely that
 * method will call out to a fetchData property that reads the params to use from the state
 * (via mergeProps).
 */
export default function composeAsyncWidget(Component) {
  class ComposedAsyncWidget extends React.Component {
    componentDidMount() {
      const { asyncFetch } = this.props;
      asyncFetch();
    }
    render() {
      const { fetchStatus, asyncFetch } = this.props;
      let content = fetchStatus;
      switch (fetchStatus) {
        case fetchConstants.FETCH_SUCCEEDED:
          content = <Component {...this.props} />;
          break;
        case fetchConstants.FETCH_FAILED:
          content = <ErrorTryAgain onTryAgain={asyncFetch} />;
          break;
        default:
          content = <LoadingSpinner />;
      }
      return content;
    }
  }
  ComposedAsyncWidget.propTypes = {
    fetchStatus: React.PropTypes.string.isRequired,
    asyncFetch: React.PropTypes.func.isRequired,
  };
  return ComposedAsyncWidget;
}
