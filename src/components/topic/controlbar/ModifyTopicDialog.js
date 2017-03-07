import React from 'react';
import { injectIntl } from 'react-intl';
import Dialog from 'material-ui/Dialog';
import messages from '../../../resources/messages';
import AppButton from '../../common/AppButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { EditButton } from '../../common/IconButton';
import DescriptiveButton from '../../common/DescriptiveButton';

const localMessages = {
  modifyTopic: { id: 'topic.modify', defaultMessage: 'Modify Topic' },
  addFocusDetails: { id: 'topic.addFocus.details', defaultMessage: 'Refine your data by creating a new Subtopic' },
  addTimespan: { id: 'topic.addTimespan', defaultMessage: 'Add New Timespan' },
  addTimespanDetails: { id: 'topic.addTimespan.details', defaultMessage: 'Create now timespans for grouping stories to analyze' },
  changePermissions: { id: 'topic.changePermissions', defaultMessage: 'Change Permissions' },
  changePermissionsDetails: { id: 'topic.changePermissions.details', defaultMessage: 'Control who else can see and/or change this topic' },
  changeSettings: { id: 'topic.changeSettings', defaultMessage: 'Change Settings' },
  changeSettingsDetails: { id: 'topic.changeSettings.details', defaultMessage: 'Edit this topic\'s configuration and visibility' },
  generateSnapshotDetails: { id: 'topic.generateSnapshot.details', defaultMessage: 'Your topic needs to be updated!' },
};

class ModifyTopicDialog extends React.Component {

  state = {
    open: false,
  };

  handleModifyClick = () => {
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { topicId, onUrlChange, allowSnapshot } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <AppButton
        label={formatMessage(messages.cancel)}
        onTouchTap={this.handleRemoveDialogClose}
      />,
    ];
    let snapshotButton = null;
    if (allowSnapshot) {
      snapshotButton = (
        <DescriptiveButton
          label={formatMessage(messages.snapshotGenerate)}
          description={formatMessage(localMessages.generateSnapshotDetails)}
          onClick={() => onUrlChange(`/topics/${topicId}/snapshot/generate`)}
        />
      );
    }
    return (
      <div className="modify-topic">
        <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
          <EditButton
            onClick={this.handleModifyClick}
            tooltip={formatMessage(localMessages.modifyTopic)}
          />
        </Permissioned>
        <Dialog
          title={formatMessage(localMessages.modifyTopic)}
          actions={dialogActions}
          modal
          open={this.state.open}
          onRequestClose={this.handleRemoveDialogClose}
          className={'modify-topic-dialog'}
          bodyClassName={'modify-topic-dialog-body'}
          contentClassName={'modify-topic-dialog-content'}
          overlayClassName={'modify-topic-dialog-overlay'}
          titleClassName={'modify-topic-dialog-title'}
          autoDetectWindowHeight={false}
        >
          {snapshotButton}
          <DescriptiveButton
            label={formatMessage(messages.addFocus)}
            description={formatMessage(localMessages.addFocusDetails)}
            onClick={() => onUrlChange(`/topics/${topicId}/snapshot/foci`)}
          />
          <DescriptiveButton
            label={formatMessage(localMessages.addTimespan)}
            description={formatMessage(localMessages.addTimespanDetails)}
            onClick={() => onUrlChange(`/topics/${topicId}/snapshot/timespans`)}
          />
          <DescriptiveButton
            label={formatMessage(localMessages.changePermissions)}
            description={formatMessage(localMessages.changePermissionsDetails)}
            onClick={() => onUrlChange(`/topics/${topicId}/permissions`)}
          />
          <DescriptiveButton
            label={formatMessage(localMessages.changeSettings)}
            description={formatMessage(localMessages.changeSettingsDetails)}
            onClick={() => onUrlChange(`/topics/${topicId}/edit`)}
          />
        </Dialog>
      </div>
    );
  }

}

ModifyTopicDialog.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  allowSnapshot: React.PropTypes.bool.isRequired,
  // from dispatch
  onUrlChange: React.PropTypes.func.isRequired,
};

export default
  injectIntl(
    ModifyTopicDialog
  );
