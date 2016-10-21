import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import FocusSelectorContainer from './FocusSelectorContainer';
import LinkWithFilters from '../LinkWithFilters';
import { filteredLinkTo } from '../../util/location';
import CreateSnapshotButton from './CreateSnapshotButton';
import { SettingsButton } from '../../common/IconButton';

const ControlBar = (props) => {
  const { topicInfo, topicId, location, filters } = props;
  // both the focus and timespans selectors need the snapshot to be selected first
  let focusSelector = null;
  let subControls = null;
  if ((filters.snapshotId !== null) && (filters.snapshotId !== undefined)) {
    subControls = <TimespanSelectorContainer topicId={topicId} location={location} filters={filters} />;
    focusSelector = <FocusSelectorContainer topicId={topicId} location={location} snapshotId={filters.snapshotId} />;
  }
  return (
    <div className="controlbar controlbar-topic">
      <div className="main">
        <Grid>
          <Row>
            <Col lg={3} className="left">
              <LinkWithFilters to={`/topics/${topicInfo.topics_id}/summary`}>&larr;</LinkWithFilters>
              &nbsp;
              <b>
                {topicInfo.name}
              </b>
              <SettingsButton
                linkTo={filteredLinkTo(`/topics/${topicId}/settings`, filters)}
              />
            </Col>
            <Col lg={4}>
              {focusSelector}
            </Col>
            <Col lg={1} />
            <Col lg={4} className="right">
              <SnapshotSelectorContainer topicId={topicId} location={location} />
              <CreateSnapshotButton topicId={topicId} />
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
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicInfo: React.PropTypes.object,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicInfo: state.topics.selected.info,
});

export default
  connect(mapStateToProps)(
    injectIntl(
      ControlBar
    )
  );
