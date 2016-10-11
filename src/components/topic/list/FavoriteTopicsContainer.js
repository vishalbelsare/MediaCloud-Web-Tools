import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchFavoriteTopics } from '../../../actions/topicActions';
import TopicList from './TopicList';

const localMessages = {
  favTopicsTitle: { id: 'topics.favorite.title', defaultMessage: 'Starred Topics' },
  noFavorites: { id: 'topics.favorite.none', defaultMessage: 'You don\'t have any starred Topics yet. Click the star icon next to one on the list below to add it to your list of starred Topics.' },
};

const FavoriteTopicsContainer = (props) => {
  const { topics, onChangeFavorited } = props;
  let content = null;
  if (topics.length === 0) {
    content = (<i><FormattedMessage {...localMessages.noFavorites} /></i>);
  } else {
    content = <TopicList topics={topics} onChangeFavorited={onChangeFavorited} />;
  }
  return (
    <Row>
      <Col lg={12} md={12} sm={12}>
        <h2><FormattedMessage {...localMessages.favTopicsTitle} /></h2>
        {content}
      </Col>
    </Row>
  );
};

FavoriteTopicsContainer.propTypes = {
  // from parent
  onChangeFavorited: React.PropTypes.func.isRequired,
  // from state
  topics: React.PropTypes.array.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.favorite.fetchStatus,
  topics: state.topics.favorite.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchFavoriteTopics());
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
