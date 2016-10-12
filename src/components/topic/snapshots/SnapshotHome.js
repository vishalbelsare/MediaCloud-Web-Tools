import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Link from 'react-router/lib/Link';
import BackLinkingControlBar from '../BackLinkingControlBar';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import { generateSnapshot } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import ComingSoon from '../../common/ComingSoon';
import SnapshotIcon from '../../common/icons/SnapshotIcon';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Snapshot Builder' },
  aboutText: { id: 'snapshot.builder.about', defaultMessage: '<p>A Snapshot includes all the content in your Topic at one point in time.  You can\'t change the content within a Snapshot.  Anything you want to change within a Topic requires a new Snapshot to be made.  This doesn\'t take a long time, but it isn\'t instant either.</p><p>Use this Snapshot Builder to change Foci, Timespans, and any other parts of your Topic.  When you\'re ready to generate your new Snapshot, click the <b>Generate My Snapshot</b> button!' },
  fociLink: { id: 'snapshot.builder.foci.link', defaultMessage: 'Build Foci' },
  timespanLink: { id: 'snapshot.builder.timespans.link', defaultMessage: 'Build Timespans' },
  backToTopicLink: { id: 'snapshot.builder.backToTopic.link', defaultMessage: 'back to Topic' },
  summaryTitle: { id: 'snapshot.summary.title', defaultMessage: 'Summary of Your New Snapshot' },
  summaryMessage: { id: 'snapshot.summary.text', defaultMessage: 'You have made some changes that you can only see if you generate a new Snapshot.  Here\'s a summary of those changes:' },
};

const SnapshotHome = props => (
  <div className="snapshot-builder-home">
    <BackLinkingControlBar message={localMessages.backToTopicLink} linkTo={`/topics/${props.params.topicId}/summary`} />
    <Grid>
      <Row>
        <Col lg={10}>
          <h1><SnapshotIcon /><FormattedMessage {...localMessages.title} /></h1>
          <FormattedHTMLMessage {...localMessages.aboutText} />
        </Col>
      </Row>
      <Row>
        <Col lg={3} xs={12}>
          <br />
          <Link to={`/topics/${props.params.topicId}/snapshot/foci`}>
            <RaisedButton label={props.intl.formatMessage(localMessages.fociLink)} primary />
          </Link>
          <br />
          <br />
          <Link to={`/topics/${props.params.topicId}/snapshot/timespans`}>
            <RaisedButton label={props.intl.formatMessage(localMessages.timespanLink)} primary />
          </Link>
        </Col>
        <Col lg={7} xs={12}>
          <DataCard inline>
            <h2><FormattedMessage {...localMessages.summaryTitle} /></h2>
            <p><FormattedHTMLMessage {...localMessages.summaryMessage} /></p>
            <ComingSoon />
            <RaisedButton label={props.intl.formatMessage(messages.snapshotGenerate)} primary onClick={props.handleGenerateSnapshotRequest} />
          </DataCard>
        </Col>
      </Row>
    </Grid>
  </div>
);

SnapshotHome.propTypes = {
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  // from state
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  handleGenerateSnapshotRequest: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleGenerateSnapshotRequest: () => {
    dispatch(generateSnapshot(ownProps.params.topicId))
      .then((results) => {
        if (results.success === 1) {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(messages.snapshotGenerating) }));
          dispatch(push(`/topics/${ownProps.topicId}/summary`));
        } else {
          // TODO: error message!
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SnapshotHome
    )
  );
