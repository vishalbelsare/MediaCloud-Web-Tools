import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import AppButton from '../../../common/AppButton';

const localMessages = {
  title: { id: 'collection.addmedia.title', defaultMessage: 'Add Media' },
  sourceName: { id: 'collection.addmedia.updateUser', defaultMessage: 'Individual Source Name' },
  sourceUrl: { id: 'collection.addmedia.url', defaultMessage: 'Individual Source URL' },
  searchAll: { id: 'collection.addmedia.search', defaultMessage: 'Search existing Sources and Collections' },
  uploadButton: { id: 'collection.addmedia.uploadbutton', defaultMessage: 'Upload Spread Sheet' },
  addButton: { id: 'collection.addmedia.addbutton', defaultMessage: 'Add Source' },
};

const CollectionAddMediaForm = (props) => {
  const { renderTextField } = props;
  const { formatMessage } = props.intl;
  const uploadSpreadSheetLabel = formatMessage(localMessages.uploadButton);
  const buttonLabel = formatMessage(localMessages.addButton);

  return (
    <div>
      <Row>
        <Col lg={2} md={2} sm={2} xs={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type=""
            label={uploadSpreadSheetLabel}
            primary
          />
        </Col>
      </Row>
      <Row>
        <Col lg={5} md={5} sm={5}>
          <h3><FormattedMessage {...localMessages.sourceName} /></h3>
        </Col>
        <Col lg={5} md={5} sm={5}>
          <Field
            name="sourceName"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.sourceName}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={5} md={5} sm={5}>
          <h3><FormattedMessage {...localMessages.sourceUrl} /></h3>
        </Col>
        <Col lg={5} md={5} sm={5}>
          <Field
            name="sourceUrl"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.sourceURL}
          />
        </Col>
        <Col lg={2} md={2} sm={2} xs={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            primary
          />
        </Col>
      </Row>
    </div>
  );
};

CollectionAddMediaForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from form helper
  handleSubmit: React.PropTypes.func,
  fields: React.PropTypes.array.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from parent
  onSave: React.PropTypes.func,
};

function validate() {
  const errors = {};
  errors.error = "don't know yet";
  return errors;
}

const reduxFormConfig = {
  form: 'collectionCreateForm', // make sure this matches the sub-components and other wizard steps
  fields: ['sourceName', 'sourceUrl'],
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        CollectionAddMediaForm
      )
    )
  );
