import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import composeHelpfulContainer from '../../../common/HelpfulContainer';
import StoryTable from '../../StoryTable';
import { fetchStorySampleByQuery } from '../../../../actions/topicActions';
import DataCard from '../../../common/DataCard';
import messages from '../../../../resources/messages';
import { filteredLocation } from '../../../util/location';

const NUM_TO_SHOW = 20;

const localMessages = {
  title: { id: 'topic.create.preview.attention.title', defaultMessage: 'Attention' },
  helpTitle: { id: 'topic.create.preview.attention.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.create.preview.attention.help.text',
    defaultMessage: '<p>This chart shows you estimated coverage of your seed query</p>',
  },
};

class TopicStorySamplePreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, query } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
    }
  }
  render() {
    const { stories, helpButton, handleStorySelection } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <StoryTable
          stories={stories}
          onChangeFocusSelection={handleStorySelection}
          maxTitleLength={50}
        />
      </DataCard>
    );
  }
}

TopicStorySamplePreview.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // passed in
  query: React.PropTypes.string.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  stories: React.PropTypes.array,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  handleStorySelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingStories.fetchStatus,
  sort: state.topics.create.preview.matchingStories.total,
  stories: state.topics.create.preview.matchingStories.stories,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (query) => {
    const params = {
      q: query,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchStorySampleByQuery(params));
  },
  handleStorySelection: () => {
    // TODO get target, push that link
    const params = {
      ...ownProps.filters,
    };
    const newLocation = filteredLocation(ownProps.location, params);
    dispatch(push(newLocation));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData({
        query: ownProps.query,
      });
    },
  });
}

// TODO this should not be necessary - I will just pass in the values, but am experimenting
const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
          composeAsyncContainer(
            TopicStorySamplePreview
          )
        )
      )
    )
  );
