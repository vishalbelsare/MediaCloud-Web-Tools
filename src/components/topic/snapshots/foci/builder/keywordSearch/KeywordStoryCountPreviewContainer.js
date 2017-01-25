import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import composeHelpfulContainer from '../../../../../common/HelpfulContainer';
import { fetchCreateFocusKeywordStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import BubbleChart, { TEXT_PLACEMENT_ABOVE } from '../../../../../vis/BubbleChart';
import { getBrandDarkColor } from '../../../../../../styles/colors';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';

const localMessages = {
  title: { id: 'topic.snapshot.keywords.storyCount.title', defaultMessage: 'Story Counts' },
  helpTitle: { id: 'topic.snapshot.keywords.storyCount.help.title', defaultMessage: 'About Story Counts' },
  helpText: { id: 'topic.snapshot.keywords.storyCount.help.text',
    defaultMessage: '<p>This is a visualization showing the how many of the stories from the total Topic would be included within this Focus.</p>',
  },
  filteredLabel: { id: 'topic.snapshot.keywords.storyCount.matching', defaultMessage: 'Matching Stories' },
  totalLabel: { id: 'topic.snapshot.keywords.storyCount.total', defaultMessage: 'All Stories' },
};

class KeywordStoryCountPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { keywords, fetchData } = this.props;
    if (nextProps.keywords !== keywords) {
      fetchData(nextProps.keywords);
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
        width={440}
      />);
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {content}
      </DataCard>
    );
  }
}

KeywordStoryCountPreviewContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  keywords: React.PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  counts: React.PropTypes.object,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.matchingStoryCounts.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (keywords) => {
    dispatch(fetchCreateFocusKeywordStoryCounts(ownProps.topicId, { q: keywords }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.keywords);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          KeywordStoryCountPreviewContainer
        )
      )
    )
  );
