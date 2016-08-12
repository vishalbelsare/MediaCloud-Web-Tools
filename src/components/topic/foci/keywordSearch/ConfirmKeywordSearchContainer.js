import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { createFocalSetDefinition, setTopicNeedsNewSnapshot, createFocusDefinition }
  from '../../../../actions/topicActions';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 3: Confirm Your New "{name}" Focus' },
  name: { id: 'focus.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'focus.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Focal Technique</b>: {name}' },
  keywords: { id: 'focus.create.confirm.keywords', defaultMessage: '<b>Keywords</b>: {keywords}' },
  generateSnapshot: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Generate Snapshot' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add Another Focus' },
};

class ConfirmKeywordSearchContainer extends React.Component {

  render() {
    const { topicId, saveAndAddAnother, saveAndGenerateSnapshot, properties } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Grid>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <h2><FormattedMessage {...localMessages.title} values={ { name: properties.name } } /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <ul>
              <li><FormattedHTMLMessage {...localMessages.name} values={ { name: properties.name } } /></li>
              <li><FormattedHTMLMessage {...localMessages.description} values={ { description: properties.description } } /></li>
              <li><FormattedHTMLMessage {...localMessages.focalTechnique} values={ { name: properties.focalTechnique } } /></li>
              <li><FormattedHTMLMessage {...localMessages.keywords} values={ { keywords: properties.keywords } } /></li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={3} sm={12}>
            <FlatButton label={formatMessage(localMessages.addAnotherFocus)} onClick={ saveAndAddAnother } />
          </Col>
          <Col lg={3} md={3} sm={12}>
            <RaisedButton primary label={formatMessage(localMessages.generateSnapshot)} onClick={ saveAndGenerateSnapshot } />
          </Col>
        </Row>
      </Grid>
    );
  }

}

ConfirmKeywordSearchContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  // from dispatch
  saveFocus: React.PropTypes.func.isRequired,
  // from mergeProps
  saveAndAddAnother: React.PropTypes.func.isRequired,
  saveAndGenerateSnapshot: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.focusCreateSetup,
});

const mapDispatchToProps = (dispatch) => ({
  saveFocus: (topicId, properties) => {
    const newFocusDefinition = {
      name: properties.name,
      description: properties.description,
      query: properties.keywords,
    };
    if (properties.focalSetDefinition.focal_set_definitions_id === -1) {
      const newFocalSetDefinition = {
        name: properties.focalSetName,
        description: properties.focalSetDescription,
        focalTechnique: properties.focalTechnique,
      };
      console.log(newFocalSetDefinition);
      /*
      dispatch(createFocalSetDefinition(topicId, newFocalSetDefinition))
        .then( (results) => {
          newFocusDefinition.focalSetDefinitionsId = results.focal_set_definitions_id;
          createFocusDefinition(topicId, newFocusDefinition)
        })
        .then( (results) => {
          dispatch(setTopicNeedsNewSnapshot(true));
        });
      */
    } else {
      newFocusDefinition.focalSetDefinitionsId = properties.focalSetDefinition.focal_set_definitions_id;
      console.log(newFocusDefinition);
      /*
      createFocusDefinition(topicId, newFocusDefinition)
        .then( (results) => {
          dispatch(setTopicNeedsNewSnapshot(true));
        });
      */
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    saveAndAddAnother: () => {
      console.log('saveAndAddAnother');
      dispatchProps.saveFocus(ownProps.topicId, stateProps.properties);
      // save Focus
      // reset properties
      // go to step zero
    },
    saveAndGenerateSnapshot: (properties) => {
      console.log('saveAndGenerateSnapshot');
      // save Focus
      // generate snapshot
      // go to focus summary
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    injectIntl(
      ConfirmKeywordSearchContainer
    )
  );
