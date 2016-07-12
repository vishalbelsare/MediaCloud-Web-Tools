import React from 'react';
import { injectIntl } from 'react-intl';
import Paper from 'material-ui/Paper';

class StoryDetails extends React.Component {
  getStyles() {
    const styles = {
      root: {

      },
      contentWrapper: {
        padding: 10,
      },
      actionButtons: {
        float: 'right',
      },
    };
    return styles;
  }
  render() {
    const { story } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <ul>
              <li>{story.publish_date}</li>
              <li><a href={story.url}>{story.url}</a></li>
              <li>Media Id: {story.media_id}</li>
              <li>Bit.ly: {story.process_with_bitly}</li>
            </ul>
          </div>
        </Paper>
      </div>
    );
  }
}

StoryDetails.propTypes = {
  story: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(StoryDetails);
