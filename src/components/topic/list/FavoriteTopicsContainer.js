import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchFavoriteTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';

const localMessages = {
  empty: { id: 'topics.favorite.none', defaultMessage: 'You don\'t have any starred topics.  You can star topics to save them here so you can find them more quickly. Click the star icon next to any topic\'s name to add it to this list.' },
};

const FavoriteTopicsContainer = (props) => {
  const { topics, onSetFavorited, asyncFetch } = props;
  return (
    <div className="favorite-topics-list">
      <Row>
        <Col lg={12}>
          <TopicPreviewList
            topics={topics}
            linkGenerator={t => `/topics/${t.topics_id}/summary`}
            onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); asyncFetch(); }}
            emptyMsg={localMessages.empty}
          />
        </Col>
      </Row>
    </div>
  );
};

FavoriteTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: PropTypes.func,
  // from state
  topics: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.favoriteList.fetchStatus,
  topics: state.topics.favoriteList.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchFavoriteTopicsList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FavoriteTopicsContainer
      )
    )
  );
