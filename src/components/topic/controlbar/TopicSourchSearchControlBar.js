import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import SourceSearchContainer from '../../source/controlbar/SourceSearchContainer';

const TopicSourceSearchControlBar = props => (
  <div className="controlbar controlbar-sources">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={(props.showSearch === true) ? 6 : 12} xs={12} className="left">
            {props.children}
          </Col>
          <Col lg={6} xs={12} className="right">
            {(props.showSearch === true) && (
              <SourceSearchContainer
                searchSources
                maxSources={12}
                onMediaSourceSelected={props.handleMediaSourceSelected}
              />
            )}
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

TopicSourceSearchControlBar.propTypes = {
  // from parent
  children: PropTypes.node,
  showSearch: PropTypes.bool,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleMediaSourceSelected: PropTypes.func.isRequired,
  handleCollectionSelected: PropTypes.func.isRequired,
  handleAdvancedSearchSelected: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleMediaSourceSelected: (item) => {
    dispatch(push(`/media/${item.id}`));
  },
  handleCollectionSelected: (item) => {
    dispatch(push(`/media/${item.id}`));
  },
  handleAdvancedSearchSelected: (searchStr) => {
    dispatch(push(`/media/${item.id}`));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicSourceSearchControlBar
    )
  );

