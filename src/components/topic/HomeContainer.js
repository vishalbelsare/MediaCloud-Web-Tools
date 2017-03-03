import React from 'react';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicSearchContainer from './search/TopicSearchContainer';
import FavoriteTopicsContainer from './list/FavoriteTopicsContainer';
import TopicListContainer from './list/TopicListContainer';
import { updateFeedback } from '../../actions/appActions';
import { setTopicFavorite, fetchFavoriteTopics } from '../../actions/topicActions';
import TopicIcon from '../common/icons/TopicIcon';
import messages from '../../resources/messages';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Explore Topics' },
};

const HomeContainer = (props) => {
  const { handleSetFavorited } = props;
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.homeTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={8} xs={12}>
            <h1><TopicIcon height={32} /><FormattedMessage {...localMessages.homeTitle} /></h1>
          </Col>
          <Col lg={4} xs={12}>
            <h1><TopicSearchContainer /></h1>
          </Col>
        </Row>
        <FavoriteTopicsContainer onSetFavorited={handleSetFavorited} />
        <TopicListContainer onSetFavorited={handleSetFavorited} />
      </Grid>
    </div>
  );
};

HomeContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSetFavorited: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSetFavorited: (topicId, isFavorite) => {
    dispatch(setTopicFavorite(topicId, isFavorite))
      .then(() => {
        const msg = (isFavorite) ? messages.topicFavorited : messages.topicUnfavorited;
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
