import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { selectSource, fetchSourceDetails } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';

class SelectSourceContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { sourceId, fetchData } = this.props;
    if ((nextProps.sourceId !== sourceId)) {
      fetchData(nextProps.sourceId);
    }
  }

  searchOnDashboard = () => {
    const { source } = this.props;
    const dashboardUrl = `https://dashboard.mediacloud.org/#query/["*"]/[{"sources":[${source.media_id}]}]/["${source.health.start_date.substring(0, 10)}"]/["${source.health.end_date.substring(0, 10)}"]/[{"uid":3,"name":"${source.name}","color":"55868A"}]`;
    window.open(dashboardUrl, '_blank');
  }

  render() {
    const { children, source } = this.props;
    const titleHandler = parentTitle => `${source.name} | ${parentTitle}`;
    return (
      <Grid className="details source-details">
        <Title render={titleHandler} />
        {children}
      </Grid>
    );
  }

}

SelectSourceContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  sourceId: React.PropTypes.number.isRequired,
  children: React.PropTypes.node.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  source: React.PropTypes.object,
};

SelectSourceContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.sources.selected.sourceDetails.fetchStatus,
  source: state.sources.sources.selected.sourceDetails.object,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (sourceId) => {
    dispatch(selectSource(sourceId));
    dispatch(fetchSourceDetails(sourceId));
  },
  asyncFetch: () => {
    dispatch(selectSource(ownProps.params.sourceId));
    dispatch(fetchSourceDetails(ownProps.params.sourceId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SelectSourceContainer
      )
    )
  );
