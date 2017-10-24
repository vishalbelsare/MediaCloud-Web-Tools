import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { selectStory, fetchStory, updateStory } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import StoryDetailForm from './StoryDetailForm';
import messages from '../../../resources/messages';
import { updateFeedback } from '../../../actions/appActions';

const localMessages = {
  feedback: { id: 'story.details.feedback', defaultMessage: 'Story Updates saved' },
};
class StoryUpdateContainer extends React.Component {

  state = {
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.storiesId !== this.props.storiesId) {
      const { fetchData } = this.props;
      fetchData(nextProps.storiesId);
    }
  }

  handleRemoveClick = () => {
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    this.setState({ open: false });
  };

  handleReadItClick = () => {
    const { story } = this.props;
    window.open(story.url, '_blank');
  }

  handleEditClick = () => {
    const { story } = this.props;
    window.open(story.url, '_blank');
    // dispatch update story link
  }

  render() {
    const { story, storiesId, onSave } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = `${formatMessage(messages.storyTitle)}: ${story.title}`;
    return (
      <div>
        <Grid>
          <Row>
            <h2>{titleHandler}</h2>
          </Row>
          <Row>
            <Col lg={6} xs={12} >
              <StoryDetailForm story={story} initialValues={story} storiesId={storiesId} onSave={onSave} buttonLabel="save" />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

StoryUpdateContainer.propTypes = {
  // from context
  params: PropTypes.object.isRequired,       // params from router
  intl: PropTypes.object.isRequired,
  // from parent
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  // from state
  story: PropTypes.object.isRequired,
  storiesId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
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
    dispatch(fetchStory(ownProps.params.topicId, ownProps.params.storiesId));
  },
  onSave: (storyInfo) => {
    dispatch(updateStory(storyInfo.stories_id, storyInfo))
      .then((result) => {
        if (result.success === 1) {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        injectIntl(
          StoryUpdateContainer
        )
      )
    )
  );
