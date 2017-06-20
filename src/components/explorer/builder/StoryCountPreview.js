import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchDemoQueryStoryCount, fetchQueryStoryCount } from '../../../../actions/topicActions';
import composeDescribedDataCard from '../../../common/DescribedDataCard';
import DataCard from '../../../common/DataCard';
import BubbleRowChart from '../../../vis/BubbleRowChart';
import { getBrandDarkColor } from '../../../../styles/colors';
import messages from '../../../../resources/messages';
import { updateFeedback } from '../../../../actions/appActions';
import { WarningNotice } from '../../../common/Notice';
import { MAX_RECOMMENDED_STORIES, WARNING_LIMIT_RECOMMENDED_STORIES, MIN_RECOMMENDED_STORIES } from '../../../../lib/formValidators';
import { hasPermissions, getUserRoles, PERMISSION_TOPIC_ADMIN } from '../../../../lib/auth';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';


const localMessages = {
  title: { id: 'explorer.storyCount.title', defaultMessage: 'Seed Stories' },
  descriptionIntro: { id: 'explorer.storyCount.help.into',
    defaultMessage: "Your topic can include up to 100,000 stories. This includes the stories we already have, and the stories we will spider once you create the topic. Spidering can add anywhere from 0 to 4 times the total number of stories, so be careful that you don't include too many seed stories.",
  },
  totalRolloverLabel: { id: 'explorer.storyCount.total', defaultMessage: 'All Stories' },
  totalLabel: { id: 'explorer.storyCount.total', defaultMessage: 'Total Stories' },
};

class StoryCountPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { query, fetchData } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
    }
  }
  render() {
    const { count, user } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const whichLabel = formatMessage(localMessages.totalLabel);
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
          aboveText: whichLabel,
          rolloverText: `${formatMessage(localMessages.totalRolloverLabel)}: ${formatNumber(MAX_RECOMMENDED_STORIES)} stories`,
        },
      ];
      content = (<BubbleRowChart
        data={data}
        padding={220}
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

StoryCountPreview.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  urlQueryString: React.PropTypes.object.isRequired,
  sampleSearches: React.PropTypes.array, // TODO, could we get here without any sample searches? yes if logged in...
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.storyCount.fetchStatus,
  count: state.explorer.storyCount.count,
  user: state.user,
});
const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (query, idx) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    if (isLoggedInUser) {
      if (idx) { // specific change/update here
        dispatch(fetchQueryStoryCount(query, idx));
      } else { // get all results
        state.queries.map((q, index) => dispatch(fetchQueryStoryCount(q, index)));
      }
    } else if (state.params && state.params.searchId) { // else assume DEMO mode
      let runTheseQueries = state.sampleSearches[state.params.searchId].data;
      // merge sample search queries with custom

      // find queries on stack without id but with index and with q, and add?
      const newQueries = state.queries.filter(q => q.id === undefined && q.index);
      runTheseQueries = runTheseQueries.concat(newQueries);
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: state.params.searchId, // may or may not have these
          query_id: q.id, // TODO if undefined, what to do?
          q: q.q, // only if no query id, means demo user added a keyword
        };
        return dispatch(fetchDemoQueryStoryCount(demoInfo)); // id
      });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData();
    },
  });
}
export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
       composeDescribedDataCard(localMessages.descriptionIntro, [messages.storyCountHelpText])(
        composeAsyncContainer(
          StoryCountPreview
        )
      )
    )
  );
