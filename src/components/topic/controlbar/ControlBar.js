import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import FocusSelectorContainer from './FocusSelectorContainer';
import { filteredLinkTo } from '../../util/location';
import CreateSnapshotButton from './CreateSnapshotButton';
import { EditButton, SettingsButton } from '../../common/IconButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';

const localMessages = {
  editPermissions: { id: 'topic.editPermissions', defaultMessage: 'Edit Topic Permissions' },
  editSettings: { id: 'topic.editSettings', defaultMessage: 'Edit Topic Settings' },
};

const ControlBar = (props) => {
  const { topicId, location, filters } = props;
  const { formatMessage } = props.intl;
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
            <Col lg={4} className="left">
              <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                <EditButton
                  linkTo={filteredLinkTo(`/topics/${topicId}/edit`, filters)}
                  tooltip={formatMessage(localMessages.editSettings)}
                />
                <SettingsButton
                  linkTo={filteredLinkTo(`/topics/${topicId}/permissions`, filters)}
                  tooltip={formatMessage(localMessages.editPermissions)}
                />
              </Permissioned>
            </Col>
            <Col lg={4}>
              {focusSelector}
            </Col>
            <Col lg={4} className="right">
              <SnapshotSelectorContainer topicId={topicId} location={location} />
              <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                <CreateSnapshotButton topicId={topicId} />
              </Permissioned>
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
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      ControlBar
    )
  );
