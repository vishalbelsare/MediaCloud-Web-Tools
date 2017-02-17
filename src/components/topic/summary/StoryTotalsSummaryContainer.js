import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { fetchTopicStoryCounts } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import BubbleChart, { TEXT_PLACEMENT_ABOVE } from '../../vis/BubbleChart';
import { DownloadButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';

const localMessages = {
  title: { id: 'topic.summary.storyTotals.title', defaultMessage: 'Story Totals' },
  helpTitle: { id: 'topic.summary.storyTotals.help.title', defaultMessage: 'About the Story Count' },
  helpText: { id: 'topic.summary.storyTotals.help.into',
    defaultMessage: '<p>This is a visualization showing the how many of the stories from the total Topic are included within the Timespan and Subtopic you have are looking at now.</p>',
  },
  filteredLabel: { id: 'topic.summary.storyTotals.filtered', defaultMessage: 'Filtered' },
  totalLabel: { id: 'topic.summary.storyTotals.total', defaultMessage: 'Total' },
};

class StoryTotalsSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  render() {
    const { counts, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (counts !== null) {
      const data = [  // format the data for the bubble chart help
        { label: formatMessage(localMessages.filteredLabel),
          value: counts.count,
          color: getBrandDarkColor(),
          labelColor: 'rgb(255,255,255)' },
        { label: formatMessage(localMessages.totalLabel), value: counts.total },
      ];
      content = (<BubbleChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        textPlacement={TEXT_PLACEMENT_ABOVE}
      />);
    }
    return (
      <DataCard>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <DownloadButton
              tooltip={formatMessage(messages.download)}
              onClick={() => downloadSvg(BUBBLE_CHART_DOM_ID)}
            />
          </div>
        </Permissioned>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {content}
      </DataCard>
    );
  }
}

StoryTotalsSummaryContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  counts: React.PropTypes.object,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.storyTotals.fetchStatus,
  counts: state.topics.selected.summary.storyTotals.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicStoryCounts(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          StoryTotalsSummaryContainer
        )
      )
    )
  );
