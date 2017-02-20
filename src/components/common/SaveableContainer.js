import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../resources/messages';
import * as fetchConstants from '../../lib/fetchConstants';
import { SaveButton } from './IconButton';
import { saveToNotebook } from '../../actions/userActions';
import { getAppName } from '../../config';
import { updateFeedback } from '../../actions/appActions';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { WarningNotice, InfoNotice, ErrorNotice } from '../common/Notice';

const localMessages = {
  saving: { id: 'notebook.save.inProgress', defaultMessage: 'Saving to the server...' },
  failed: { id: 'notebook.save.failed', defaultMessage: 'Sorry, this failed for some reason. Reload the page and try again.' },
  saveDialogTitle: { id: 'notebook.save.title', defaultMessage: 'Save to Your Notebook' },
  saveDialogText: { id: 'notebook.save.text', defaultMessage: 'You can save this data view to your notebook.  Add a note to yourself about why you want to save it.  After you save it, you\'ll be able to see a frozen-in-time version of it in your Notebook.' },
  saveInvation: { id: 'notebook.save.invitation', defaultMessage: 'Save to Your Notebook' },
  savedToNotebook: { id: 'notebook.save.confirm', defaultMessage: 'We saved this to your notebook' },
};

/**
 * Exposes two things to childen:
 * 1) setDataCallback: call this with a function that returns the data to save
 * 1) savedFeedback: a div with info about whether this has been saved or not
 * 2) saveToNotebookButton: a button that can be displayed to request this content be saved
 */
const composeSaveableContainer = (ChildComponent) => {
  class SaveableContainer extends React.Component {
    state = {
      open: false,
      status: fetchConstants.FETCH_INVALID,
    };
    setDataToSave = (data) => {
      this.setDataToSave = data;
    };
    dataToSave = null;
    handleSaveButtonClick = () => this.setState({ open: true });
    handleSave = () => {
      const { handleSaveToNotebook } = this.props;
      this.setState({ status: fetchConstants.FETCH_ONGOING });
      handleSaveToNotebook(this.dataToSave, this.setState);
      console.log('save!');
    };
    render() {
      console.log('render saveable');
      const { formatMessage } = this.props.intl;
      const saveToNotebookButton = <SaveButton onClick={this.handleSaveButtonClick} />;
      let savedFeedback = null;
      switch (this.state.status) {
        case fetchConstants.FETCH_ONGOING:
          savedFeedback = <WarningNotice><FormattedMessage {...localMessages.saving} /></WarningNotice>;
          break;
        case fetchConstants.FETCH_SUCCEEDED:
          savedFeedback = <InfoNotice><FormattedMessage {...localMessages.savedToNotebook} /></InfoNotice>;
          break;
        case fetchConstants.FETCH_FAILED:
          savedFeedback = <ErrorNotice><FormattedMessage {...localMessages.failed} /></ErrorNotice>;
          break;
        default:
          savedFeedback = '';
          break;
      }
      return (
        <span className="saveable">
          <ChildComponent
            {...this.props}
            saveToNotebookButton={saveToNotebookButton}
            setDataToSave={this.setDataToSave}
            savedFeedback={savedFeedback}
          />
          <ConfirmationDialog
            open={this.state.open}
            title={formatMessage(localMessages.saveDialogTitle)}
            okText={formatMessage(messages.save)}
            onOk={this.handleSave}
            okCancel={() => this.setState({ open: false })}
          >
            <p><FormattedMessage {...localMessages.saveDialogText} /></p>
          </ConfirmationDialog>
        </span>
      );
    }
  }
  SaveableContainer.propTypes = {
    intl: React.PropTypes.object.isRequired,
    handleSaveToNotebook: React.PropTypes.func.isRequired,
  };
  const mapStateToProps = () => ({
  });
  const mapDispatchToProps = (dispatch, ownProps) => ({
    handleSaveToNotebook: (info, setState) => {
      const contentToSave = {
        ...info,
        app: getAppName(),  // add app name in for filtering later
        // TODO: add in url hash
      };
      dispatch(saveToNotebook(contentToSave))
        .then(() => {
          updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.savedToNotebook) });
          setState({ status: fetchConstants.FETCH_SUCCEEDED });
        });
    },
  });
  return injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SaveableContainer
    )
  );
};

export default composeSaveableContainer;

