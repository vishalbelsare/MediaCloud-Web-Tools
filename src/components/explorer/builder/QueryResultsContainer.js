import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AttentionComparisonContainer from './AttentionComparisonContainer';
import StorySamplePreview from './StorySamplePreview';
import StoryCountPreview from './StoryCountPreview';
import GeoPreview from './GeoPreview';

const QueryResultsContainer = (props) => {
  const { queries, user, params, samples } = props;
  return (
    <Grid>
      <Row>
        <Col lg={12} xs={12}>
          <AttentionComparisonContainer queries={queries} user={user} params={params} sampleSearches={samples} />
        </Col>
        <Col lg={12} xs={12}>
          <StorySamplePreview queries={queries} user={user} params={params} sampleSearches={samples} />
        </Col>
        <Col lg={12} xs={12}>
          <StoryCountPreview queries={queries} user={user} params={params} sampleSearches={samples} />
        </Col>
        <Col lg={12} xs={12}>
          <GeoPreview queries={queries} user={user} params={params} sampleSearches={samples} />
        </Col>
      </Row>
    </Grid>
  );
};

QueryResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object,
  queries: React.PropTypes.array,
  // from context
  params: React.PropTypes.object,       // params from router
  // from state
  lastSearchTime: React.PropTypes.object,
  samples: React.PropTypes.array,
  user: React.PropTypes.object,
};

const mapStateToProps = state => ({
  // lastSearchTime: state.explorer.queries.list,
  user: state.user,
  queries: state.explorer.queries,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      QueryResultsContainer
    )
  );
