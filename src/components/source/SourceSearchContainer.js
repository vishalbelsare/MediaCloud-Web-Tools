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
    const { sourceSearchString, fetchStatus, fetchData } = this.props;
    // this.state = sourceSearchString;
  }
  getStyles() {
    const styles = {
      root: {
      },
      contentWrapper: {
        padding: 10,
      },
      list: {
        ul: {
          li: {
            listStyleType: 'none',
          },
        },
      },
    };
    return styles;
  }
  handleSearch(handle) {
    const { dispatchSearch } = this.props;
    if (handle !== null && handle !== undefined) {
      this.setState({ value: handle.value });
      dispatchSearch(handle.value);
    }
  }
  render() {
    const { fetchStatus, fetchData, dispatchSearch } = this.props;
    let { sourceSearchString } = this.props;
    let content = [];
    const styles = this.getStyles();
    const handleSearch = this.handleSearch();
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
    let currentValue = this.state !== null && this.state !== undefined ? this.state.value : '';
    return (
      <Grid style={ styles.root }>
      <Row style= { styles.list }>
      <Multiselect style= { styles.list }
        textField = 'name'
        valueField = 'media_id'
        defaultValue= { sourceSearchString }
        data = { sources }
        onChange = { value => this.setState({ value }) }
        onSearch = { value => this.handleSearch({ value }) }/>
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
  fetchData: (e) => {
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
