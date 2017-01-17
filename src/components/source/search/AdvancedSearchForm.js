import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import MetadataPickerContainer from '../../common/MetadataPickerContainer';
import AppButton from '../../common/AppButton';
import { TAG_SET_PUBLICATION_COUNTRY } from '../../../lib/tagUtil';

const localMessages = {
  searchSuggestion: { id: 'search.advanced.searchTip', defaultMessage: 'match these words' },
  pubCountrySuggestion: { id: 'search.advanced.pubCountryTip', defaultMessage: 'published in' },
};

const AdvancedSearchForm = (props) => {
  const { initialValues, renderTextField, handleSubmit, buttonLabel, pristine, submitting, onSearch } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="advanced-search-form" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col lg={10}>
          <Field
            name="advancedSearchQueryString"
            value={initialValues}
            component={renderTextField}
            floatingLabelText={formatMessage(localMessages.searchSuggestion)}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <MetadataPickerContainer
            id={TAG_SET_PUBLICATION_COUNTRY}
            name={'publicationCountry'}
            form="advancedQueryForm"
            floatingLabelText={formatMessage(localMessages.pubCountrySuggestion)}
            autocomplete
          />
        </Col>
        <Col lg={2}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            disabled={pristine || submitting}
            primary
          />
        </Col>
      </Row>
    </form>
  );
};

AdvancedSearchForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from form healper
  initialValues: React.PropTypes.object,
  buttonLabel: React.PropTypes.string.isRequired,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from parent
  onSearch: React.PropTypes.func.isRequired,
  searchString: React.PropTypes.string,
};

const reduxFormConfig = {
  form: 'advancedQueryForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        AdvancedSearchForm
      )
    )
  );
