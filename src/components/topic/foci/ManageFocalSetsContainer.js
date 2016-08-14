import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { fetchFocalSetDefinitions, deleteFocalSetDefinition } from '../../../actions/topicActions';
import { updateSnackBar } from '../../../actions/appActions';
import FocalSetSummary from './create/FocalSetSummary';

const localMessages = {
  focalSetsManageTitle: { id: 'focalSets.manage.title', defaultMessage: 'Manage Focal Sets' },
  removeTitle: { id: 'focalSets.manage.remove.title', defaultMessage: 'Really Remove It?' },
  removeAbout: { id: 'focalSets.manage.remove.about', defaultMessage: '<p>Removing a Focal Set means that the next Snapshot you make will NOT include it.  This will NOT remove the Focal Set from this Snapshot.</p><p>Are you sure you want to remove this Focal Set? All the Foci that are part of it will be removed as well.</p>' },
  removeOk: { id: 'focalSets.manage.remove.ok', defaultMessage: 'Remove It' },
  removeSucceeded: { id: 'focalSets.manage.remove.succeeded', defaultMessage: 'Removed the Focal Set' },
  removeFailed: { id: 'focalSets.manage.remove.failed', defaultMessage: 'Sorry, but removing the Focal Set failed :-(' },
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
    const { focalSetDefinitions } = this.props;
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
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2><FormattedMessage {...localMessages.focalSetsManageTitle} /></h2>
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
      </Grid>
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
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  handleFocalSetDefinitionDelete: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
});

const mapDispatchToProps = (dispatch) => ({
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
          dispatch(fetchFocalSetDefinitions(topicId));
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
