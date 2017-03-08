import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import composeIntlForm from '../../common/IntlForm';

export const NEW_FOCAL_SET_PLACEHOLDER_ID = -1;

const localMessages = {
  noteLabel: { id: 'snapshot.generate.note.label', defaultMessage: 'Note' },
  noteHint: { id: 'snapshot.generate.note.hint', defaultMessage: 'make a note about why you are generating this snapshot' },
  generate: { id: 'snapshot.generate', defaultMessage: 'generate' },
};

const GenerateSnapshotForm = (props) => {
  const { renderTextField, submitting, handleSubmit, onGenerate } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="app-form generate-snapshot-form" name="generateSnapshot" onSubmit={handleSubmit(onGenerate.bind(this))}>
      <Row>
        <Col lg={12}>
          <Field
            name="note"
            component={renderTextField}
            floatingLabelText={localMessages.noteLabel}
            fullWidth
            hintText={localMessages.noteHint}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={formatMessage(localMessages.generate)}
            disabled={submitting}
            primary
          />
        </Col>
      </Row>
    </form>
  );
};

GenerateSnapshotForm.propTypes = {
  // from parent
  initialValues: React.PropTypes.object,
  onGenerate: React.PropTypes.func.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

function validate() {
  const errors = {};
  return errors;
}

const reduxFormConfig = {
  form: 'generateSnapshotForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        GenerateSnapshotForm
      )
    )
  );
