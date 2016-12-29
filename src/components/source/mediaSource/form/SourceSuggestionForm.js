import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';

const localMessages = {
  nameLabel: { id: 'source.suggest.name.label', defaultMessage: 'Name of Suggested Source' },
  urlLabel: { id: 'source.suggest.url.label', defaultMessage: 'URL of Suggested Source(required)' },
  feedUrlLabel: { id: 'source.suggest.feedurl.label', defaultMessage: 'URL of feed' },
  reasonLabel: { id: 'source.suggest.reasons.label', defaultMessage: 'Reasons for Suggestion' },
  addLabel: { id: 'source.suggest.collection.label', defaultMessage: 'Add to these Collection' },
  nameError: { id: 'source.suggest.name.error', defaultMessage: 'You have to enter a name for this source.' },
  urlError: { id: 'source.suggest.url.error', defaultMessage: 'Pick have to enter a url for this source.' },
};

const SourceSuggestionForm = (props) => {
  const { renderTextField } = props;
  return (
    <div className="app-form">
      <Row>
        <Col md={3}>
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
        <Col md={3}>
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
        <Col md={3}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.feedUrlLabel} />
          </span>
        </Col>
        <Col md={4}>
          <Field
            name="feedurl"
            component={renderTextField}
          />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.reasonLabel} />
          </span>
        </Col>
        <Col md={7}>
          <Field
            name="reason"
            component={renderTextField}
            fullWidth
          />
        </Col>
      </Row>
    </div>
  );
};

SourceSuggestionForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
};

const reduxFormConfig = {
  form: 'suggestionForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SourceSuggestionForm
      )
    )
  );
