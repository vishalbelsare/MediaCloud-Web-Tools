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
import { updateFeedback } from '../../../../actions/appActions';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';
const MAX_RECOMMENDED_STORIES = 100000;
const MIN_RECOMMENDED_STORIES = 500;

const localMessages = {
  title: { id: 'topic.create.preview.storyCount.title', defaultMessage: 'Seed Stories' },
  descriptionIntro: { id: 'topic.create.preview.storyCount.help.into',
    defaultMessage: "<p>Your topic can include up to 100,000 stories. This includes the stories we already have, and the stories we will spider once you create the topic. Spidering can add anywhere from 0 to 4 times the total number of stories, so be careful that you don't include too many seed stories.</p>",
  },
  filteredLabel: { id: 'topic.create.preview.storyCount.matching', defaultMessage: 'Matching Stories' },
  totalLabel: { id: 'topic.create.preview.storyCount.total', defaultMessage: 'All Stories' },
  toomany: { id: 'topic.create.preview.storyCount.toomany', defaultMessage: 'Too many stories' },
  notenough: { id: 'topic.create.preview.storyCount.feedback.notenough', defaultMessage: 'Not enough stories' },
};

class TopicStoryCountPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { query, fetchData } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
    }
  }
  render() {
    const { count } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    let content = null;
    if (count !== null) {
      const data = [  // format the data for the bubble chart help
        {
          value: count,
          fill: getBrandDarkColor(),
          aboveText: formatMessage(localMessages.filteredLabel),
          aboveTextColor: 'rgb(255,255,255)',
          rolloverText: `${formatMessage(localMessages.filteredLabel)}: ${formatNumber(count)} stories`,
        },
        {
          value: MAX_RECOMMENDED_STORIES,
          aboveText: formatMessage(localMessages.totalLabel),
          rolloverText: `${formatMessage(localMessages.totalLabel)}: ${formatNumber(MAX_RECOMMENDED_STORIES)} stories`,
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
  count: React.PropTypes.object,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingStoryCounts.fetchStatus,
  count: state.topics.create.preview.matchingStoryCounts.count,
});

// TODO do some evaluation here where we look at the admin role and tell the user about the 100K limit

const mapDispatchToProps = (dispatch, ownProps) => ({
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
    dispatch(fetchStoryCountByQuery(infoForQuery))
      .then((result) => {
        if (result.count > MAX_RECOMMENDED_STORIES) { // TODO and user not an admin
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.toomany) }));
        } else if (result.count < MIN_RECOMMENDED_STORIES) {
          dispatch(updateFeedback({
            open: true,
            message: ownProps.intl.formatMessage(localMessages.notenough),
          }));
        }
      });
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
