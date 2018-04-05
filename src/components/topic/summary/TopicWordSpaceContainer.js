import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import WordSpace from '../../vis/WordSpace';
import { fetchTopicTopWords } from '../../../actions/topicActions';

const localMessages = {
  descriptionIntro: { id: 'topic.summary.words.help.into',
    defaultMessage: 'Look at the top words to see how this topic was talked about. This can suggest what the dominant narrative was, and looking at different timespans can suggest how it evolved over time.',
  },
  noTopicW2VData: { id: 'topic.summary.wordspace.nodata', defaultMessage: 'Sorry, the topic model does not exist.' },
};
const WORD_SPACE_DOM_ID = 'topic-summary-word-space';

class TopicWordSpaceContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  render() {
    const { words } = this.props;
    return (
      <DataCard>
        <WordSpace
          words={words}
          domId={WORD_SPACE_DOM_ID}
          xProperty="w2v_x"
          yProperty="w2v_y"
          noDataMsg={localMessages.noTopicW2VData}
        />
      </DataCard>
    );
  }
}

TopicWordSpaceContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  words: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchTopicTopWords(props.topicId, props.filters));
  },
  asyncFetch: () => {
    dispatch(fetchTopicTopWords(ownProps.topicId, ownProps.filters));
  },
  pushToUrl: url => dispatch(push(url)),
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicWordSpaceContainer
      )
    )
  );
