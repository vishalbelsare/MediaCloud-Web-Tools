import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectStory, fetchStory } from '../../../actions/topicActions';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import StoryDetails from './StoryDetails';
import StoryWordsContainer from './StoryWordsContainer';
import StoryInlinksContainer from './StoryInlinksContainer';
import StoryOutlinksContainer from './StoryOutlinksContainer';
import messages from '../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'story.details.mainTitle', defaultMessage: 'Story Details: {title}',
  },
};

class StoryContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.storiesId !== this.props.storiesId) {
      const { fetchData } = this.props;
      fetchData(nextProps.storiesId);
    }
  }

  render() {
    const { story, topicId, storiesId } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(messages.story)} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2><FormattedMessage {...localMessages.mainTitle} values={{ title: story.title }} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <StoryDetails topicId={topicId} story={story} />
            </Col>
            <Col lg={6} md={6} sm={12}>
              <StoryWordsContainer topicId={topicId} storiesId={storiesId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <StoryInlinksContainer topicId={topicId} storiesId={storiesId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <StoryOutlinksContainer topicId={topicId} storiesId={storiesId} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

StoryContainer.propTypes = {
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  intl: React.PropTypes.object.isRequired,
  // from parent
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  story: React.PropTypes.object.isRequired,
  storiesId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.topics.selected.story.info.fetchStatus,
  storiesId: parseInt(ownProps.params.storiesId, 10),
  topicId: parseInt(ownProps.params.topicId, 10),
  story: state.topics.selected.story.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(selectStory(ownProps.params.storiesId));
    dispatch(fetchStory(ownProps.params.topicId, ownProps.params.storiesId));
  },
  fetchData: (storiesId) => {
    dispatch(selectStory(storiesId));
    dispatch(fetchStory(ownProps.params.topicId, storiesId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        injectIntl(
          StoryContainer
        )
      )
    )
  );
