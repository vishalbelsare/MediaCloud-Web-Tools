import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import MetadataPickerContainer from './MetadataPickerContainer';
import AppButton from '../../../common/AppButton';

const localMessages = {
  languageLabel: { id: 'collection.add.name.label', defaultMessage: 'language' },
  publicationLabel: { id: 'collection.add.description.label', defaultMessage: 'country of publication' },
  focusLabel: { id: 'collection.add.description.error', defaultMessage: 'country of focus' },
  audienceLabel: { id: 'collection.add.name.error', defaultMessage: 'audience size' },
};

const CollectionAdvancedSearchMetadataForm = (props) => {
  const { renderTextField, handleSubmit, buttonLabel, pristine, submitting, requerySourcesAndCollections } = props;
  return (
    <form className="advancedQueryForm" onSubmit={handleSubmit(requerySourcesAndCollections.bind(this))}>
      <Row>
        <Col lg={6}>
          <Field
            name="advancedSearchQueryString"
            component={renderTextField}
          />
        </Col>
        <Col lg={6}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            disabled={pristine || submitting}
            primary
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <MetadataPickerContainer id={123} name={'detectedLanguage'} label={<FormattedMessage {...localMessages.languageLabel} />} />
        </Col>
        <Col lg={3}>
          <MetadataPickerContainer id={123} name={'detectedLanguage'} label={<FormattedMessage {...localMessages.publicationLabel} />} />
        </Col>
        <Col lg={3}>
          <MetadataPickerContainer id={123} name={'detectedLanguage'} label={<FormattedMessage {...localMessages.focusLabel} />} />
        </Col>
        <Col lg={3}>
          <MetadataPickerContainer id={123} name={'detectedLanguage'} label={<FormattedMessage {...localMessages.audienceLabel} />} />
        </Col>
      </Row>
    </form>
  );
};
CollectionAdvancedSearchMetadataForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from form healper
  buttonLabel: React.PropTypes.string.isRequired,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from parent
  requerySourcesAndCollections: React.PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'advancedQueryForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        CollectionAdvancedSearchMetadataForm
      )
    )
  );
