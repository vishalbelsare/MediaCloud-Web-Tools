import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../../common/AppButton';
import composeIntlForm from '../../../../../common/IntlForm';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../../../actions/topicActions';
import messages from '../../../../../../resources/messages';
import KeywordSearchResultsContainer from './KeywordSearchResultsContainer';
import { notEmptyString } from '../../../../../../lib/formValidators';

const localMessages = {
  title: { id: 'focus.create.edit.title', defaultMessage: 'Step 2: Edit Your New "{name}" Focus' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: 'This Focus is driven by a keyword search.  Any stories that match to boolean query you create will be included in the Focus for analysis together.' },
  errorNoKeywords: { id: 'focalTechnique.boolean.keywords.error', defaultMessage: 'You need to specify some keywords.' },
};

const EditKeywordSearchContainer = (props) => {
  const { topicId, renderTextField, handleSubmit, handleSearchClick, finishStep, properties } = props;
  const { formatMessage } = props.intl;
  let previewContent = null;
  if ((properties.keywords !== null) && (properties.keywords !== undefined) && (properties.keywords.length > 0)) {
    previewContent = (
      <div>
        <KeywordSearchResultsContainer topicId={topicId} keywords={properties.keywords} />
        <AppButton type="submit" label={formatMessage(messages.next)} primary />
      </div>
    );
  }
  return (
    <Grid>
      <form className="focus-create-edit" name="focusCreateEditForm" onSubmit={handleSubmit(finishStep.bind(this))}>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <h2><FormattedMessage {...localMessages.title} values={{ name: properties.name }} /></h2>
            <p>
              <FormattedMessage {...localMessages.about} />
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={8} md={8} sm={10}>
            <Field
              name="keywords"
              component={renderTextField}
              floatingLabelText={messages.searchByKeywords}
            />
          </Col>
          <Col lg={2} md={2} sm={2}>
            <AppButton label={formatMessage(messages.search)} style={{ marginTop: 33 }} onClick={handleSearchClick} />
          </Col>
        </Row>
        { previewContent }
      </form>
    </Grid>
  );
};

EditKeywordSearchContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object,
  // from dispatch
  setProperties: React.PropTypes.func.isRequired,
  finishStep: React.PropTypes.func.isRequired,
  handleSearchClick: React.PropTypes.func.isRequired,
  goToStep: React.PropTypes.func.isRequired,
  // from compositional helper
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.focusCreateSetup,
});

const mapDispatchToProps = dispatch => ({
  setProperties: (properties) => {
    dispatch(setNewFocusProperties(properties));
  },
  goToStep: (step) => {
    dispatch(goToCreateFocusStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      const focusProps = {
        keywords: values.keywords,
      };
      dispatchProps.setProperties(focusProps);
      dispatchProps.goToStep(2);
    },
    handleSearchClick: () => {
      const keywords = stateProps.formData.values.keywords;
      dispatchProps.setProperties({ keywords });
    },
  });
}

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.keywords)) {
    errors.focusName = localMessages.errorNoKeywords;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'focusCreateSetup', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          EditKeywordSearchContainer
        )
      )
    )
  );
