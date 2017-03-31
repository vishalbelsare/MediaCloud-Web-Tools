import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { schemeCategory10 } from 'd3';
import { fetchTopicNytLabelCounts } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import BubbleChart, { PLACEMENT_HORIZONTAL, TEXT_PLACEMENT_CENTER } from '../../vis/BubbleChart';
import { downloadSvg } from '../../util/svg';
import DataCard from '../../common/DataCard';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import messages from '../../../resources/messages';
import ActionMenu from '../../common/ActionMenu';
import { DownloadButton } from '../../common/IconButton';

const BUBBLE_CHART_DOM_ID = 'nyt-label-representation-bubble-chart';
const COLORS = schemeCategory10;
const PERCENTAGE_MIN_VALUE = 0.05; // anything lower than this goes into an "other" bubble

const localMessages = {
  title: { id: 'topic.summary.nytLabels.title', defaultMessage: 'Top Themes' },
  descriptionIntro: { id: 'topic.summary.nytLabels.help.title', defaultMessage: 'The top themes that stories within this Topic are about, as determined by our machine learning models trained on news media.' },
  description: { id: 'topic.summary.nytLabels.help.text',
    defaultMessage: '<p>This bubble chart shows you the top themes covered in the stories within this topic. This is useful as a high-level view of the themes the articles about.  We\'ve trained a set of machine learning models based on the NYT Corpus.  This lets us take an article and have these models guess what themes the article is about.  We filter for themes that have the highest relevace scores, and tag each story with those themes.  This chart grabs a sample of those stories and counts the most commonly used themes.  Click the download button in the top right to download a full CSV showing the frequency of all the themes we found.</p>',
  },
};

class NytLabelSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/nyt-labels/counts.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { data } = this.props;
    const { formatMessage } = this.props.intl;
    const dataOverMinTheshold = data.filter(d => d.pct > PERCENTAGE_MIN_VALUE);
    const bubbleData = [
      ...dataOverMinTheshold.map((s, idx) => ({
        id: idx,
        label: s.tag,
        value: s.pct * 100,
        color: COLORS[idx + 1],
      })),
    ];
    const defaultMenuItems = [
      { text: formatMessage(messages.downloadCSV),
        icon: <DownloadButton />,
        clickHandler: this.downloadCsv,
      },
      { text: formatMessage(messages.downloadSVG),
        icon: <DownloadButton />,
        clickHandler: () => downloadSvg(BUBBLE_CHART_DOM_ID),
      },
    ];
    return (
      <DataCard>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ActionMenu actionItems={defaultMenuItems} />
          </div>
        </Permissioned>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <BubbleChart
          data={bubbleData}
          placement={PLACEMENT_HORIZONTAL}
          width={800}
          height={220}
          domId={BUBBLE_CHART_DOM_ID}
          textPlacement={TEXT_PLACEMENT_CENTER}
          maxBubbleRadius={80}
        />
      </DataCard>
    );
  }
}

NytLabelSummaryContainer.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  data: React.PropTypes.array,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.nytlabels.fetchStatus,
  data: state.topics.selected.nytlabels.results,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicNytLabelCounts(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeDescribedDataCard(localMessages.descriptionIntro, localMessages.description)(
        composeAsyncContainer(
          NytLabelSummaryContainer
        )
      )
    )
  );
