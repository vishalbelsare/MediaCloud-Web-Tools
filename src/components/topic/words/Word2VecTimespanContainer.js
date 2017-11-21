import PropTypes from 'prop-types';
import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
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
const DEFAULT_WIDTH = 730;
const DEFAULT_HEIGHT = 520;

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

  componentWillReceiveProps(nextProps) {
    const { fetchData, timespanEmbeddings } = this.props;
    console.log('this.props:');
    console.log(timespanEmbeddings);
    console.log('next props:');
    console.log(timespanEmbeddings);
    if ((nextProps.timespanEmbeddings !== timespanEmbeddings)) {
      fetchData(nextProps);
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   const { timespanEmbeddings, filters } = this.props;
  //   return (nextProps.timespanEmbeddings !== timespanEmbeddings) ||
  //          (nextProps.filters !== filters);
  // }

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
    const { timespanEmbeddings, width, height, xProperty, yProperty } = this.props;
    const { currentTimespanIndex, currentPeriodList } = this.state;

    const options = {
      width,
      height,
      xProperty,
      yProperty,
    };

    if (width === undefined) {
      options.width = DEFAULT_WIDTH;
    }
    if (height === undefined) {
      options.height = DEFAULT_HEIGHT;
    }

    options.xProperty = xProperty || 'x';
    options.yProperty = yProperty || 'y';

    if ((timespanEmbeddings === undefined) || (timespanEmbeddings === null) || (timespanEmbeddings.length === 0)) {
      return (<div />);
    }

    const currentTimespan = currentPeriodList[currentTimespanIndex].timespan;
    const currentWords = currentPeriodList[currentTimespanIndex].words;

    // need scale to be constant across all plots...
    // based on the min and the max of the overall embeddings
    const overallTimespan = timespanEmbeddings.filter(x => x.timespan.period === 'overall')[0];
    const overallWords = overallTimespan.words;
    const w2vChartWidth = 530;
    const w2vChartHeight = 320;

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
              scaleWords={overallWords}
              domId={'w2v-timespan'}
              width={w2vChartWidth}
              height={w2vChartHeight}
              xProperty={options.xProperty}
              yProperty={options.yProperty}
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
  // from parent
  width: PropTypes.number,
  height: PropTypes.number,
  xProperty: PropTypes.string,
  yProperty: PropTypes.string,
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
