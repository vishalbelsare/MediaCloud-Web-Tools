import React from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setNewFocusProperties, fetchCreateFocusKeywordStories } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import KeywordSearchResultsContainer from './KeywordSearchResultsContainer';

const localMessages = {
  title: { id: 'focus.create.edit.title', defaultMessage: 'Step 2: Edit Your New "{name}" Focus' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: 'This Focus is driven by a keyword search.  Any stories that match to boolean query you create will be included in the Focus for analysis together.' },
};

class CreateFocusEditContainer extends React.Component {

  render() {
    const { fields: { keywords }, topicId, handleSubmit, handleSearchClick, finishStep, properties } = this.props;
    const { formatMessage } = this.props.intl;
    let previewContent = null;
    if ((properties.keywords !== null) && (properties.keywords !== undefined) && (properties.keywords.length > 0)) {
      previewContent = <KeywordSearchResultsContainer topicId={topicId} keywords={properties.keywords} />;
    }
    return (
      <Grid>
        <form className="focus-create-edit" name="focusCreateEditForm" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10} md={10} sm={10}>
              <h2><FormattedMessage {...localMessages.title} values={ { name: properties.name } }/></h2>
              <p>
                <FormattedMessage {...localMessages.about} />
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={8} md={8} sm={10}>
              <TextField
                floatingLabelText={ formatMessage(messages.searchByKeywords) }
                errorText={keywords.touched ? keywords.error : ''}
                fullWidth
                {...keywords}
              />
            </Col>
            <Col lg={2} md={2} sm={2}>
              <RaisedButton label={formatMessage(messages.search)} style={ { marginTop: 33 } } onClick={ handleSearchClick } />
            </Col>
          </Row>
          { previewContent }
        </form>
      </Grid>
    );
  }

}

CreateFocusEditContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from form helper
  fields: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object,
  // from dispatch
  setProperties: React.PropTypes.func.isRequired,
  finishStep: React.PropTypes.func.isRequired,
  handleSearchClick: React.PropTypes.func.isRequired,
  // from LoginForm helper
  handleSubmit: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.focusCreateSetup,
});

const mapDispatchToProps = (dispatch) => ({
  setProperties: (properties) => {
    dispatch(setNewFocusProperties(properties));
  },
  searchForStories: (q) => {
    dispatch(fetchCreateFocusKeywordStories(q));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      const focusProps = {
        keywords: values.keywords,
      };
      dispatchProps.setProperties(focusProps);
    },
    handleSearchClick: () => {
      const keywords = stateProps.formData.keywords.value;
      dispatchProps.setProperties({ keywords });
      dispatchProps.searchForStories(keywords);
    },
  });
}

function validate(values) {
  const errors = {};
  if (!values.focusName || values.focusName.trim() === '') {
    errors.focusName = ('You need to name your Focus.');
  }
  return errors;
}

const reduxFormConfig = {
  form: 'focusCreateSetup',
  fields: ['keywords'],
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps, mergeProps)(
    injectIntl(
      CreateFocusEditContainer
    )
  );
