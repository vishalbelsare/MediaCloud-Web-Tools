import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import FlatButton from 'material-ui/FlatButton';

const localMessages = {
  match: { id: 'topic.create.validate.match', defaultMessage: 'Yes' },
  notMatch: { id: 'topic.create.validate.notMatch', defaultMessage: 'No' },
};

class StoryRow extends React.Component {

  state = {
    selection: 'none',
  };

  handleMatch = () => {
    this.setState({ selection: 'match' });
  }

  handleNotAMatch = () => {
    this.setState({ selection: 'not-match' });
  }

  render() {
    const { story } = this.props;
    const { formatMessage, formatDate } = this.props.intl;
    console.log(story);
    // const title = maxTitleLength !== undefined ? `${story.title.substr(0, maxTitleLength)}...` : story.title;
    const storyTitle = story.title.length > 75 ? (`${story.title.substring(0, 75)}...`) : story.title;

    // button selection logic
    const matchSelectedClass = this.state.selection === 'match' ? '-selected' : '';
    const notMatchSelectedClass = this.state.selection === 'not-match' ? '-selected' : '';

    return (
      <Row className={`story ${this.state.selection}`} middle="lg">
        <Col lg={8}>
          <Row>
            <Col lg={12}>
              <b><a href={story.url} rel="noopener noreferrer" target="_blank">{storyTitle}</a></b>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              { story.media_url }
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              { formatDate(story.publish_date, { year: 'numeric', month: 'numeric', day: 'numeric' }) }
            </Col>
          </Row>
        </Col>
        <Col lg={4}>
          <Row>
            <Col lg={6}>
              <FlatButton className={`match-btn${matchSelectedClass}`} label={formatMessage(localMessages.match)} onClick={this.handleMatch} />
            </Col>
            <Col lg={6}>
              <FlatButton className={`not-match-btn${notMatchSelectedClass}`} label={formatMessage(localMessages.notMatch)} onClick={this.handleNotAMatch} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

StoryRow.propTypes = {
  // from parent
  // initialValues: PropTypes.object,
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
