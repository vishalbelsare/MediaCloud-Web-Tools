import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import Title from 'react-title-component';
import { selectSource, fetchSourceDetails } from '../../../actions/sourceActions';
import { setSubHeaderVisible } from '../../../actions/appActions';
import SourceControlBar from '../controlbar/SourceControlBar';
import composeAsyncContainer from '../../common/AsyncContainer';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { EditButton } from '../../common/IconButton';

const localMessages = {
  editSource: { id: 'source.edit', defaultMessage: 'Modify this Source' },
  editFeeds: { id: 'source.feeds.edit', defaultMessage: 'Modify this Source\'s Feeds' },
};

class SelectSourceContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { sourceId, fetchData } = this.props;
    if ((nextProps.sourceId !== sourceId)) {
      fetchData(nextProps.sourceId);
    }
  }

  componentWillUnmount() {
    const { removeSourceId } = this.props;
    removeSourceId();
  }

  render() {
    const { children, source } = this.props;
    const titleHandler = parentTitle => `${source.name} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <SourceControlBar>
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
            <Row>
              <Col lg={3}>
                <span className="source-edit-link">
                  <Link to={`/sources/${source.media_id}/edit`} >
                    <EditButton />
                    <FormattedMessage {...localMessages.editSource} />
                  </Link>
                </span>
              </Col>
              <Col lg={3}>
                <Link to={`/sources/${source.media_id}/feeds`} >
                  <EditButton />
                  <FormattedMessage {...localMessages.editFeeds} />
                </Link>
              </Col>
            </Row>
          </Permissioned>
        </SourceControlBar>
        <Grid className="details source-details">
          {children}
        </Grid>
      </div>
    );
  }

}

SelectSourceContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  removeSourceId: PropTypes.func.isRequired,
  // from context
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,       // params from router
  sourceId: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  source: PropTypes.object,
};

SelectSourceContainer.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.sources.selected.sourceDetails.fetchStatus,
  source: state.sources.sources.selected.sourceDetails,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  removeSourceId: () => {
    dispatch(selectSource(null));
    dispatch(setSubHeaderVisible(false));
  },
  fetchData: (sourceId) => {
    dispatch(selectSource(sourceId));
    dispatch(fetchSourceDetails(sourceId))
      .then(() => dispatch(setSubHeaderVisible(true)));
  },
  asyncFetch: () => {
    dispatch(selectSource(ownProps.params.sourceId));
    dispatch(fetchSourceDetails(ownProps.params.sourceId))
      .then(() => dispatch(setSubHeaderVisible(true)));
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
