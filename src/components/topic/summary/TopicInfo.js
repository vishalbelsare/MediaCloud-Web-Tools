import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import { PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';

const localMessages = {
  title: { id: 'topic.summary.info.title', defaultMessage: 'About this Topic' },
  state: { id: 'topic.state', defaultMessage: 'State' },
  timespan: { id: 'topic.summary.timespan', defaultMessage: '<b>Timespan</b>: {start} to {end} ({period})' },
  filtersHeader: { id: 'topic.summary.filters.header', defaultMessage: 'Current Filters' },
};

const TopicInfo = (props) => {
  const { topic, timespan, focus } = props;
  const { formatMessage, formatDate } = props.intl;
  let stateMessage = '';
  if (topic.state !== 'error') {
    stateMessage = topic.message; // show details to everyone if in normal state
  } else {
    // only show error ugly stack trace to admin users
    stateMessage = (<Permissioned onlyTopic={PERMISSION_TOPIC_ADMIN}>{topic.message}</Permissioned>);
  }
  let sourcesAndCollections = topic.media ? [...topic.media] : [];
  sourcesAndCollections = topic.media_tags ? [...sourcesAndCollections, ...topic.media_tags] : sourcesAndCollections;
  let timespanContent;
  if (timespan) {
    timespanContent = (
      <p>
        <FormattedHTMLMessage
          {...localMessages.timespan}
          values={{
            start: formatDate(timespan.startDateObj, { month: 'short', year: 'numeric', day: 'numeric' }),
            end: formatDate(timespan.endDateObj, { month: 'short', year: 'numeric', day: 'numeric' }),
            period: timespan.period,
          }}
        />
      </p>
    );
  } else {
    timespanContent = (
      <p><b><FormattedMessage {...messages.timespan} /></b>: ?</p>
    );
  }
  let focusContent;
  if (focus && focus.focalSet) {
    focusContent = (
      <p>
        <b><FormattedMessage {...messages.focus} /></b>: {focus.focalSet.name}: {focus.name}
        <br />
        <FormattedMessage {...messages.query} />: <code>{focus.query}</code>
      </p>
    );
  } else {
    focusContent = (
      <p><b><FormattedHTMLMessage {...messages.focus} /></b>: <FormattedMessage {...messages.none} /></p>
    );
  }
  return (
    <DataCard className="topic-info">
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p>{topic.description}</p>
      <p>
        <b><FormattedMessage {...localMessages.state} /></b>: {topic.state }
        <br />
        {stateMessage}
      </p>
      <p>
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { topic.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {topic.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {topic.end_date}
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>
        <code>{topic.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>
      </p>
      {sourcesAndCollections.map(object =>
        <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} autoLink />)
      }
      <p>
        <b><FormattedHTMLMessage {...messages.topicValidationProp} /></b>
        <code>{topic.pattern}</code>
      </p>
      <h3><FormattedMessage {...localMessages.filtersHeader} /></h3>
      {timespanContent}
      {focusContent}
    </DataCard>
  );
};

TopicInfo.propTypes = {
  topic: PropTypes.object.isRequired,
  timespan: PropTypes.object,
  focus: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TopicInfo);
