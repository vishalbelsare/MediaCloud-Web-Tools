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
import { updateQuery } from '../../../actions/explorerActions';

const QueryResultsContainer = (props) => {
  const { queries, isLoggedIn, lastSearchTime, handleQueryModificationRequested } = props;
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
            onQueryModificationRequested={handleQueryModificationRequested}
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
            onQueryModificationRequested={handleQueryModificationRequested}
          />
        </Col>
      </Row>
    </Grid>
  );
};

QueryResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from context
  // from parent
  queries: PropTypes.array,
  lastSearchTime: PropTypes.number,
  // from state
  isLoggedIn: PropTypes.bool.isRequired,
  // from dipatch
  handleQueryModificationRequested: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // call this to add a clause to every query when something is clicked on
  handleQueryModificationRequested: (queryClauseToAdd) => {
    ownProps.queries.map((qry) => {
      const updatedQry = {
        ...qry,
        q: `(${qry.q}) AND (${queryClauseToAdd})`,
      };
      return dispatch(updateQuery({ query: updatedQry, fieldName: 'q' }));
    });
    ownProps.onSearch();
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryResultsContainer
    )
  );
