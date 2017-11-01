import PropTypes from 'prop-types';
import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import * as d3 from 'd3';
import { Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import Word2VecChart from '../../vis/Word2VecChart';
import { fetchTopicWord2VecTimespans } from '../../../actions/topicActions';
import { PlayButton, PauseButton, NextButton, PreviousButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import TimespanDateRange from '../TimespanDateRange';
import TimespanPeriodSelector from '../controlbar/timespans/TimespanPeriodSelector';

const SLIDESHOW_SPEED = 2000;
const ENTER_TIMEOUT = 1000;
const LEAVE_TIMEOUT = 300;

class Word2VecTimespanContainer extends React.Component {

  constructor(props) {
    super(props);
    const selectedPeriod = props.selectedGlobalPeriod;
    const currentPeriodList = props.timespanEmbeddings.filter(x => x.timespan.period === selectedPeriod);
    const filterByTimespanId = element => (element.timespan.timespans_id === props.selectedTimespan.timespans_id);
    const initialIndex = currentPeriodList.findIndex(filterByTimespanId);
    const isPlaying = false;
    if (initialIndex !== -1) {
      this.state = { currentTimespanIndex: initialIndex, currentPeriodList, selectedPeriod, isPlaying };
    } else {
      this.state = { currentTimespanIndex: 0, currentPeriodList, selectedPeriod, isPlaying };
    }
  }

  // Slideshow functions
  tick = () => {
    if (this.state.isPlaying && (this.state.currentTimespanIndex < this.state.currentPeriodList.length - 1)) {
      this.setState(prevState => ({ currentTimespanIndex: prevState.currentTimespanIndex + 1 }));
    }
  }

  playSlideShow = () => {
    if (!this.state.isPlaying) {
      this.setState(() => ({ isPlaying: true }));
      this.interval = setInterval(this.tick, SLIDESHOW_SPEED);
    }
  }

  pauseSlideShow = () => {
    if (this.state.isPlaying) {
      clearInterval(this.interval);
      this.setState(() => ({ isPlaying: false }));
    }
  }

  skipPrevious = () => {
    this.pauseSlideShow();
    if (this.state.currentTimespanIndex > 0) {
      this.setState(prevState => ({ currentTimespanIndex: prevState.currentTimespanIndex - 1 }));
    }
  }

  skipNext = () => {
    this.pauseSlideShow();
    if (this.state.currentTimespanIndex < this.state.currentPeriodList.length - 1) {
      this.setState(prevState => ({ currentTimespanIndex: prevState.currentTimespanIndex + 1 }));
    }
  }

  handlePeriodSelected = (period) => {
    this.pauseSlideShow();
    const currentTimespanIndex = 0;
    const selectedPeriod = period;
    this.setState((prevState, props) => ({ currentPeriodList: props.timespanEmbeddings.filter(x => x.timespan.period === period), currentTimespanIndex, selectedPeriod }));
  };

  render() {
    const { timespanEmbeddings } = this.props;
    const { currentTimespanIndex, currentPeriodList } = this.state;

    const currentTimespan = currentPeriodList[currentTimespanIndex].timespan;
    const currentWords = currentPeriodList[currentTimespanIndex].words;

    const getExtent = () => {
      // calculate tfnorms
      const allSum = d3.sum(currentWords, term => parseInt(term.count, 10));
      currentWords.forEach((term, idx) => {
        currentWords[idx].tfnorm = term.count / allSum;
      });

      // determine extent, ignoring zero-valued tfnorms
      const nonZeroNorms = currentWords.filter(d => d.tfnorm !== 0);
      if (nonZeroNorms.length === 0) {
        return [0.001, 0.002]; // doesn't really matter what these values are
      }
      return d3.extent(nonZeroNorms, d => d.tfnorm);
    };

    if ((timespanEmbeddings === undefined) || (timespanEmbeddings === null) ||
        (currentWords === undefined) || (currentWords.length === 0)) {
      return (<div />);
    }

    let avButtons;
    if (this.state.selectedPeriod === 'overall') {
      avButtons = (<div />);
    } else {
      avButtons = (
        <Col lg={12}>
          <PreviousButton onClick={this.skipPrevious} color={getBrandDarkColor()} />
          <PlayButton onClick={this.playSlideShow} color={getBrandDarkColor()} />
          <PauseButton onClick={this.pauseSlideShow} color={getBrandDarkColor()} />
          <NextButton onClick={this.skipNext} color={getBrandDarkColor()} />
        </Col>
      );
    }

    return (
      <div className="w2v-timespan-container">
        <Col lg={12} className="timespan-selector">
          <Row start="lg">
            <Col lg={12}>
              <TimespanPeriodSelector selectedPeriod={this.state.selectedPeriod} onPeriodSelected={this.handlePeriodSelected} />
            </Col>
          </Row>
        </Col>
        <ReactCSSTransitionReplace
          transitionName="fade"
          transitionEnterTimeout={ENTER_TIMEOUT}
          transitionLeaveTimeout={LEAVE_TIMEOUT}
        >
          <div className="w2v-chart-container" key={currentTimespan.timespans_id}>
            <Word2VecChart
              words={currentWords}
              domId={'w2v-timespan'}
              xProperty={'google_w2v_x'}
              yProperty={'google_w2v_y'}
              fullExtent={getExtent()}
              alreadyNormalized
            />
          </div>
        </ReactCSSTransitionReplace>
        <div className="timespan-av">
          <Row center="lg" className="date-display">
            <Col lg={12}>
              <ReactCSSTransitionReplace
                transitionName="fade"
                transitionEnterTimeout={ENTER_TIMEOUT}
                transitionLeaveTimeout={LEAVE_TIMEOUT}
              >
                <TimespanDateRange key={currentTimespan.timespans_id} timespan={currentTimespan} />
              </ReactCSSTransitionReplace>
            </Col>
          </Row>
          <Row center="lg" className="av-buttons">
            {avButtons}
          </Row>
        </div>
      </div>
    );
  }
}

Word2VecTimespanContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from state
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  selectedTimespan: PropTypes.object.isRequired,
  selectedGlobalPeriod: PropTypes.string.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  timespanEmbeddings: PropTypes.array.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedTimespan: state.topics.selected.timespans.selected,
  selectedGlobalPeriod: state.topics.selected.timespans.selectedPeriod,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.summary.word2vecTimespans.fetchStatus,
  timespanEmbeddings: state.topics.selected.summary.word2vecTimespans.list,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicWord2VecTimespans(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData({
        topicId: stateProps.topicId,
        filters: stateProps.filters,
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        Word2VecTimespanContainer
      )
    )
  );
