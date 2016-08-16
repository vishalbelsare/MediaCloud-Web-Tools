import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import LinkWithFilters from '../LinkWithFilters';
import { fetchFocalSetDefinitions, deleteFocalSetDefinition, setTopicNeedsNewSnapshot, generateSnapshot }
  from '../../../actions/topicActions';
import { updateSnackBar } from '../../../actions/appActions';
import messages from '../../../resources/messages';
import FocalSetSummary from './create/FocalSetSummary';
import ManageFocalSetsControlBar from './ManageFocalSetsControlBar';

const localMessages = {
  focalSetsManageTitle: { id: 'focalSets.manage.title', defaultMessage: 'Manage Focal Sets' },
  focalSetsManageAbout: { id: 'focalSets.manage.about',
    defaultMessage: 'Every Focus is part of a Focal Set. All the Foci within a Focal Set share the same Focal Technique. Our tools lets you compare Foci with a Focal Set, but they don\'t let you easily compare Foci in different Focal Sets.' },
  removeTitle: { id: 'focalSets.manage.remove.title', defaultMessage: 'Really Remove It?' },
  removeAbout: { id: 'focalSets.manage.remove.about', defaultMessage: '<p>Removing a Focal Set means that the next Snapshot you make will NOT include it.  This will NOT remove the Focal Set from this Snapshot.</p><p>Are you sure you want to remove this Focal Set? All the Foci that are part of it will be removed as well.</p>' },
  removeOk: { id: 'focalSets.manage.remove.ok', defaultMessage: 'Remove It' },
  removeSucceeded: { id: 'focalSets.manage.remove.succeeded', defaultMessage: 'Removed the Focal Set' },
  removeFailed: { id: 'focalSets.manage.remove.failed', defaultMessage: 'Sorry, but removing the Focal Set failed :-(' },
  focalSetsDefsListTitle: { id: 'focalSet.manage.defsList.title', defaultMessage: 'Focal Sets for the Next Snapshot' },
  focalSetsDefsListAbout: { id: 'focalSet.manage.defsList.about',
    defaultMessage: 'You can change the Focal Sets and Foci that will be included in the <b>next</b> Snapshot.  Here\'s a list of what will be included so far:' },
  focalSetsListTitle: { id: 'focalSet.manage.list.title', defaultMessage: 'Focal Sets in this Snapshot' },
  focalSetsListAbout: { id: 'focalSet.manage.list.about',
    defaultMessage: 'You can\'t change the Focal Sets or Foci within this Snapshot.  See below to change the Focal Sets for the next Snapshot.' },
};

class ManageFocalSetsContainer extends React.Component {

  state = {
    removeDialogOpen: false,
    idToRemove: null,
    snackBarOpen: false,
    snackBarMessage: null,
  };

  handleDeleteClick = (focalSet) => {
    event.preventDefault();
    this.setState({ removeDialogOpen: true, idToRemove: focalSet.focal_set_definitions_id });
  }

  actuallyDelete = () => {
    const { handleFocalSetDefinitionDelete } = this.props;
    handleFocalSetDefinitionDelete(this.state.idToRemove);
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  doNotActuallyDelete = () => {
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  handleRemoveSnackBarRequestClose = () => {
    this.setState({ snackBarOpen: false, snackBarMessage: null });
  }

  render() {
    const { topicId, focalSets, focalSetDefinitions, handleGenerateSnapshotRequest } = this.props;
    const { formatMessage } = this.props.intl;
    this.removeConfirmationDialog = (
      <ConfirmationDialog
        open={this.state.removeDialogOpen}
        data={this.state.removeDialogData}
        title={formatMessage(localMessages.removeTitle)}
        okText={formatMessage(localMessages.removeOk)}
        onCancel={this.doNotActuallyDelete}
        onOk={this.actuallyDelete}
      >
        <FormattedHTMLMessage {...localMessages.removeAbout} />
      </ConfirmationDialog>
    );
    return (
      <div>
        <ManageFocalSetsControlBar topicId={topicId} />
        <Grid>

          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2><FormattedMessage {...localMessages.focalSetsManageTitle} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={10} md={10} sm={12}>
              <p>
                <FormattedMessage {...localMessages.focalSetsManageAbout} />
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={10} md={10} sm={12}>
              <h3><FormattedMessage {...localMessages.focalSetsListTitle} /></h3>
              <p><FormattedHTMLMessage {...localMessages.focalSetsListAbout} /></p>
            </Col>
          </Row>
          <Row>
            {focalSets.map(focalSet =>
              <FocalSetSummary
                key={focalSet.focal_set_id}
                focalSet={focalSet}
              />
            )}
            {this.removeConfirmationDialog}
          </Row>

          <Row>
            <Col lg={10} md={10} sm={12}>
              <h3><FormattedMessage {...localMessages.focalSetsDefsListTitle} /></h3>
              <p><FormattedHTMLMessage {...localMessages.focalSetsDefsListAbout} /></p>
              <p>
                <LinkWithFilters to={`/topics/${topicId}/foci/create`}>
                  <FormattedMessage {...messages.focusCreate} />
                </LinkWithFilters>
              </p>
            </Col>
          </Row>
          <Row>
            {focalSetDefinitions.map(focalSetDef =>
              <FocalSetSummary
                key={focalSetDef.focal_set_definitions_id}
                focalSet={focalSetDef}
                onDeleteClick={this.handleDeleteClick}
                editable
              />
            )}
            {this.removeConfirmationDialog}
          </Row>
          <Row>
            <Col lg={10} md={10} sm={12}>
              <RaisedButton label={formatMessage(messages.snapshotGenerate)} onClick={handleGenerateSnapshotRequest} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

ManageFocalSetsContainer.propTypes = {
  // from composition
  topicId: React.PropTypes.number.isRequired,
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  focalSetDefinitions: React.PropTypes.array.isRequired,
  focalSets: React.PropTypes.array.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  handleGenerateSnapshotRequest: React.PropTypes.func.isRequired,
  handleFocalSetDefinitionDelete: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  focalSets: state.topics.selected.focalSets.all.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId) => {
    dispatch(fetchFocalSetDefinitions(topicId));
  },
  removeFocalSetDefinition: (topicId, focalSetDefinitionId, succeededMessage, failedMessage) => {
    dispatch(deleteFocalSetDefinition(topicId, focalSetDefinitionId))
      .then((results) => {
        if (results.success === 0) {
          dispatch(updateSnackBar({ open: true, message: failedMessage }));
        } else {
          dispatch(updateSnackBar({ open: true, message: succeededMessage }));
          dispatch(setTopicNeedsNewSnapshot(true));
          dispatch(fetchFocalSetDefinitions(topicId));
        }
      });
  },
  handleGenerateSnapshotRequest: () => {
    dispatch(generateSnapshot(ownProps.params.topicId))
      .then((results) => {
        if (results.success === 1) {
          dispatch(updateSnackBar({ open: true, message: ownProps.intl.formatMessage(messages.snapshotGenerating) }));
        } else {
          // TODO: error message!
        }
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.topicId);
    },
    handleFocalSetDefinitionDelete: (focalSetDefinitionId) => {
      dispatchProps.removeFocalSetDefinition(stateProps.topicId, focalSetDefinitionId,
        ownProps.intl.formatMessage(localMessages.removeSucceeded),
        ownProps.intl.formatMessage(localMessages.removeFailed)
      );
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        ManageFocalSetsContainer
      )
    )
  );
