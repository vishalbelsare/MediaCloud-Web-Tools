import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import { generateParamStr } from '../../../lib/apiUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import TimespanDateRange from '../../common/TimespanDateRange';

const localMessages = {
  title: { id: 'topic.influentialWords.title', defaultMessage: 'Influential Words' },
  intro: { id: 'topic.influentialWords.intro', defaultMessage: 'This screen lets you compare the words most used within this Timespan to the words used with this Subtopic. The words on the left are the most used in this Timespan. Those on the right are the most used within this Subtopic (if one is set, otherwise they are the most used in the whole snapshot).' },
  unfiltered: { id: 'topic.influentialWords.unfiltered', defaultMessage: 'Overall Timespan' },
  pickATimespan: { id: 'topic.influentialWords.pick', defaultMessage: 'You are currently looking at the overall timespan.  Pick a week or month to compare it to the overall timepsan here.' },
};

class InfluentialWordsContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }

  render() {
    const { wordCounts, totalWordCounts, handleWordCloudClick, selectedTimespan } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    let comparisonContent;
    if (selectedTimespan.period === 'overall') {
      comparisonContent = (
        <DataCard>
          <FormattedMessage {...localMessages.pickATimespan} />
        </DataCard>
      );
    } else {
      comparisonContent = (
        <DataCard>
          <h2>
            <TimespanDateRange timespan={selectedTimespan} />
          </h2>
          <OrderedWordCloud
            words={wordCounts}
            textColor={getBrandDarkColor()}
            onWordClick={handleWordCloudClick}
          />
        </DataCard>
      );
    }
    return (
      <Grid>
        <Title render={titleHandler} />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <DataCard>
              <h2>
                <FormattedMessage {...localMessages.unfiltered} />
              </h2>
              <OrderedWordCloud
                words={totalWordCounts}
                textColor={getBrandDarkColor()}
                onWordClick={handleWordCloudClick}
              />
            </DataCard>
          </Col>
          <Col lg={6}>
            {comparisonContent}
          </Col>
        </Row>
      </Grid>
    );
  }

}

InfluentialWordsContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  // from state
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  topWords: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  wordCounts: React.PropTypes.array.isRequired,
  totalWordCounts: React.PropTypes.array.isRequired,
  selectedTimespan: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  handleWordCloudClick: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedTimespan: state.topics.selected.timespans.selected,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  topWords: state.topics.selected.summary.topWords,
  wordCounts: state.topics.selected.summary.topWords.list,        // for just this timespan
  totalWordCounts: state.topics.selected.summary.topWords.totals, // for the whole snapshot/focus
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicTopWords(props.topicId, { ...props.filters, withTotals: true }));
  },
  goToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${stateProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.goToUrl(url);
    },
    asyncFetch: () => {
      dispatchProps.fetchData({
        filters: stateProps.filters,
        topicId: stateProps.topicId,
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        InfluentialWordsContainer
      )
    )
  );
