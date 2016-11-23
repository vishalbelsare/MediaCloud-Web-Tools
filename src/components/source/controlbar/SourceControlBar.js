import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import Link from 'react-router/lib/Link';
import SourceSearchContainer from './SourceSearchContainer';

const localMessages = {
  addCollection: { id: 'source.controlbar.addCollection', defaultMessage: 'Create a Collection' },
  addSource: { id: 'source.controlbar.addSource', defaultMessage: 'Add a Source' },
};

const SourceControlBar = props => (
  <div className="controlbar controlbar-sources">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={4} xs={4} className="left">
            <Link to="collections/create">
              <FormattedMessage {...localMessages.addCollection} />
            </Link>
          </Col>
          <Col lg={4} xs={4} className="left">
            <Link to="sources/create">
              <FormattedMessage {...localMessages.addSource} />
            </Link>
          </Col>
          <Col lg={4} xs={12} className="right">
            <SourceSearchContainer
              onMediaSourceSelected={props.handleMediaSourceSelected}
              onCollectionSelected={props.handleCollectionSelected}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

SourceControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleMediaSourceSelected: React.PropTypes.func.isRequired,
  handleCollectionSelected: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  sourceResults: state.sources.sourceSearch.list,
  collectionResults: state.sources.collectionSearch.list,
});

const mapDispatchToProps = dispatch => ({
  handleMediaSourceSelected: (id) => {
    dispatch(push(`/sources/${id}`));
  },
  handleCollectionSelected: (id) => {
    dispatch(push(`/collections/${id}`));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceControlBar
    )
  );

