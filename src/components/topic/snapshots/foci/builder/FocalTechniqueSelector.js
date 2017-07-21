import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import KeywordSearchIcon from '../../../../common/icons/KeywordSearchIcon';
import FocalTechniqueDescription from './FocalTechniqueDescription';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY, FOCAL_TECHNIQUE_REFERENCE_SET, FOCAL_TECHNIQUE_COMMUNITY_DETECTION, FOCAL_TECHNIQUE_AUTO_MAGIC }
  from '../../../../../lib/focalTechniques';
import { assetUrl } from '../../../../../lib/assetUtil';

const localMessages = {
  about: { id: 'focus.techniquePicker.about',
    defaultMessage: 'You can build a Subtopic using a variety of Techniques; pick the one that best matches your awareness of the content and goals. You can\'t change this later.' },
  keywordName: { id: 'focus.technique.keyword.name', defaultMessage: 'Keyword Search' },
  keywordDescription: { id: 'focus.technique.keyword.description',
    defaultMessage: 'When you know a lot about the coverage, or have some hypotheses to test, you can define a Subtopic by specifying a boolean keyword search.' },
  referenceName: { id: 'focus.technique.reference.name', defaultMessage: 'Upload Representative Articles' },
  referenceDescription: { id: 'focus.technique.reference.description',
    defaultMessage: 'When you have a list of stories that you think define a Subtopic, you can upload that list and we\'ll use it to identify similar articles within this Subtopic.' },
  manualName: { id: 'focus.technique.manual.name', defaultMessage: 'Select a Community' },
  manualDescription: { id: 'focus.technique.manual.description',
    defaultMessage: 'When you want to slice and dice a conversation you kind of understand, we will show you a map of the sources and words and you can select a portion of the map to define as a Subtopic.' },
  automagicName: { id: 'focus.technique.automagic.name', defaultMessage: 'Auto-Magic' },
  automagicDescription: { id: 'focus.technique.automagic.description',
    defaultMessage: 'When you aren\'t sure what is going on, we can use an algorithm to detect communities of sub-conversations within the Topic for you, creating a Subtopic for each.' },
};

const formSelector = formValueSelector('snapshotFocus');

class FocalTechniqueSelector extends React.Component {

  selectBooleanQuery = () => { this.handleSelection(FOCAL_TECHNIQUE_BOOLEAN_QUERY); }
  selectReferenceSetUpload = () => { this.handleSelection(FOCAL_TECHNIQUE_REFERENCE_SET); }
  selectCommunityDetection = () => { this.handleSelection(FOCAL_TECHNIQUE_COMMUNITY_DETECTION); }
  selectAutoMatic = () => { this.handleSelection(FOCAL_TECHNIQUE_AUTO_MAGIC); }

  handleSelection = (focalTechniqueName) => {
    const { change } = this.props;
    change('focalTechnique', focalTechniqueName);
  }

  render() {
    const { currentFocalTechnique } = this.props;
    return (
      <div className="focal-technique-selector">
        <Row>
          <Col lg={2} md={2} sm={3} xs={6}>
            <FocalTechniqueDescription
              onClick={this.selectBooleanQuery}
              selected={currentFocalTechnique === FOCAL_TECHNIQUE_BOOLEAN_QUERY}
              id="Boolean Query"
              icon={KeywordSearchIcon}
              nameMsg={localMessages.keywordName}
              descriptionMsg={localMessages.keywordDescription}
            />
          </Col>
          <Col lg={2} md={2} sm={3} xs={6}>
            <FocalTechniqueDescription
              onClick={this.selectReferenceSetUpload}
              selected={currentFocalTechnique === FOCAL_TECHNIQUE_REFERENCE_SET}
              id="Reference Set Upload"
              image={assetUrl('/static/img/focal-technique-reference-2x.png')}
              nameMsg={localMessages.referenceName}
              descriptionMsg={localMessages.referenceDescription}
              disabled
              comingSoon
            />
          </Col>
          <Col lg={2} md={2} sm={3} xs={6}>
            <FocalTechniqueDescription
              onClick={this.selectCommunityDetection}
              selected={currentFocalTechnique === FOCAL_TECHNIQUE_COMMUNITY_DETECTION}
              id="Community Selection"
              image={assetUrl('/static/img/focal-technique-manual-2x.png')}
              nameMsg={localMessages.manualName}
              descriptionMsg={localMessages.manualDescription}
              disabled
              comingSoon
            />
          </Col>
          <Col lg={2} md={2} sm={3} xs={6}>
            <FocalTechniqueDescription
              onClick={this.selectAutoMatic}
              selected={currentFocalTechnique === FOCAL_TECHNIQUE_AUTO_MAGIC}
              id="AutoMagic Community Detection"
              image={assetUrl('/static/img/focal-technique-automagic-2x.png')}
              nameMsg={localMessages.automagicName}
              descriptionMsg={localMessages.automagicDescription}
              disabled
              comingSoon
            />
          </Col>
          <Col lg={2} md={2} sm={0} />
          <Col lg={2} md={2} sm={12}>
            <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
          </Col>
        </Row>
      </div>
    );
  }

}

FocalTechniqueSelector.propTypes = {
  // from parent
  // from componsition chain
  intl: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  // from state
  currentFocalTechnique: PropTypes.string,
};

const mapStateToProps = state => ({
  // pull the focal set id out of the form so we know when to show the focal set create sub form
  currentFocalTechnique: formSelector(state, 'focalTechnique'),
});

function validate() {
  const errors = {};
  return errors;
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};


export default
  injectIntl(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps)(
        FocalTechniqueSelector
      )
    )
  );
