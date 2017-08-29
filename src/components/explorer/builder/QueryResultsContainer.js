import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AttentionComparisonContainer from './AttentionComparisonContainer';
import StorySamplePreview from './StorySamplePreview';
import StoryCountPreview from './StoryCountPreview';
import GeoPreview from './GeoPreview';

const QueryResultsContainer = (props) => {
  const { queries, user, params } = props;
  const unDeletedQueries = queries.filter(q => !q.deleted);
  return (
    <Grid>
      <Row>
        <Col lg={12} xs={12}>
          <AttentionComparisonContainer queries={unDeletedQueries} user={user} params={params} />
        </Col>
        <Col lg={12} xs={12}>
          <StorySamplePreview queries={unDeletedQueries} user={user} params={params} />
        </Col>
        <Col lg={12} xs={12}>
          <StoryCountPreview queries={unDeletedQueries} user={user} params={params} />
        </Col>
        <Col lg={12} xs={12}>
          <GeoPreview queries={unDeletedQueries} user={user} params={params} />
        </Col>
      </Row>
    </Grid>
  );
};

QueryResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object,       // params from router
  // from state
  user: React.PropTypes.object,
  queries: React.PropTypes.array,
};

const mapStateToProps = state => ({
  user: state.user,
  queries: state.explorer.queries.queries,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      QueryResultsContainer
    )
  );
