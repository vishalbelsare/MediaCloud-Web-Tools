import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import SourceSearchContainer from './SourceSearchContainer';

const SourceControlBar = props => (
  <div className="controlbar controlbar-sources">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={8} xs={12} className="left">
            {props.children}
          </Col>
          <Col lg={4} xs={12} className="right">
            <SourceSearchContainer
              onAdvancedSearchSelected={props.handleAdvancedSearchSelected}
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
  // from parent
  children: React.PropTypes.node,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleMediaSourceSelected: React.PropTypes.func.isRequired,
  handleCollectionSelected: React.PropTypes.func.isRequired,
  handleAdvancedSearchSelected: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleMediaSourceSelected: (item) => {
    dispatch(push(`/sources/${item.id}`));
  },
  handleCollectionSelected: (item) => {
    dispatch(push(`/collections/${item.id}`));
  },
  handleAdvancedSearchSelected: (values) => {
    if (values.toLowerCase() !== 'advanced search') {
      dispatch(push(`/search?search=${values}`));
    } else {
      dispatch(push('/search?search='));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceControlBar
    )
  );

