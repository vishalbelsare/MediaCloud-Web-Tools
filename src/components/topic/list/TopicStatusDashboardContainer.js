import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchAdminTopicList } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
  name: { id: 'topic.adminList.table.name', defaultMessage: 'Name' },
  status: { id: 'topic.adminList.table.status', defaultMessage: 'Status' },
  dates: { id: 'topic.adminList.table.dates', defaultMessage: 'Dates' },
  queue: { id: 'topic.adminList.table.queue', defaultMessage: 'Queue' },
  seedQuery: { id: 'topic.adminList.table.seedQuery', defaultMessage: 'Seed Query' },
  maxStories: { id: 'topic.adminList.table.maxStories', defaultMessage: 'Max Stories' },
};

const classNameForState = (state) => {
  let className;
  switch (state) {
    case 'completed':
    case 'running':
      className = 'topic-state-ok';
      break;
    case 'created but not queued':
    case 'error':
    default:
      className = 'topic-state-error';
  }
  return className;
};

const TopicStatusDashboardContainer = (props) => {
  const { topics } = props;
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <Row>
        <div className="topic-table">
          <table className="table">
            <tbody>
              <tr>
                <th><FormattedMessage {...localMessages.name} /></th>
                <th><FormattedMessage {...localMessages.status} /></th>
                <th><FormattedMessage {...localMessages.dates} /></th>
                <th><FormattedMessage {...localMessages.queue} /></th>
                <th className="numeric"><FormattedMessage {...localMessages.maxStories} /></th>
                <th><FormattedMessage {...localMessages.seedQuery} /></th>
              </tr>
              {topics.map((t, idx) =>
                (<tr key={t.topics_id} className={`${(idx % 2 === 0) ? 'even' : 'odd'} ${classNameForState(t.state)}`}>
                  <td><b><Link to={`/topics/${t.topics_id}/summary`}>{t.name}</Link></b></td>
                  <td>{t.state}</td>
                  <td><FormattedDate value={t.start_date} /> - <FormattedDate value={t.end_date} /></td>
                  <td>{t.job_queue}</td>
                  <td className="numeric">{t.max_stories}</td>
                  <td><code>{t.solr_seed_query}</code></td>
                </tr>)
              )}
            </tbody>
          </table>
        </div>
      </Row>
    </Grid>
  );
};

TopicStatusDashboardContainer.propTypes = {
  // from state
  topics: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.adminList.fetchStatus,
  topics: state.topics.adminList.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchAdminTopicList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicStatusDashboardContainer
      )
    )
  );
