import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';


const localMessages = {
  title: { id: 'source.addmeta.title', defaultMessage: 'Source Metadata' },
  language: { id: 'source.addmeta.updateUser', defaultMessage: 'Language' },
  country: { id: 'source.addmeta.url', defaultMessage: 'Country of Publication' },
  location: { id: 'source.addmeta.location', defaultMessage: 'Location Data' },
};

const sourceAddMetaForm = (props) => {
  const { renderSelectField, meta, countries } = props;
  let content = {};

  if (countries !== undefined && countries !== null) {
    content =
      (<Col lg={2} md={2} sm={2}>
        <Field name="countryA" component={renderSelectField} floatingLabelText={localMessages.country}>
          {countries.map(country =>
            <MenuItem
              key={country.key}
              value={country.hc}
              primaryText={country.name}
            />
        )}
        </Field>
      </Col>);
  }
  return (
    <div>
      <Row>
        <Col lg={4} md={4} sm={4}>
          <h3><FormattedMessage {...localMessages.language} /></h3>
        </Col>
        <Col lg={2} md={2} sm={2}>
          <Field name="languageA" component={renderSelectField} floatingLabelText={localMessages.language}>
            <MenuItem key="language1" value={meta.language1} primaryText="dummylang1" />
          </Field>
        </Col>
        <Col lg={4} md={4} sm={4}>
          <h3><FormattedMessage {...localMessages.language} /></h3>
        </Col>
        <Col lg={2} md={2} sm={2}>
          <Field name="languageB" component={renderSelectField} floatingLabelText={localMessages.language}>
            <MenuItem key="language1" value="language" primaryText="dummylang1" />
          </Field>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={4} sm={4}>
          <h3><FormattedMessage {...localMessages.country} /></h3>
        </Col>
        {content}
        <Col lg={4} md={4} sm={4}>
          <h3><FormattedMessage {...localMessages.country} /></h3>
        </Col>
        {content}
      </Row>
      <Row>
        <Col lg={4} md={4} sm={4}>
          <h3><FormattedMessage {...localMessages.location} /></h3>
        </Col>
        <Col lg={2} md={2} sm={2}>
          <Field name="locationA" component={renderSelectField} floatingLabelText={localMessages.location} />
        </Col>
        <Col lg={4} md={4} sm={4}>
          <h3><FormattedMessage {...localMessages.location} /></h3>
        </Col>
        <Col lg={2} md={2} sm={2}>
          <Field name="locationA" component={renderSelectField} floatingLabelText={localMessages.location} />
        </Col>
      </Row>
    </div>
  );
};

sourceAddMetaForm.propTypes = {
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
  meta: React.PropTypes.object,
  countries: React.PropTypes.array,
};

function validate() {
  const errors = {};
  errors.error = "don't know yet";
  return errors;
}

const reduxFormConfig = {
  form: 'sourceCreateForm', // make sure this matches the sub-components and other wizard steps
  fields: ['languageA', 'languageB', 'countryA', 'countryB', 'location'],
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        sourceAddMetaForm
      )
    )
  );
