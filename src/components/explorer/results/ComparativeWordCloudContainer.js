import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchExplorerTopWords } from '../../../actions/topicActions';
import { generateParamStr } from '../../../lib/apiUtil';
import { queryPropertyHasChanged } from '../../../lib/explorerUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import ComparativeOrderedWordCloud from '../../vis/ComparativeOrderedWordCloud';

const localMessages = {
  title: { id: 'explorer.comparativeWords.title', defaultMessage: 'Comparative Words' },
  intro: { id: 'explorer.comparativeWords.intro', defaultMessage: ' These words are the most used in each query. They are sized according to total count across all words in ...' },
};

class ComparativeWordCloudContainer extends React.Component {
  state = {
    leftQuery: [],
    rightQuery: [],
  };
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      return (
        ((labelsHaveChanged || colorsHaveChanged))
         || (results !== nextProps.results)
      );
    }
    return false; // if both results and queries are empty, don't update
  }
  downloadCsv = (query) => {
    let url = null;
    if (parseInt(query.searchId, 10) >= 0) {
      url = `/api/explorer/sentences/count.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/sentences/count.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }
  selectThisQuery = (targetIndex) => {
    // get value and which menu (left or right) and then run comparison
    // get query out of queries at queries[targetIndex] and pass "q" to fetch
    // store choice of selectField
    this.setState({ leftQuery: targetIndex, rightQuery: targetIndex });
  }

  render() {
    const { queries, compareQueries, handleWordCloudClick } = this.props;
    const menuItems = queries.map((q, idx) =>
      <MenuItem value={idx} primaryText={q.label} onTouchTap={() => this.selectThisQuery(idx)} />
    );
    return (
      <Grid>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectField>
              {menuItems}
            </SelectField>
          </Col>
          <Col>
            <SelectField>
              {menuItems}
            </SelectField>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <DataCard>
              <ComparativeOrderedWordCloud
                leftWords={compareQueries[0]}
                rightWords={compareQueries[1]}
                textColor={getBrandDarkColor()}
                onWordClick={handleWordCloudClick}
              />
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }

}

ComparativeWordCloudContainer.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  compareQueries: React.PropTypes.array.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  fetchStatus: state.explorer.comparativeWordCount.fetchStatus,
  results: state.explorer.comparativeWordCount.results,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchExplorerTopWords(props.compareQueries));
  },
  goToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${stateProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.goToUrl(url);
    },
    asyncFetch: () => {
      dispatchProps.fetchData({
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        ComparativeWordCloudContainer
      )
    )
  );
