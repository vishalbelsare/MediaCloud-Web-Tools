import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

const localMessages = {
  warning: { id: 'needSnapshot.warning', defaultMessage: 'You\'ve made changes to your Topic that require a new snapshot to be generated!' },
  generate: { id: 'needSnapshot.generate', defaultMessage: 'Generate Snapshot' },
};

class NeedsNewSnapshotWarning extends React.Component {

  render() {
    const { needsNewSnapshot, onGenerateSnapshotRequest } = this.props;
    const { formatMessage } = this.props.intl;
    if (needsNewSnapshot === false) {
      return null;
    }
    return (
      <div className="needs-new-snapshot-warning">
        <Grid>
          <Row>
            <Col lg={10} md={10} sm={6}>
              <FontIcon className="material-icons" color={'#000000'}>warning</FontIcon>
              <FormattedMessage {...localMessages.warning } />
            </Col>
            <Col lg={2} md={2} sm={6}>
              <RaisedButton label={formatMessage(localMessages.generate)} onClick={onGenerateSnapshotRequest} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

NeedsNewSnapshotWarning.propTypes = {
  intl: React.PropTypes.object.isRequired,
  needsNewSnapshot: React.PropTypes.bool.isRequired,
  onGenerateSnapshotRequest: React.PropTypes.func.isRequired,
};

export default injectIntl(NeedsNewSnapshotWarning);
