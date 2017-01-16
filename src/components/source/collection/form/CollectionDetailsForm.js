import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';

const localMessages = {
  nameLabel: { id: 'collection.add.name.label', defaultMessage: 'Name' },
  descriptionLabel: { id: 'collection.add.description.label', defaultMessage: 'Description' },
  staticLabel: { id: 'collection.add.static.label', defaultMessage: 'Static' },
  showOnStoriesLabel: { id: 'collection.add.showOnStories.label', defaultMessage: 'Show on Stories' },
  showOnMediaLabel: { id: 'collection.add.showOnMedia.label', defaultMessage: 'Show on Media' },
  descriptionError: { id: 'collection.add.description.error', defaultMessage: 'You have to enter a description for this collection.' },
  nameError: { id: 'collection.add.name.error', defaultMessage: 'You have to enter a name for this collection.' },
};

const CollectionDetailsForm = (props) => {
  const { renderTextField, renderCheckbox, initialValues } = props;
  return (
    <div className="collection-details-form">
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.nameLabel} />
          </span>
        </Col>
        <Col md={11}>
          <Field
            name="name"
            component={renderTextField}
            disabled={initialValues.disabled}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.descriptionLabel} />
          </span>
        </Col>
        <Col md={11}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Field
            name="static"
            component={renderCheckbox}
            fullWidth
            label={localMessages.staticLabel}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Field
            name="showOnMedia"
            component={renderCheckbox}
            fullWidth
            label={localMessages.showOnMediaLabel}
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Field
            name="showOnStories"
            component={renderCheckbox}
            fullWidth
            disabled={initialValues.disabled}
            label={localMessages.showOnStoriesLabel}
          />
        </Col>
      </Row>
    </div>
  );
};

CollectionDetailsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func,
  initialValues: React.PropTypes.object,
};

const reduxFormConfig = {
  form: 'collectionForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        CollectionDetailsForm
      )
    )
  );
