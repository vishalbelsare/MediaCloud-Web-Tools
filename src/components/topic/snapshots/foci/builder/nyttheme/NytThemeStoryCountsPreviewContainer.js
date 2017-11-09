import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import { fetchCreateFocusNytThemeStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import PackedBubbleChart from '../../../../../vis/PackedBubbleChart';

const NYT_COLORS = ['#0571b0', '#92c5de', '#666666', '#f4a582', '#ca0020'];
const BUBBLE_CHART_DOM_ID = 'focalSetCreatePreviewNytThemesCounts';

const localMessages = {
  title: { id: 'topic.snapshot.nytTheme.storyCount.title', defaultMessage: 'Stories By NYT Themes' },
  intro: { id: 'topic.snapshot.nytTheme.storyCount.intro', defaultMessage: 'Stories catalogued by NYT Themes' },
};

class NytThemeStoryCountsPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { topicId, numThemes, fetchData } = this.props;
    if (nextProps.numThemes !== numThemes) {
      fetchData(topicId, nextProps.numThemes);
    }
  }
  render() {
    const { counts } = this.props;
    const { formatNumber } = this.props.intl;
    let content = null;
    if (counts !== null) {
      const data = counts.map((info, idx) => ({
        value: info.count,
        fill: NYT_COLORS[idx],
        rolloverText: `${info.label}: ${formatNumber(info.pct, { style: 'percent', maximumFractionDigits: 2 })}`,
      }));
      content = (<PackedBubbleChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        width={700}
        padding={30}
      />);
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <p><FormattedMessage {...localMessages.intro} /></p>
        {content}
      </DataCard>
    );
  }
}

NytThemeStoryCountsPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  numThemes: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  counts: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.nytThemeStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.topCountriesStoryCounts.story_counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, numThemes) => {
    dispatch(fetchCreateFocusNytThemeStoryCounts(topicId, { numThemes }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.numThemes);
    },

  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        NytThemeStoryCountsPreviewContainer
      )
    )
  );
