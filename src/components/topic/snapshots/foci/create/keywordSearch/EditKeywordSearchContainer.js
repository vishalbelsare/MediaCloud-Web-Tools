import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../../common/AppButton';
import composeIntlForm from '../../../../../common/IntlForm';
import messages from '../../../../../../resources/messages';
import { setNewFocusProperties } from '../../../../../../actions/topicActions';
import KeywordSearchResultsContainer from './KeywordSearchResultsContainer';
import { notEmptyString } from '../../../../../../lib/formValidators';

const localMessages = {
  title: { id: 'focus.create.edit.title', defaultMessage: 'Step 2: Configure Your {technique} Focus' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: 'This Focus is driven by a keyword search.  Any stories that match to boolean query you create will be included in the Focus for analysis together.' },
  errorNoKeywords: { id: 'focalTechnique.boolean.keywords.error', defaultMessage: 'You need to specify some keywords.' },
};

const EditKeywordSearchContainer = (props) => {
  const { topicId, renderTextField, handleSubmit, handleSearchClick, onPreviousStep, finishStep, properties } = props;
  const { formatMessage } = props.intl;
  let previewContent = null;
  let nextButtonDisabled = true;
  if ((properties.keywords !== null) && (properties.keywords !== undefined) && (properties.keywords.length > 0)) {
    nextButtonDisabled = false;
    previewContent = (
      <div>
        <KeywordSearchResultsContainer topicId={topicId} keywords={properties.keywords} />
      </div>
    );
  }
  return (
    <Grid>
      <form className="focus-create-edit" name="focusCreateEditForm" onSubmit={handleSubmit(finishStep.bind(this))}>
        <Row>
          <Col lg={10}>
            <h2><FormattedMessage {...localMessages.title} values={{ technique: properties.focalTechnique }} /></h2>
            <p>
              <FormattedMessage {...localMessages.about} />
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={8} xs={12}>
            <Field
              name="keywords"
              component={renderTextField}
              floatingLabelText={messages.searchByKeywords}
              fullWidth
            />
          </Col>
          <Col lg={2} xs={12}>
            <AppButton label={formatMessage(messages.search)} style={{ marginTop: 33 }} onClick={handleSearchClick} />
          </Col>
        </Row>
        { previewContent }
        <Row>
          <Col lg={8} xs={12}>
            <br />
            <AppButton onClick={onPreviousStep} label={formatMessage(messages.previous)} />
            &nbsp; &nbsp;
            <AppButton disabled={nextButtonDisabled} type="submit" label={formatMessage(messages.next)} primary />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

EditKeywordSearchContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  onPreviousStep: React.PropTypes.func.isRequired,
  onNextStep: React.PropTypes.func.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  handleSearchClick: React.PropTypes.func.isRequired,
  // from compositional helper
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.snapshotFocus,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finishStep: (values) => {
    const customProps = {
      keywords: values.keywords,
    };
    ownProps.onNextStep(customProps);
  },
  setProperties: (customProperties) => {
    dispatch(setNewFocusProperties(customProperties));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
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
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
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
