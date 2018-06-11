import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import composeTopicEditableWordCloudContainer from '../TopicEditableWordCloudContainer';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  helpTitle: { id: 'media.words.help.title', defaultMessage: 'About Media Top Words' },
  helpText: { id: 'media.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words used by this Media Source within the Topic.</p>',
  },
};

class MediaWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }

  render() {
    return <div />;
  }
}

MediaWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  words: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.words.fetchStatus,
  words: state.topics.selected.mediaSource.words.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (sampleSize) => {
    dispatch(fetchTopicTopWords(ownProps.topicId, { ...ownProps.filters, sample_size: sampleSize, q: `media_id:${ownProps.mediaId}` }));
  },
  pushToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData();
    },
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${ownProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.pushToUrl(url);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.wordCloudTopicWord2VecLayoutHelp])(
        composeAsyncContainer(
          composeTopicEditableWordCloudContainer(
            MediaWordsContainer
          )
        )
      )
    )
  );
