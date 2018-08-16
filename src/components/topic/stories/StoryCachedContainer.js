import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { selectStory, fetchStory } from '../../../actions/storyActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';


const localMessages = {
  title: { id: 'story.cached.title', defaultMessage: 'Cached Story' },
  intro: { id: 'story.cached.intro', defaultMessage: 'Originally published on { publishDate } in { ref }. Collected on { collectDate }.' },
};

const StoryCachedContainer = (props) => {
  const { story } = props;
  return (
    <div>
      <h1>{story.title}</h1>
      <h3><FormattedMessage {...localMessages.intro} values={{ publishDate: story.publish_date, ref: `<a href="${story.media.url}">${story.media.name}/a>`, collectDate: story.collect_date }} /></h3>
      <pre>
        {story.text}
      </pre>
    </div>
  );
};

StoryCachedContainer.propTypes = {
  // from parent
  story: PropTypes.object.isRequired,
  storiesId: PropTypes.number.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.story.info.fetchStatus,
  story: state.story.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(selectStory(ownProps.params.storiesId));
    dispatch(fetchStory(ownProps.params.topicId, ownProps.params.storiesId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withAsyncFetch(
        StoryCachedContainer
      )
    )
  );
