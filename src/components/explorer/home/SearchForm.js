import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import { emptyString } from '../../../lib/formValidators';
import { SearchButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'explorer.search.title', defaultMessage: 'Enter Keyword' },
  addButton: { id: 'explorer.search', defaultMessage: 'Search' },
  searchHint: { id: 'explorer.intro.searchHint', defaultMessage: 'Try searching for the names of people, places, events' },
  search: { id: 'explorer.intro.search', defaultMessage: 'Search the Media Cloud database of over 547 million stories.' },
};

const SearchForm = (props) => {
  const { handleSubmit, onSearch, renderTextField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right

  return (
    <form className="app-form search-form" name="searchForm" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col md={2} />
        <Col md={8}>
          <h2><FormattedMessage {...localMessages.search} /></h2>
        </Col>
      </Row>
      <Row>
        <Col md={2} />
        <Col md={6}>
          <Field
            name="keyword"
            className="explorer-home-search-field"
            component={renderTextField}
            hintText={localMessages.searchHint}
            fullWidth
          />
        </Col>
        <Col md={2}>
          <SearchButton onClick={handleSubmit(onSearch.bind(this))} />
        </Col>
        <Col md={2} />
      </Row>
    </form>
  );
};

SearchForm.propTypes = {
  // from parent
  onSearch: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  // from form healper
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
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
