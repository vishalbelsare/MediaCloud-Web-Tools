import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';

const localMessages = {
  nameLabel: { id: 'source.add.name.label', defaultMessage: 'Name of Source' },
  urlLabel: { id: 'source.add.url.label', defaultMessage: 'URL' },
  notesLabel: { id: 'source.add.notes.label', defaultMessage: 'Editor\'s Notes' },
  nameError: { id: 'source.add.name.error', defaultMessage: 'You have to enter a name for this source.' },
  urlError: { id: 'source.add.url.error', defaultMessage: 'Pick have to enter a url for this source.' },
};

const SourceDetailsForm = (props) => {
  const { renderTextField } = props;
  return (
    <div className="source-details-form">
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.nameLabel} />
          </span>
        </Col>
        <Col md={4}>
          <Field
            name="name"
            component={renderTextField}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.urlLabel} />
          </span>
        </Col>
        <Col md={4}>
          <Field
            name="url"
            component={renderTextField}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.notesLabel} />
          </span>
        </Col>
        <Col md={8}>
          <Field
            name="notes"
            component={renderTextField}
            fullWidth
          />
        </Col>
      </Row>
    </div>
  );
};

SourceDetailsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
};

const reduxFormConfig = {
  form: 'sourceForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SourceDetailsForm
      )
    )
  );
