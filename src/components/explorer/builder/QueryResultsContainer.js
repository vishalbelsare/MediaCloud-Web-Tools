import React from 'react';
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Row, Col } from 'react-flexbox-grid/lib';
import SourceList from '../../common/SourceList';
import AttentionComparisonContainer from './AttentionComparisonContainer';
import { hasPermissions, getUserRoles, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { WarningNotice } from '../../common/Notice';

const localMessages = {
  searchNow: { id: 'collection.details.searchNow', defaultMessage: 'Search on the Dashboard' },
  queryResultsTitle: { id: 'explorer.details.title', defaultMessage: 'Query Results' },
  };

class QueryResultsContainer extends React.Component {

  searchOnDashboard = () => {
    const { collection } = this.props;
    const dashboardUrl = `https://dashboard.mediacloud.org/#query/["*"]/[{"sets":[${collection.tags_id}]}]/[]/[]/[{"uid":1,"name":"${collection.label}","color":"55868A"}]`;
    window.open(dashboardUrl, '_blank');
  }

  render() {
    const { queries, user } = this.props;
    const { formatMessage } = this.props.intl;
    const filename = `AttentionComparisonContainer-query-results`;

    return (
      <div>
        <Row>
          <Col lg={6} xs={12}>
            <AttentionComparisonContainer queries={queries} />
          </Col>
        </Row>
      </div>
    );
  }

}

QueryResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
  queries: React.PropTypes.array,
  user: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  queries: state.explorer.queries,
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      QueryResultsContainer
    )
  );
