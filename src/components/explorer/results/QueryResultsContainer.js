import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import QueryAttentionOverTimeResultsContainer from './QueryAttentionOverTimeResultsContainer';
import QueryWordComparisonResultsContainer from './QueryWordComparisonResultsContainer';
import QuerySampleStoriesResultsContainer from './QuerySampleStoriesResultsContainer';
import QueryTotalAttentionResultsContainer from './QueryTotalAttentionResultsContainer';
import QueryGeoResultsContainer from './QueryGeoResultsContainer';

const QueryResultsContainer = (props) => {
  const { queries, isLoggedIn, lastSearchTime, onSearch } = props;
  // const unDeletedQueries = queries.filter(q => q.deleted !== true);
  return (
    <Grid>
      <Row>
        <Col lg={12} xs={12}>
          <QueryAttentionOverTimeResultsContainer
            lastSearchTime={lastSearchTime}
            queries={queries}
            isLoggedIn={isLoggedIn}
          />
        </Col>
        <Col lg={12} xs={12}>
          <QueryWordComparisonResultsContainer
            lastSearchTime={lastSearchTime}
            queries={queries}
            isLoggedIn={isLoggedIn}
            onSearch={() => onSearch()}
          />
        </Col>
        <Col lg={12} xs={12}>
          <QuerySampleStoriesResultsContainer
            lastSearchTime={lastSearchTime}
            queries={queries}
            isLoggedIn={isLoggedIn}
          />
        </Col>
        <Col lg={12} xs={12}>
          <QueryTotalAttentionResultsContainer
            lastSearchTime={lastSearchTime}
            queries={queries}
            isLoggedIn={isLoggedIn}
          />
        </Col>
        <Col lg={12} xs={12}>
          <QueryGeoResultsContainer
            lastSearchTime={lastSearchTime}
            queries={queries}
            isLoggedIn={isLoggedIn}
          />
        </Col>
      </Row>
    </Grid>
  );
};

QueryResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from context
  // from state
  isLoggedIn: PropTypes.bool.isRequired,
  queries: PropTypes.array,
  lastSearchTime: PropTypes.number,
  onSearch: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  queries: state.explorer.queries.queries,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      QueryResultsContainer
    )
  );
