import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import AttentionOverTimeChart from '../../../vis/AttentionOverTimeChart';
import { fetchAttentionByQuery } from '../../../../actions/topicActions';
import composeDescribedDataCard from '../../../common/DescribedDataCard';
import DataCard from '../../../common/DataCard';
import messages from '../../../../resources/messages';
import { getBrandDarkColor } from '../../../../styles/colors';

const localMessages = {
  title: { id: 'topic.create.preview.attention.title', defaultMessage: 'Attention' },
  helpTitle: { id: 'topic.create.preview.attention.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.create.preview.attention.help.text',
    defaultMessage: '<p>This chart shows you estimated coverage of your seed query</p>',
  },
  descriptionIntro: { id: 'topic.summary.sentenceCount.help.title', defaultMessage: 'The attention over time to your topic can vary. If you see a predominantly flat line here with no attention, consider going back and changing the start and end dates for your topic. If you have too many total seed stories, try shortening the total number of days your topic covers.' },
};

class TopicAttentionPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, query } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
    }
  }
  render() {
    const { total, counts } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <AttentionOverTimeChart
          total={total}
          data={counts}
          height={200}
          lineColor={getBrandDarkColor()}
        />
      </DataCard>
    );
  }
}

TopicAttentionPreview.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // passed in
  query: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingAttention.fetchStatus,
  total: state.topics.create.preview.matchingAttention.total,
  counts: state.topics.create.preview.matchingAttention.counts,
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
    dispatch(fetchAttentionByQuery(infoForQuery));
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
      composeDescribedDataCard(localMessages.descriptionIntro, [messages.attentionChartHelpText])(
        composeAsyncContainer(
          TopicAttentionPreview
        )
      )
    )
  );
