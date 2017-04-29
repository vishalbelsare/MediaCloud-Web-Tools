import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import composeIntlForm from '../../../common/IntlForm';
import AppButton from '../../../common/AppButton';
import { emptyString, invalidUrl } from '../../../../lib/formValidators';
import messages from '../../../../resources/messages';

const localMessages = {
  nameLabel: { id: 'source.feed.add.name.label', defaultMessage: 'Name of Feed' },
  urlLabel: { id: 'source.feed.add.url.label', defaultMessage: 'URL' },
  type: { id: 'source.feed.add.type', defaultMessage: 'Type' },
  typeSyndicated: { id: 'source.feed.add.type.syndicated', defaultMessage: 'Syndicated' },
  typeWebPage: { id: 'source.feed.add.type.webpage', defaultMessage: 'Web Page' },
  status: { id: 'source.feed.add.status', defaultMessage: 'Status' },
  statusActive: { id: 'source.feed.add.status.active', defaultMessage: 'Active' },
  statusInactive: { id: 'source.feed.add.status.inactive', defaultMessage: 'Inactive' },
  statusSkipped: { id: 'source.feed.add.status.skipped', defaultMessage: 'Skipped' },
  urlInvalid: { id: 'source.feed.url.invalid', defaultMessage: 'That isn\'t a valid feed URL. Please enter just the full url of one RSS or Atom feed.' },
};

const SourceFeedForm = (props) => {
  const { renderTextField, renderSelectField, buttonLabel, handleSubmit, onSave, pristine, submitting } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="app-form source-feed-form" name="sourceFeedForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.nameLabel} />
          </span>
        </Col>
        <Col md={8}>
          <Field
            name="name"
            component={renderTextField}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.urlLabel} />
          </span>
        </Col>
        <Col md={8}>
          <Field
            name="url"
            component={renderTextField}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.type} />
          </span>
        </Col>
        <Col md={8}>
          <Field name="feed_type" component={renderSelectField} >
            <MenuItem key="syndicated" value="syndicated" primaryText={formatMessage(localMessages.typeSyndicated)} />
            <MenuItem key="web_page" value="web_page" primaryText={formatMessage(localMessages.typeWebPage)} />
          </Field>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.status} />
          </span>
        </Col>
        <Col md={8}>
          <Field name="feed_status" value="active" component={renderSelectField} >
            <MenuItem value="active" primaryText={formatMessage(localMessages.statusActive)} />
            <MenuItem value="inactive" primaryText={formatMessage(localMessages.statusInactive)} />
            <MenuItem value="skipped" primaryText={formatMessage(localMessages.statusSkipped)} />
          </Field>
        </Col>
      </Row>
      <AppButton
        className="source-feed-updated"
        type="submit"
        label={buttonLabel}
        primary
        disabled={pristine || submitting}
      />
    </form>
  );
};

SourceFeedForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  onSave: React.PropTypes.func.isRequired,
  buttonLabel: React.PropTypes.string.isRequired,
};

function validate(values) {
  const errors = {};
  if (emptyString(values.feed_status)) {
    errors.feed_status = messages.required;
  }
  if (emptyString(values.feed_type)) {
    errors.feed_type = messages.required;
  }
  if (emptyString(values.name)) {
    errors.name = messages.required;
  }
  if (emptyString(values.url)) {
    errors.url = messages.required;
  }
  if (invalidUrl(values.url)) {
    errors.url = localMessages.urlInvalid;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'sourceFeedForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SourceFeedForm
      )
    )
  );
