import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import Dialog from 'material-ui/Dialog';
import Link from 'react-router/lib/Link';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { selectStory, fetchStory } from '../../../actions/storyActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import StoryWordsContainer from './StoryWordsContainer';
import StoryInlinksContainer from './StoryInlinksContainer';
import StoryOutlinksContainer from './StoryOutlinksContainer';
import StoryEntitiesContainer from '../../common/story/StoryEntitiesContainer';
import StoryNytThemesContainer from '../../common/story/StoryNytThemesContainer';
import { TAG_SET_GEOGRAPHIC_PLACES, TAG_SET_NYT_THEMES } from '../../../lib/tagUtil';
import StoryDetails from '../../common/story/StoryDetails';
import StoryPlaces from './StoryPlaces';
import messages from '../../../resources/messages';
import { EditButton, RemoveButton, ReadItNowButton } from '../../common/IconButton';
import ComingSoon from '../../common/ComingSoon';
import StoryIcon from '../../common/icons/StoryIcon';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE, PERMISSION_STORY_EDIT } from '../../../lib/auth';
import StatBar from '../../common/statbar/StatBar';
import AppButton from '../../common/AppButton';

const MAX_STORY_TITLE_LENGTH = 70;  // story titles longer than this will be trimmed and ellipses added

const localMessages = {
  mainTitle: { id: 'story.details.mainTitle', defaultMessage: 'Story: {title}' },
  removeTitle: { id: 'story.details.remove', defaultMessage: 'Remove from Next Snapshot' },
  removeAbout: { id: 'story.details.remove.about', defaultMessage: 'If story is clearly not related to the Topic, or is messing up your analysis, you can remove it from the next Snapshot.  Be careful, because this means it won\'t show up anywhere on the new Snapshot you generate.' },
  unknownLanguage: { id: 'story.details.language.unknown', defaultMessage: 'Unknown' },
  editStory: { id: 'story.details.edit', defaultMessage: 'Edit This Story' },
};

class StoryContainer extends React.Component {

  state = {
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.storiesId !== this.props.storiesId) {
      const { fetchData } = this.props;
      fetchData(nextProps.storiesId, nextProps.filters);
    }
  }

  handleRemoveClick = () => {
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { story, topicId, storiesId, topicName } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    let displayTitle = story.title;
    if (story.title.length > MAX_STORY_TITLE_LENGTH) {
      displayTitle = `${story.title.substr(0, MAX_STORY_TITLE_LENGTH)}...`;
    }
    const dialogActions = [
      <AppButton
        label={formatMessage(messages.ok)}
        primary
        onTouchTap={this.handleRemoveDialogClose}
      />,
    ];
    return (
      <div>
        <Helmet><title>{formatMessage(localMessages.mainTitle, { title: displayTitle })}</title></Helmet>
        <Grid>
          <Row>
            <Col lg={12}>
              <h1>
                <span className="actions">
                  <Permissioned onlyRole={PERMISSION_STORY_EDIT}>
                    <Link to={`/topics/${topicId}/stories/${storiesId}/update`}>
                      <EditButton tooltip={formatMessage(localMessages.editStory)} />
                    </Link>
                  </Permissioned>
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    <ReadItNowButton />
                  </a>
                  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                    <RemoveButton tooltip={formatMessage(localMessages.removeTitle)} onClick={this.handleRemoveClick} />
                  </Permissioned>
                </span>
                <StoryIcon height={32} />
                {displayTitle}
              </h1>
              <Dialog
                title={formatMessage(localMessages.removeTitle)}
                className="app-dialog"
                actions={dialogActions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleRemoveDialogClose}
              >
                <p><FormattedMessage {...localMessages.removeAbout} /></p>
                <ComingSoon />
              </Dialog>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <StatBar
                stats={[
                  { message: messages.mediaInlinks, data: formatNumber(story.media_inlink_count) },
                  { message: messages.inlinks, data: formatNumber(story.inlink_count) },
                  { message: messages.outlinks, data: formatNumber(story.outlink_count) },
                  { message: messages.facebookShares, data: formatNumber(story.facebook_share_count) },
                  { message: messages.language, data: story.language || formatMessage(localMessages.unknownLanguage) },
                ]}
                columnWidth={2}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <StoryInlinksContainer topicId={topicId} storiesId={storiesId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <StoryOutlinksContainer topicId={topicId} storiesId={storiesId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <StoryWordsContainer topicId={topicId} storiesId={storiesId} topicName={topicName} />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <StoryPlaces
                tags={story.story_tags ? story.story_tags.filter(t => t.tag_sets_id === TAG_SET_GEOGRAPHIC_PLACES) : []}
                geocoderVersion={story.geocoderVersion}
              />
            </Col>
            <Col lg={6}>
              <StoryNytThemesContainer
                storyId={storiesId}
                tags={story.story_tags ? story.story_tags.filter(t => t.tag_sets_id === TAG_SET_NYT_THEMES) : []}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <StoryDetails queryId={topicId} story={story} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} >
              <StoryEntitiesContainer storyId={storiesId} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

StoryContainer.propTypes = {
  // from context
  params: PropTypes.object.isRequired,       // params from router
  intl: PropTypes.object.isRequired,
  // from parent
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  story: PropTypes.object.isRequired,
  storiesId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.story.info.fetchStatus,
  filters: state.topics.selected.filters,
  storiesId: parseInt(ownProps.params.storiesId, 10),
  topicId: state.topics.selected.id,
  topicName: state.topics.selected.info.name,
  story: state.story.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (storiesId, filters) => {
    dispatch(selectStory(storiesId));
    const q = {
      ...filters,
      id: ownProps.params.topicId,
    };
    dispatch(fetchStory(storiesId, q));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => dispatchProps.fetchData(stateProps.storiesId, stateProps.filters),
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withAsyncFetch(
        StoryContainer
      )
    )
  );
