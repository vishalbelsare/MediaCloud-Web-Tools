import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import { notEmptyString } from '../../../lib/formValidators';
import composeIntlForm from '../../common/IntlForm';
import { DeleteButton } from '../../common/IconButton';

const localMessages = {
  emailFieldHint: { id: 'topic.permissions.email.hint', defaultMessage: 'Enter someone\'s email' },
  read: { id: 'topic.permissions.read', defaultMessage: 'Read' },
  write: { id: 'topic.permissions.write', defaultMessage: 'Write' },
  admin: { id: 'topic.permissions.admin', defaultMessage: 'Admin' },
  permission: { id: 'topic.permissions.permission', defaultMessage: 'Permisson' },
  addUser: { id: 'topic.permissions.addUser', defaultMessage: 'Add This User' },
  updateUser: { id: 'topic.permissions.updateUser', defaultMessage: 'Save' },
  email: { id: 'topic.permissions.email', defaultMessage: 'Email' },
  emailError: { id: 'topic.permissions.email.error', defaultMessage: 'You have to enter the email of a Media Cloud user.' },
  permissionError: { id: 'topic.permissions.permission.error', defaultMessage: 'Pick a permisson level.' },
  remove: { id: 'topic.permissions.remove', defaultMessage: 'Remove this user from this Topic' },
};

const PermissionForm = (props) => {
  const { handleSubmit, onSave, pristine, submitting, renderTextField, renderSelectField, initialValues, showDeleteButton, onDelete } = props;
  const { formatMessage } = props.intl;
  const buttonLabel = (initialValues.email === null) ? formatMessage(localMessages.addUser) : formatMessage(localMessages.updateUser);
  let deleteButton = null;
  if (showDeleteButton === true) {
    deleteButton = <DeleteButton tooltip={formatMessage(localMessages.remove)} onClick={() => onDelete(initialValues.email)} />;
  }
  return (
    <form className="permission-form update-permission" name="topicPermissionForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <Row>
        <Col lg={5} md={5} sm={12}>
          <Field
            name="email"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.email}
            hintText={localMessages.emailFieldHint}
          />
        </Col>
        <Col lg={3} md={3} sm={3} xs={12}>
          <Field name="permission" component={renderSelectField} floatingLabelText={localMessages.permission}>
            <MenuItem key="read" value="read" primaryText={formatMessage(localMessages.read)} />
            <MenuItem key="write" value="write" primaryText={formatMessage(localMessages.write)} />
            <MenuItem key="admin" value="admin" primaryText={formatMessage(localMessages.admin)} />
          </Field>
        </Col>
        <Col lg={2} md={2} sm={2} xs={12}>
          <RaisedButton
            style={{ marginTop: 30 }}
            type="submit"
            disabled={pristine || submitting}
            label={buttonLabel}
            primary
          />
          {deleteButton}
        </Col>
      </Row>
    </form>
  );
};

PermissionForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from form helper
  handleSubmit: React.PropTypes.func,
  fields: React.PropTypes.array.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from parent
  onSave: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func,
  showDeleteButton: React.PropTypes.bool,
};

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.email)) {
    errors.email = localMessages.emailError;
  }
  if (!notEmptyString(values.permission)) {
    errors.permission = localMessages.permissionError;
  }
  return errors;
}

const reduxFormConfig = {
  fields: ['email', 'permission'],
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        PermissionForm
      )
    )
  );
