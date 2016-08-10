import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LinkWithFilters from '../LinkWithFilters';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import messages from '../../../resources/messages';

const ControlBar = (props) => {
  const { title, topicId, location, snapshotId } = props;
  let subControls = null;
  if ((snapshotId !== null) && (snapshotId !== undefined)) {
    subControls = <TimespanSelectorContainer topicId={topicId} location={location} snapshotId={snapshotId} />;
  }
  return (
    <div className="controlbar">
      <div className="main">
        <Grid>
          <Row>
            <Col lg={6} md={6} sm={6} className="left">
              <LinkWithFilters to={`/topics/${topicId}/foci/create`}>
                <FormattedMessage {...messages.focusCreate} />
              </LinkWithFilters>
            </Col>
            <Col lg={6} md={6} sm={6} className="right">
              <SnapshotSelectorContainer topicId={topicId} location={location} />
            </Col>
          </Row>
        </Grid>
      </div>
      <div className="sub">
        {subControls}
      </div>
    </div>
  );
};

ControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  title: React.PropTypes.string,
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
  // from state
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  snapshotId: state.topics.selected.filters.snapshotId,
});

export default
  connect(mapStateToProps)(
    injectIntl(
      ControlBar
    )
  );
