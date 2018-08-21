import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AppHeader from '../common/header/AppHeader';
import { setTopicFavorite } from '../../actions/topicActions';
import { updateFeedback } from '../../actions/appActions';
import messages from '../../resources/messages';
import { filteredLinkTo } from '../util/location';

const localMessages = {
  topicFavorited: { id: 'source.favorited', defaultMessage: 'Starred this topic' },
  topicUnfavorited: { id: 'source.unfavorited', defaultMessage: 'Un-starred this topic' },
};

const TopicHeaderContainer = (props) => {
  const { topicId, filters, topicInfo, handleSetFavorited } = props;
  const { formatMessage } = props.intl;
  let title = '';
  if (topicInfo.is_public === 1) {
    title += `${formatMessage(messages.topicPublicProp)} `;
  }
  title += `${formatMessage(messages.topicName)}: ${topicInfo.name}`;
  let content = null;
  if (topicInfo !== null) {
    content = (
      <AppHeader
        title={title}
        link={filteredLinkTo(`/topics/${topicInfo.topics_id}/summary`, filters)}
        subTitle={topicInfo.description}
        isFavorite={topicInfo.isFavorite}
        onSetFavorited={isFav => handleSetFavorited(topicId, isFav)}
      />
    );
  } else {
    content = null;
  }
  return (
    <div className="topic-header">
      {content}
    </div>
  );
};

TopicHeaderContainer.propTypes = {
  // from parent
  topicId: PropTypes.number,
  topicInfo: PropTypes.object,
  filters: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleSetFavorited: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSetFavorited: (id, isFav) => {
    dispatch(setTopicFavorite(id, isFav))
      .then(() => {
        const msg = (isFav) ? localMessages.topicFavorited : localMessages.topicUnfavorited;
        dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(msg) }));
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicHeaderContainer
    )
  );
