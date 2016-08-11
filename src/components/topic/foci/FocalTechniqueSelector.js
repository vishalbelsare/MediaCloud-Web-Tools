import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import FocalTechniqueDescription from './FocalTechniqueDescription';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY, FOCAL_TECHNIQUE_REFERENCE_SET, FOCAL_TECHNIQUE_COMMUNITY_DETECTION, FOCAL_TECHNIQUE_AUTO_MAGIC }
  from '../../../lib/focalTechniques';

const localMessages = {
  title: { id: 'focus.techniquePicker.title', defaultMessage: 'Pick a Focal Technique' },
  about: { id: 'focus.techniquePicker.about',
    defaultMessage: 'You can build a Focus using a variety of Focal Techniques; pick the one that best matches your awareness of the content and goals. You can\'t change this later.' },
  keywordName: { id: 'focus.technique.keyword.name', defaultMessage: 'Keyword Search' },
  keywordDescription: { id: 'focus.technique.keyword.description',
    defaultMessage: 'When you know a lot about the coverage, or have some hypotheses to test, you can define a Topic by specifying a boolean keyword search.' },
  referenceName: { id: 'focus.technique.reference.name', defaultMessage: 'Upload Representative Articles' },
  referenceDescription: { id: 'focus.technique.reference.description',
    defaultMessage: 'When you have a list of stories that you think define a Focus, you can upload that list and we\'ll use it to identify similar articles within this Topic.' },
  manualName: { id: 'focus.technique.manual.name', defaultMessage: 'Select a Community' },
  manualDescription: { id: 'focus.technique.manual.description',
    defaultMessage: 'When you want to slice and dice a conversation you kind of understand, we will show you a map of the sources and words and you can select a portion of the map to define as a Focus.' },
  automagicName: { id: 'focus.technique.automagic.name', defaultMessage: 'Auto-Magic' },
  automagicDescription: { id: 'focus.technique.automagic.description',
    defaultMessage: 'When you aren\'t sure what is going on, we can use an algorithm to detect communities of sub-conversations within the Topic for you, creating a Focus for each.' },
};

class FocalTechniqueSelector extends React.Component {

  selectBooleanQuery = () => { this.handleSelection(FOCAL_TECHNIQUE_BOOLEAN_QUERY); }
  selectReferenceSetUpload = () => { this.handleSelection(FOCAL_TECHNIQUE_REFERENCE_SET); }
  selectCommunityDetection = () => { this.handleSelection(FOCAL_TECHNIQUE_COMMUNITY_DETECTION); }
  selectAutoMatic = () => { this.handleSelection(FOCAL_TECHNIQUE_AUTO_MAGIC); }

  handleSelection = (focalTechniqueName) => {
    const { onSelected } = this.props;
    onSelected(focalTechniqueName);
  }

  render() {
    const { selected } = this.props;
    return (
      <div>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h3><FormattedMessage {...localMessages.title} /></h3>
          </Col>
        </Row>
        <Row>
          <Col lg={2} md={2} sm={6}>
            <FocalTechniqueDescription
              onClick={ this.selectBooleanQuery }
              selected={ selected === FOCAL_TECHNIQUE_BOOLEAN_QUERY }
              id="Boolean Query"
              image="/static/img/focal-technique-keywords-2x.png"
              nameMsg={ localMessages.keywordName }
              descriptionMsg={ localMessages.keywordDescription }
            />
          </Col>
          <Col lg={2} md={2} sm={6}>
            <FocalTechniqueDescription
              onClick={ this.selectReferenceSetUpload }
              selected={ selected === FOCAL_TECHNIQUE_REFERENCE_SET }
              id="Reference Set Upload"
              image="/static/img/focal-technique-reference-2x.png"
              nameMsg={ localMessages.referenceName }
              descriptionMsg={ localMessages.referenceDescription }
              disabled
            />
          </Col>
          <Col lg={2} md={2} sm={6}>
            <FocalTechniqueDescription
              onClick={ this.selectCommunityDetection }
              selected={ selected === FOCAL_TECHNIQUE_COMMUNITY_DETECTION }
              id="Community Selection"
              image="/static/img/focal-technique-manual-2x.png"
              nameMsg={ localMessages.manualName }
              descriptionMsg={ localMessages.manualDescription }
              disabled
            />
          </Col>
          <Col lg={2} md={2} sm={6}>
            <FocalTechniqueDescription
              onClick={ this.selectAutoMatic }
              selected={ selected === FOCAL_TECHNIQUE_AUTO_MAGIC }
              id="AutoMagic Community Detection"
              image="/static/img/focal-technique-automagic-2x.png"
              nameMsg={ localMessages.automagicName }
              descriptionMsg={ localMessages.automagicDescription }
              disabled
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
  selected: React.PropTypes.string,
  onSelected: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    FocalTechniqueSelector
  );
