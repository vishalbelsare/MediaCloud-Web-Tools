import React from 'react';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FavoriteTopicsContainer from './list/FavoriteTopicsContainer';
import TopicListContainer from './list/TopicListContainer';
import { updateFeedback } from '../../actions/appActions';
import { setTopicFavorite, fetchFavoriteTopics } from '../../actions/topicActions';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Explore Topics' },
  topicsListTitle: { id: 'topics.list.title', defaultMessage: 'Recent Topics' },
  topicFavorited: { id: 'topics.favorited', defaultMessage: 'Added it as a favorite.' },
  topicUnfavorited: { id: 'topics.unfavorited', defaultMessage: 'Removed it from your favorites.' },
};

const HomeContainer = (props) => {
  const { handleChangeFavorited } = props;
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.homeTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.homeTitle} /></h1>
          </Col>
        </Row>
        <FavoriteTopicsContainer onChangeFavorited={handleChangeFavorited} />
        <TopicListContainer onChangeFavorited={handleChangeFavorited} />
      </Grid>
    </div>
  );
};

HomeContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleChangeFavorited: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleChangeFavorited: (topicId, isFavorite) => {
    dispatch(setTopicFavorite(topicId, isFavorite))
      .then(() => {
        const msg = (isFavorite) ? localMessages.topicFavorited : localMessages.topicUnfavorited;
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(msg) }));
        dispatch(fetchFavoriteTopics());  // to update the list of favorites
      });
  },
});

export default
  injectIntl(
    connect(null, mapDispatchToProps)(
      HomeContainer
    )
  );
