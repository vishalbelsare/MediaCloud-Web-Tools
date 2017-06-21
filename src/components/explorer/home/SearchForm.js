import React from 'react';
import { injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import { emptyString } from '../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'explorer.search.title', defaultMessage: 'Enter Keyword' },
  addButton: { id: 'explorer.search', defaultMessage: 'Search' },
};

const SearchForm = (props) => {
  const { initialValues, handleSubmit, onSearch, renderTextField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right

  return (
    <form className="app-form search-form" name="searchForm" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col md={10}>
          <Field
            name="keyword"
            initialValues={initialValues}
            component={renderTextField}
            fullWidth
          />
        </Col>
        <Col lg={1}>
        ?
        </Col>
      </Row>
    </form>
  );
};

SearchForm.propTypes = {
  // from parent
  onSearch: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from form healper
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

function validate(values) {
  const errors = {};
  if (emptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
  if (emptyString(values.url)) {
    errors.url = localMessages.urlError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'SearchForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SearchForm
      ),
    ),
  );
