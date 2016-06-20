import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Multiselect } from 'react-widgets';
import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import SourceSearchResult from './SourceSearchResult';
import { fetchSourceSearch } from '../../actions/sourceActions';
import * as fetchConstants from '../../lib/fetchConstants.js';

import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'source.title.query', defaultMessage: 'Search by Keywords' },
};

class SourceSearchContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, fetchData } = this.props;
    this.state = 'search for sources';
  }
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }

  render() {
    const { fetchStatus, fetchData, dispatchSearch } = this.props;
    let { sourceSearchString } = this.props;
    let content = [];
    if (this.state) {
      sourceSearchString = this.state.value;
    }
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
         const { sources } = this.props;
        // content = <SourceSearchResult sources={sources} />;
        // searchResults = { content };
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;

    }
    return (
      <Grid>
      <Row><Multiselect textField = 'name' data = { sources } onChange = { value => this.setState({ value }) } onSearch = { value => dispatchSearch(value) } />
      </Row>
      <Row> { content } </Row>
      </Grid>
    );
  }
}

SourceSearchContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  sources: React.PropTypes.array,
  sourceSearchString: React.PropTypes.string,
  dispatchSearch: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.sourceSearch.fetchStatus,
  sources: state.sources.sourceSearch.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => {
    if (this.state !== null) {
      dispatch(fetchSourceSearch(this.state));
    }
  },
  dispatchSearch: (event) => {
    dispatch(fetchSourceSearch(event));
  },
});


export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceSearchContainer));
