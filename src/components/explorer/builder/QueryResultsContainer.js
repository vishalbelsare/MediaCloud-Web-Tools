import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import AttentionComparisonContainer from './AttentionComparisonContainer';
// import { hasPermissions, getUserRoles, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';

const localMessages = {
  queryResultsTitle: { id: 'explorer.details.title', defaultMessage: 'Query Results' },
};

const QueryResultsContainer = (props) => {
  const { queries } = props;
  // const filename = `AttentionComparisonContainer-query-results`;

  return (
    <div>
      <h2>
        <FormattedMessage {...localMessages.queryResultsTitle} />
      </h2>
      <Row>
        <Col lg={6} xs={12}>
          <AttentionComparisonContainer queries={queries} />
        </Col>
      </Row>
    </div>
  );
};

QueryResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object,
  // from context
  params: React.PropTypes.object,       // params from router
  // from state
  queries: React.PropTypes.array,
  user: React.PropTypes.object,
};

const mapStateToProps = state => ({
  queries: state.explorer.queries.list,
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      QueryResultsContainer
    )
  );
