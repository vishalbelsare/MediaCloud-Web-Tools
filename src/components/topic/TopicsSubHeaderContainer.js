import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AppSubHeader from '../common/header/AppSubHeader';
import { setTopicFavorite } from '../../actions/topicActions';
import { updateFeedback } from '../../actions/appActions';

const localMessages = {
  topicFavorited: { id: 'source.favorited', defaultMessage: 'Favorited this topic' },
  topicUnfavorited: { id: 'source.unfavorited', defaultMessage: 'Unfavorited this topic' },
};

const SourceMgrSubHeaderContainer = (props) => {
  const { topicId, topicInfo, handleSetFavorited } = props;
  let content = null;
  if (topicInfo !== null) {
    content = (
      <div className="topic-sub-header">
        <AppSubHeader
          title={topicInfo.name}
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

SourceMgrSubHeaderContainer.propTypes = {
  // from parent
  // from context
  intl: React.PropTypes.object.isRequired,
  // state
  topicId: React.PropTypes.number,
  topicInfo: React.PropTypes.object,
  // from dispatch
  handleSetFavorited: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
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
      SourceMgrSubHeaderContainer
    )
  );
