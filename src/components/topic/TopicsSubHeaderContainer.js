import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AppSubHeader from '../common/header/AppSubHeader';
import { setTopicFavorite } from '../../actions/topicActions';
import { updateFeedback } from '../../actions/appActions';
import messages from '../../resources/messages';
import { filteredLinkTo } from '../util/location';

const localMessages = {
  topicFavorited: { id: 'source.favorited', defaultMessage: 'Starred this topic' },
  topicUnfavorited: { id: 'source.unfavorited', defaultMessage: 'Un-starred this topic' },
};

const TopicMgrSubHeaderContainer = (props) => {
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
      <div className="topic-sub-header">
        <AppSubHeader
          title={title}
          link={filteredLinkTo(`/topics/${topicInfo.topics_id}/summary`, filters)}
          subTitle={topicInfo.description}
          isFavorite={topicInfo.isFavorite}
          onSetFavorited={isFav => handleSetFavorited(topicId, isFav)}
        />
      </div>
    );
  } else {
    content = null;
  }
  return (
    <div className="topic-subheader">
      {content}
    </div>
  );
};

TopicMgrSubHeaderContainer.propTypes = {
  // from parent
  // from context
  intl: PropTypes.object.isRequired,
  // state
  topicId: PropTypes.number,
  topicInfo: PropTypes.object,
  filters: PropTypes.object,
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
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(msg) }));
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicMgrSubHeaderContainer
    )
  );
