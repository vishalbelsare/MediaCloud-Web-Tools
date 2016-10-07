import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FontIcon from 'material-ui/FontIcon';
import Link from 'react-router/lib/Link';

const localMessages = {
  warning: { id: 'needSnapshot.warning', defaultMessage: 'You\'ve made changes to your Topic that require a new snapshot to be generated!' },
  snapshotBuilderLink: { id: 'needSnapshot.snapshotBuilderLink', defaultMessage: 'Visit the Snapshot Builder for details.' },
};

const NeedsNewSnapshotWarning = (props) => {
  const { needsNewSnapshot } = props;
  if (needsNewSnapshot === false) {
    return null;
  }
  return (
    <div className="needs-new-snapshot-warning">
      <Grid>
        <Row>
          <Col lg={12}>
            <FontIcon className="material-icons" color={'#000000'}>warning</FontIcon>
            <FormattedMessage {...localMessages.warning} />
            &nbsp;
            <Link to={`/topics/${props.topicId}/snapshot`}>
              <FormattedMessage {...localMessages.snapshotBuilderLink} />
            </Link>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

NeedsNewSnapshotWarning.propTypes = {
  intl: React.PropTypes.object.isRequired,
  needsNewSnapshot: React.PropTypes.bool.isRequired,
  topicId: React.PropTypes.number.isRequired,
};

export default injectIntl(NeedsNewSnapshotWarning);
