import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import AttentionComparisonContainer from './AttentionComparisonContainer';
import StorySamplePreview from './StorySamplePreview';
import StoryCountPreview from './StoryCountPreview';
// import { hasPermissions, getUserRoles, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';

const localMessages = {
  queryResultsTitle: { id: 'explorer.details.title', defaultMessage: 'Query Results' },
};

const QueryResultsContainer = (props) => {
  const { queries, user, params, samples } = props;
  // const filename = `AttentionComparisonContainer-query-results`;

  return (
    <div>
      <h2>
        <FormattedMessage {...localMessages.queryResultsTitle} />
      </h2>
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
      </Row>
    </div>
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
});

export default
  injectIntl(
    connect(mapStateToProps)(
      QueryResultsContainer
    )
  );
