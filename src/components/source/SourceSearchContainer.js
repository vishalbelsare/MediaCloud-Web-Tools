import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

/*import { Combobox } from 'react-widgets';
import ErrorTryAgain from '../common/ErrorTryAgain';
import LoadingSpinner from '../common/LoadingSpinner';
import SourceSearchResult from './SourceSearchResult';
import { fetchSourceSearch,fetchSourceDetails } from '../../actions/sourceActions';
import * as fetchConstants from '../../lib/fetchConstants.js';
import Link from 'react-router/lib/Link';

import { Button } from 'react-bootstrap';



import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'source.title.query', defaultMessage: 'Search by Keywords' },
};


let ComboboxListItem = React.createClass({
  render() {
    const selectedSource = this.props.item;
    const listStyles = {
      listStyleType: 'none',
    };
    return (
      <Row style={listStyles}>
        <Link key={selectedSource.media_id} style={listStyles} to={`source/${selectedSource.media_id}/details`} > {selectedSource.name} </Link>
      </Row>
    );
  },
});

class SourceSearchContainer extends React.Component {
  componentDidMount() {
    const { sourceSearchString, fetchStatus, fetchData } = this.props;
    // this.state = sourceSearchString;
  }
  getStyles() {
    const styles = {
      bsStyle: {
        opacity: 0,
      },
      root: {
        border: '1px solid lightgray',
        boxShadow: '2px 2px 4px 4px #cccccc',
        margin: 10,
        marginTop: 0,
        marginLeft: 0,
        listStyleType: 'none',
      },
      contentWrapper: {
        padding: 10,
      },
      input: {
        width: 300,
      },
      comboBoxListItem: {
        listStyleType: 'none',
      },
      list: {
        rwSelect: {
          clear: 'both',
        },
        margin: 10,
        padding: 10,
        paddingTop: 0,
        width: 300,
        listStyleType: 'none',
        ul: {
          listStyleType: 'none',
        },
        ulRwList: {
          listStyleType: 'none',
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
  gotoDetailPage(handle) {
    const { dispatchGoToDetailPage } = this.props;
    if (handle !== null && handle !== undefined) {
      this.setState({ value: handle.value });
      dispatchGoToDetailPage(handle.value);
    }
  }
  render() {
    const { fetchStatus, fetchData, dispatchSearch } = this.props;
    let { sourceSearchString } = this.props;
    let content = [];
    let linkContent = [];
    const styles = this.getStyles();
    const handleSearch = this.handleSearch();
    if (this.state) {
      sourceSearchString = this.state.value;
    }
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { sources } = this.props;   
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
      <Row >
      <Combobox style= { styles.list }
        textField = 'name'
        valueField = 'media_id'
        style = {styles.list}
        bsStyle = {styles.list}
        defaultValue= { sourceSearchString }
        data = { sources }
        onChange = { value => this.handleSearch({ value }) }
        onSelect = { value => this.gotoDetailPage({ value }) }
        itemComponent = { ComboboxListItem }
      />
      </Row>
      <Row style={ styles.list }> { content } </Row>
      </Grid>
    );
  }
}

SourceSearchContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  sources: React.PropTypes.array,
  sourceSearchString: React.PropTypes.string,
  dispatchGoToDetailPage: React.PropTypes.func,
  dispatchSearch: React.PropTypes.func,
  gotoPage: React.PropTypes.string,
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
  dispatchGoToDetailPage: (event) => {
    dispatch(fetchSourceDetails(event.media_id));
  },
  dispatchSearch: (event) => {
    dispatch(fetchSourceSearch(event));
  },
});


export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceSearchContainer));
*/