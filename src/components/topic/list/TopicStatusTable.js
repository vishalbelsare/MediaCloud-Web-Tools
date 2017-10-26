import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import Link from 'react-router/lib/Link';

const localMessages = {
  name: { id: 'topic.adminList.table.name', defaultMessage: 'Name' },
  state: { id: 'topic.adminList.table.status', defaultMessage: 'State' },
  dates: { id: 'topic.adminList.table.dates', defaultMessage: 'Dates' },
  queue: { id: 'topic.adminList.table.queue', defaultMessage: 'Queue' },
  message: { id: 'topic.adminList.table.seedQuery', defaultMessage: 'Message' },
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

const TopicStatusTable = props => (
  <div className="topic-table">
    <table className="table">
      <tbody>
        <tr>
          <th><FormattedMessage {...localMessages.name} /></th>
          <th><FormattedMessage {...localMessages.state} /></th>
          <th><FormattedMessage {...localMessages.dates} /></th>
          <th><FormattedMessage {...localMessages.queue} /></th>
          <th className="numeric"><FormattedMessage {...localMessages.maxStories} /></th>
          <th><FormattedMessage {...localMessages.message} /></th>
        </tr>
        {props.topics.map((t, idx) =>
          (<tr key={t.topics_id} className={`${(idx % 2 === 0) ? 'even' : 'odd'} ${classNameForState(t.state)}`}>
            <td><b><Link to={`/topics/${t.topics_id}/summary`}>{t.name}</Link></b></td>
            <td>{t.state}</td>
            <td><FormattedDate value={t.start_date} /> - <FormattedDate value={t.end_date} /></td>
            <td>{t.job_queue}</td>
            <td className="numeric">{t.max_stories}</td>
            <td>{t.message}</td>
          </tr>)
        )}
      </tbody>
    </table>
  </div>
);

TopicStatusTable.propTypes = {
  // from state
  topics: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicStatusTable
  );
