import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import composeDescribedDataCard from '../../../common/DescribedDataCard';
import OrderedWordCloud from '../../../vis/OrderedWordCloud';
import DataCard from '../../../common/DataCard';
import { fetchWordsByQuery } from '../../../../actions/topicActions';
import messages from '../../../../resources/messages';

const localMessages = {
  descriptionIntro: { id: 'topic.summary.words.help.into',
    defaultMessage: "The words most used in the stories we have already have can give you some clues about what is being discussed. If this isn't the conversation you want to capture, then go back and edit your query to remove certain words.",
  },
};
const WORD_CLOUD_DOM_ID = 'topic-summary-word-cloud';

class TopicWordsPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, query } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
    }
  }
  render() {
    const { words } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <OrderedWordCloud
          words={words}
          title={formatMessage(messages.topWords)}
          domId={WORD_CLOUD_DOM_ID}
          width={500}
        />
      </DataCard>
    );
  }
}

TopicWordsPreview.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // passed in
  query: React.PropTypes.object.isRequired,
  // from parent
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  words: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingWords.fetchStatus,
  words: state.topics.create.preview.matchingWords.list,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (query) => {
    const infoForQuery = {
      q: query.solr_seed_query,
      start_date: query.start_date,
      end_date: query.end_date,
    };
    infoForQuery['collections[]'] = [];
    infoForQuery['sources[]'] = [];

    if ('sourcesAndCollections' in query) {  // in FieldArrays on the form
      infoForQuery['collections[]'] = query.sourcesAndCollections.map(s => s.tags_id);
      infoForQuery['sources[]'] = query.sourcesAndCollections.map(s => s.media_id);
    }
    dispatch(fetchWordsByQuery(infoForQuery));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.query);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeDescribedDataCard(localMessages.descriptionIntro, [messages.wordcloudHelpText])(
        composeAsyncContainer(
          TopicWordsPreview
        )
      )
    )
  );
