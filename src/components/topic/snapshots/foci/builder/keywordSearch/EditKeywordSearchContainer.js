import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../../common/AppButton';
import composeIntlForm from '../../../../../common/IntlForm';
import messages from '../../../../../../resources/messages';
import KeywordSearchResultsContainer from './KeywordSearchResultsContainer';
import { notEmptyString } from '../../../../../../lib/formValidators';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.edit.title', defaultMessage: 'Step 2: Configure Your {technique} Focus' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: 'This Focus is driven by a keyword search.  Any stories that match to boolean query you create will be included in the Focus for analysis together.' },
  errorNoKeywords: { id: 'focalTechnique.boolean.keywords.error', defaultMessage: 'You need to specify some keywords.' },
};


class EditKeywordSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { keywords: null };
  }

  render() {
    const { topicId, renderTextField, currentKeywords, currentFocalTechnique, handleSubmit, onPreviousStep, finishStep } = this.props;
    const { formatMessage } = this.props.intl;
    let previewContent = null;
    let nextButtonDisabled = true;
    if ((this.state.keywords !== null) && (this.state.keywords !== undefined) && (this.state.keywords.length > 0)) {
      nextButtonDisabled = false;
      previewContent = (
        <div>
          <KeywordSearchResultsContainer topicId={topicId} keywords={this.state.keywords} />
        </div>
      );
    }
    return (
      <Grid>
        <form className="focus-create-edit" name="focusCreateEditForm" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10}>
              <h2><FormattedMessage {...localMessages.title} values={{ technique: currentFocalTechnique }} /></h2>
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
              <AppButton
                label={formatMessage(messages.search)}
                style={{ marginTop: 33 }}
                onClick={() => this.setState({ keywords: currentKeywords })}
              />
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
  }

}

EditKeywordSearchContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  onPreviousStep: React.PropTypes.func.isRequired,
  onNextStep: React.PropTypes.func.isRequired,
  // from state
  formData: React.PropTypes.object,
  currentKeywords: React.PropTypes.string,
  currentFocalTechnique: React.PropTypes.string,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  // from compositional helper
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form.snapshotFocus,
  currentKeywords: formSelector(state, 'keywords'),
  currentFocalTechnique: formSelector(state, 'focalTechnique'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finishStep: (values) => {
    const customProps = {
      keywords: values.keywords,
    };
    ownProps.onNextStep(customProps);
  },
});

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
        connect(mapStateToProps, mapDispatchToProps)(
          EditKeywordSearchContainer
        )
      )
    )
  );
