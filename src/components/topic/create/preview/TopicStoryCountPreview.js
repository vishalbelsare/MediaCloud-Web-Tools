import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchStoryCountByQuery } from '../../../../actions/topicActions';
import composeDescribedDataCard from '../../../common/DescribedDataCard';
import DataCard from '../../../common/DataCard';
import BubbleChart from '../../../vis/BubbleChart';
import { getBrandDarkColor } from '../../../../styles/colors';
import messages from '../../../../resources/messages';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';

const localMessages = {
  title: { id: 'topic.create.preview.storyCount.title', defaultMessage: 'Seed Stories' },
  descriptionIntro: { id: 'topic.create.preview.storyCount.help.into',
    defaultMessage: "<p>Your topic can include up to 100,000 stories. This includes the stories we already have, and the stories we will spider once you create the topic. Spidering can add anywhere from 0 to 4 times the total number of stories, so be careful that you don't include too many seed stories.</p>",
  },
  filteredLabel: { id: 'topic.create.preview.storyCount.matching', defaultMessage: 'Matching Stories' },
  totalLabel: { id: 'topic.create.preview.storyCount.total', defaultMessage: 'All Stories' },
};

class TopicStoryCountPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { query, fetchData } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
    }
  }
  render() {
    const { counts } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    let content = null;
    if (counts !== null) {
      const data = [  // format the data for the bubble chart help
        {
          value: counts.count,
          fill: getBrandDarkColor(),
          aboveText: formatMessage(localMessages.filteredLabel),
          aboveTextColor: 'rgb(255,255,255)',
          rolloverText: `${formatMessage(localMessages.filteredLabel)}: ${formatNumber(counts.count)} stories`,
        },
        {
          value: counts.total,
          aboveText: formatMessage(localMessages.totalLabel),
          rolloverText: `${formatMessage(localMessages.totalLabel)}: ${formatNumber(counts.total)} stories`,
        },
      ];
      content = (<BubbleChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        width={440}
      />);
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        {content}
      </DataCard>
    );
  }
}

TopicStoryCountPreview.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  query: React.PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  counts: React.PropTypes.object,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingStoryCounts.fetchStatus,
  counts: state.topics.create.preview.matchingStoryCounts.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (query) => {
    dispatch(fetchStoryCountByQuery({ q: query }));
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
       composeDescribedDataCard(localMessages.descriptionIntro, [messages.storyCountHelpText])(
        composeAsyncContainer(
          TopicStoryCountPreview
        )
      )
    )
  );
