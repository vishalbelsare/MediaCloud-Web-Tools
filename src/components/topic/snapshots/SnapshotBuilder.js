import React from 'react';
import Title from 'react-title-component';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import RaisedButton from 'material-ui/RaisedButton';
import Link from 'react-router/lib/Link';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Snapshot Builder' },
  aboutText: { id: 'snapshot.builder.about', defaultMessage: '<p>A Snapshot includes all the content in your Topic at one point in time.  You can\'t change the content within a Snapshot.  Anything you want to change within a Topic requires a new Snapshot to be made.  This doesn\'t take a long time, but it isn\'t instant either.</p><p>Use this Snapshot Builder to change Foci, Timespans, and any other parts of your Topic.  When you\'re ready to generate your new Snapshot, click the <b>Generate My Snapshot</b> button!' },
  fociLink: { id: 'snapshot.builder.foci.link', defaultMessage: 'Build Foci' },
  timespanLink: { id: 'snapshot.builder.timespans.link', defaultMessage: 'Build Timespans' },
};

const SnapshotBuilder = props => (
  <Grid>
    <Title render={props.intl.formatMessage(localMessages.title)} />
    <Row>
      <Col lg={12}>
        <h1><FormattedMessage {...localMessages.title} /></h1>
        <FormattedHTMLMessage {...localMessages.aboutText} />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <Link to={`/topics/${props.params.topicId}/snapshot/foci`}>
          <RaisedButton label={props.intl.formatMessage(localMessages.fociLink)} primary />
        </Link>
        <br />
        <br />
        <Link to={`/topics/${props.params.topicId}/snapshot/timespans`}>
          <RaisedButton label={props.intl.formatMessage(localMessages.timespanLink)} primary />
        </Link>
      </Col>
    </Row>
  </Grid>
);

SnapshotBuilder.propTypes = {
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    SnapshotBuilder
  );
