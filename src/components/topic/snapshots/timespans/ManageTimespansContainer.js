import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import BackLinkingControlBar from '../../BackLinkingControlBar';
import ComingSoon from '../../../common/ComingSoon';

const localMessages = {
  title: { id: 'timespans.manage.title', defaultMessage: 'Manage Timespans' },
  about: { id: 'timespans.manage.about',
    defaultMessage: 'Each topic includes weekly and monthly timespans automatically.  To make analysis and comparison easier, you can define your own timespans too.  This page lets you manage your custom timespans.' },
  backToSnapshotBuilder: { id: 'backToSnapshotBuilder', defaultMessage: 'back to Snapshot Builder' },
};

const ManageTimespansContainer = props => (
  <div className="manage-focal-sets">
    <BackLinkingControlBar message={localMessages.backToSnapshotBuilder} linkTo={`/topics/${props.topicId}/snapshot`} />
    <Grid>
      <Row>
        <Col lg={10}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
          <p><FormattedMessage {...localMessages.about} /></p>
          <ComingSoon />
        </Col>
      </Row>
    </Grid>
  </div>
);

ManageTimespansContainer.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from state
  topicId: React.PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

export default
  injectIntl(
    connect(mapStateToProps, null)(
      ManageTimespansContainer
    )
  );
