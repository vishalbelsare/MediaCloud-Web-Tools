import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectStory, fetchStory } from '../../../actions/topicActions';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import StoryDetails from './StoryDetails';
import StoryWordsContainer from './StoryWordsContainer';
import StoryInlinksContainer from './StoryInlinksContainer';
import StoryOutlinksContainer from './StoryOutlinksContainer';

class StoryContainer extends React.Component {
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { story, topicId, storiesId } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2>{story.title}</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <StoryDetails story={story} />
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
  // from state
  story: React.PropTypes.object.isRequired,
  storiesId: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.string.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.topics.selected.story.info.fetchStatus,
  storiesId: ownProps.params.storiesId,
  topicId: ownProps.params.topicId,
  story: state.topics.selected.story.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(selectStory(ownProps.params.storiesId));    // save it to the state
    dispatch(fetchStory(ownProps.params.topicId, ownProps.params.storiesId)); // fetch the info we need
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncWidget(
        StoryContainer
      )
    )
  );
