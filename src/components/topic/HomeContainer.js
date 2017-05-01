import React from 'react';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicSearchContainer from './search/TopicSearchContainer';
import TopicListContainer from './list/TopicListContainer';
import { updateFeedback } from '../../actions/appActions';
import { setTopicFavorite, fetchFavoriteTopics } from '../../actions/topicActions';
import messages from '../../resources/messages';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Home' },
};

const HomeContainer = (props) => {
  const { handleSetFavorited } = props;
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.homeTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <div className="controlbar">
        <div className="main">
          <Grid>
            <Row>
              <Col lg={8} />
              <Col lg={4}>
                <TopicSearchContainer />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
      <Grid>
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
