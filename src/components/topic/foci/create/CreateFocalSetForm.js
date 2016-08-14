import React from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  focalSetName: { id: 'focalSet.name', defaultMessage: 'Focal Set Name' },
  focalSetDescription: { id: 'focalSet.description', defaultMessage: 'Focal Set Description' },
  focalSetWhy: { id: 'focalSet.why', defaultMessage: 'Give your new Focal Set a name and description so others can recognize what it is for.' },
};

export default class CreateFocalSetForm extends React.Component {

  render() {
    const { fields: { focalSetName, focalSetDescription } } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Row>
          <Col lg={4} md={4} sm={12}>
            <TextField
              floatingLabelText={formatMessage(localMessages.focalSetName)}
              errorText={focalSetName.touched ? focalSetName.error : ''}
              {...focalSetName}
            />
          </Col>
          <Col lg={4} md={4} sm={12}>
            <TextField
              floatingLabelText={formatMessage(localMessages.focalSetDescription)}
              errorText={focalSetDescription.touched ? focalSetDescription.error : ''}
              {...focalSetDescription}
            />
          </Col>
          <Col lg={2} md={2} sm={0} />
          <Col lg={2} md={2} sm={21}>
            <p className="light"><i><FormattedMessage {...localMessages.focalSetWhy} /></i></p>
          </Col>
        </Row>
      </div>
    );
  }
}

CreateFocalSetForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

function validate(values) {
  const errors = {};
  if (!values.focalSetName || values.focalSetName.trim() === '') {
    errors.focalSetName = ('You need to name this Focal Set.');
  }
  if (!values.focalSetDescription || values.focalSetDescription.trim() === '') {
    errors.focalSetDescription = ('You need to describe what kind of Foci this Focal Set is for.');
  }
  return errors;
}

const reduxFormConfig = {
  form: 'focusCreateSetup',
  fields: ['focalSetName', 'focalSetDescription'],
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  reduxForm(reduxFormConfig)(
    injectIntl(
      CreateFocalSetForm
    )
  );
