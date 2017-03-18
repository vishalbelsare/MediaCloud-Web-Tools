import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicNytLabelCounts } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import Sunburst from '../../vis/Sunburst';

class NytLabelCountsContainer extends React.Component {
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
    const { tree } = this.props;
    return (
      <div className="nyt-label-count">
        <Grid>
          <Row>
            <Col lg={12}>
              <Sunburst tree={tree} width={600} height={600} domId={'nyt-label-count-sunburst-chart'} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

NytLabelCountsContainer.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  tree: React.PropTypes.object,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.nytlabels.fetchStatus,
  tree: state.topics.selected.nytlabels.tree,
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
      composeAsyncContainer(
        NytLabelCountsContainer
      )
    )
  );
