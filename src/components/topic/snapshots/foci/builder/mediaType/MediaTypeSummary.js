import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  intro: { id: 'focus.create.confirm.retweet.intro', defaultMessage: 'We will create n subtopics:' },
};

const MediaTypeSummary = (props) => {
  const { counts } = props;
  return (
    <div className="focus-create-cofirm-retweet-partisanship">
      <p><FormattedMessage {...localMessages.intro} /></p>
      <ul>
        {counts.map(ctry => <li>{ctry.label}</li>
        )}
      </ul>
    </div>
  );
};

MediaTypeSummary.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  counts: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.mediaTypeStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.mediaTypeStoryCounts.story_counts,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      MediaTypeSummary
    )
  );
