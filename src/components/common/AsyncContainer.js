import React from 'react';
import ErrorTryAgain from '../common/ErrorTryAgain';
import LoadingSpinner from '../common/LoadingSpinner';
import * as fetchConstants from '../../lib/fetchConstants';

// pass this in as the second arg to not show a spinner
export const NO_SPINNER = 0;

/**
 * Use this with the JS Composition pattern to make a Container do an async fetch for you.
 * The container MUST expose a `asyncFetch` method that takes no arguments. Most likely that
 * method will call out to a fetchData property that reads the params to use from the state
 * (via mergeProps).
 * Pass in a loadingSpinnerSize of 0 to not display it at all.
 */
export const asyncContainerize = (ComposedContainer, loadingSpinnerSize) => {
  const spinnerSize = (loadingSpinnerSize !== undefined) ? loadingSpinnerSize : null;
  class ComposedAsyncContainer extends React.Component {
    componentDidMount() {
      const { asyncFetch } = this.props;
      asyncFetch();
    }
    render() {
      const { fetchStatus, asyncFetch } = this.props;
      let content = null;
      switch (fetchStatus) {
        case fetchConstants.FETCH_SUCCEEDED:
          content = <ComposedContainer {...this.props} />;
          break;
        case fetchConstants.FETCH_FAILED:
          content = <ErrorTryAgain onTryAgain={asyncFetch} />;
          break;
        default:
          if (loadingSpinnerSize !== 0) {
            content = <LoadingSpinner size={spinnerSize} />;
          }
      }
      return content;
    }
  }
  ComposedAsyncContainer.propTypes = {
    fetchStatus: React.PropTypes.string.isRequired,
    asyncFetch: React.PropTypes.func.isRequired,
  };
  return ComposedAsyncContainer;
};

const composeAsyncContainer = asyncContainerize;  // the method can't be used as the name of the default import

export default composeAsyncContainer;

