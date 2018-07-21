import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
// import FlatButton from 'material-ui/FlatButton';
// import { ReadItNowButton } from '../../../../../common/IconButton';

// const localMessages = {
//   match: { id: 'focus.create.validate.match', defaultMessage: 'Match' },
//   notMatch: { id: 'focus.create.validate.noMatch', defaultMessage: 'Not a match' },
// };

class StoryRow extends React.Component {

  state = {
    guess: 'undecided',
    selection: 'none',
  };

  handleReadItClick = (story) => {
    window.open(story.url, '_blank');
  }

  render() {
    // const { story, prob, label } = this.props;
    // const { formatMessage } = this.props.intl;

    // const storyTitle = story.title.length > 75 ? (`${story.title.substring(0, 75)}...`) : story.title;
    // NOTE: the very first sentence tends to repeat the title word-for-word...
    // let storyPreview = story.story_sentences[0] ? story.story_sentences[0].sentence : '';
    // storyPreview = storyPreview.length > 125 ? (`${storyPreview.substring(0, 125)}...`) : storyPreview;

    return (
      <Row className="story-row" middle="lg">
        <Col lg={8}>
          <Row>
            <Col lg={12}>
              { /* storyTitle */ }
              Story Title
            </Col>
          </Row>
        </Col>
        <Col lg={1}>
          { /* <ReadItNowButton onClick={this.handleReadItClick.bind(this, story)} /> */ }
          ReadItNow!
        </Col>
        <Col lg={3}>
          Check box here
        </Col>
      </Row>
    );
  }
}

StoryRow.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  story: PropTypes.object.isRequired,
  // from state
  // formData: PropTypes.object,
  // currentKeywords: PropTypes.string,
  // currentFocalTechnique: PropTypes.string,
  // from compositional helper
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    StoryRow
  );
