import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import composeIntlForm from '../../../common/IntlForm';
import AppButton from '../../../common/AppButton';

const localMessages = {
  nameLabel: { id: 'source.feed.add.name.label', defaultMessage: 'Name of Source' },
  urlLabel: { id: 'source.feed.add.url.label', defaultMessage: 'URL' },
  type: { id: 'source.feed.add.type', defaultMessage: 'Type' },
  typeSyndicated: { id: 'source.feed.add.type.syndicated', defaultMessage: 'Syndicated' },
  typeWebPage: { id: 'source.feed.add.type.webpage', defaultMessage: 'Web Page' },
  status: { id: 'source.feed.add.status', defaultMessage: 'Status' },
  statusActive: { id: 'source.feed.add.status.active', defaultMessage: 'Active' },
  statusInactive: { id: 'source.feed.add.status.inactive', defaultMessage: 'Inactive' },
  statusSkipped: { id: 'source.feed.add.status.skipped', defaultMessage: 'Skipped' },
  nameError: { id: 'source.feed.add.name.error', defaultMessage: 'You have to enter a name for this source.' },
  urlError: { id: 'source.feed.add.url.error', defaultMessage: 'You have to enter a url for this source.' },
};

const SourceFeedForm = (props) => {
  const { renderTextField, renderSelectField, buttonLabel, handleSubmit, onSave, saveFeed } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="app-form source-feed-form" name="sourceFeedForm" onSubmit={handleSubmit(onSave.bind(this))}>
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
        <Col md={4}>
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
          <Field name="type" component={renderSelectField} floatingLabelText={localMessages.type}>
            <MenuItem value="syndicated" primaryText={localMessages.typeSydicated} />
            <MenuItem value="web_page" primaryText={localMessages.typeWebPage} />
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
          <Field name={name} component={renderSelectField} floatingLabelText={localMessages.status}>
            <MenuItem value="Active" primaryText={localMessages.statusActive} />
            <MenuItem value="Inactive" primaryText={localMessages.statusInactive} />
            <MenuItem value="Skipped" primaryText={localMessages.statusSkipped} />
          </Field>
        </Col>
      </Row>
      <AppButton
        className="source-feed-updated"
        label={formatMessage(buttonLabel)}
        primary
        onClick={saveFeed}
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
  saveFeed: React.PropTypes.func.isRequired,
  buttonLabel: React.PropTypes.string.isRequired,
};

const reduxFormConfig = {
  form: 'sourceFeedForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SourceFeedForm
      )
    )
  );
