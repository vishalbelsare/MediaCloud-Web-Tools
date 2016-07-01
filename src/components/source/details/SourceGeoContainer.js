import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

// import SentenceCount from '../../vis/SentenceCount';
import { fetchSourceGeo } from '../../../actions/sourceActions';



class SourceGeoContainer extends React.Component {
  render() {
    const { fetchStatus } = this.props;
    let content = <div />;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { geolist } = this.props;
        const sourceArray = Object.keys(geolist).map((idx) => geolist[idx]);     
        content =  ( 
          sourceArray.map(src => <SourceGeoItem key={src.alpha3} source={src} /> )
        );
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <Grid>
        <h4>Geographic: </h4>
        <Row>
          { content }
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.geoTag.fetchStatus,
  total: state.sources.selected.details.sourceDetailsReducer.geoTag.total,
  geolist: state.sources.selected.details.sourceDetailsReducer.geoTag.list,
  sourceId: React.PropTypes.string.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceGeo(sourceId));
  },
});

SourceGeo.propTypes = {
  geolist: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  geo: React.PropTypes.object.isRequired,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceGeoContainer));
