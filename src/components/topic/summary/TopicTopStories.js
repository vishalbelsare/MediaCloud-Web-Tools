import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import messages from '../../../resources/messages';

class TopicTopStories extends React.Component {

  getStyles() {
    const styles = {
      scrollWrapper: {
        overflow: 'scroll',
        height: 300,
        display: 'block',
      },
    };
    return styles;
  }

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { stories, topicId } = this.props;
    const styles = this.getStyles();
    return (
      <div>
        <table className="small">
          <tbody style={styles.scrollWrapper}>
            <tr>
              <th><FormattedMessage {...messages.storyTitle} /></th>
              <th><FormattedMessage {...messages.media} /></th>
              <th><FormattedMessage {...messages.storyDate} /></th>
              <th><a href="#" onClick={ e => {e.preventDefault(); this.sortByInlinks();}}>
                <FormattedMessage {...messages.inlinks} /></a>
              </th>
              <th><FormattedMessage {...messages.outlinks} /></th>
              <th><a href="#" onClick={ e => {e.preventDefault(); this.sortBySocial();}}>
                <FormattedMessage {...messages.clicks} /></a>
              </th>
            </tr>
            {stories.map(story =>
              (<tr key={story.stories_id}>
                <td><a href={story.url}>{story.title}</a></td>
                <td><a href={story.media_url}>{story.media_name}</a></td>
                <td>{story.publish_date}</td>
                <td>{story.inlink_count}</td>
                <td>{story.outlink_count}</td>
                <td>{story.bitly_click_count}</td>
              </tr>)
            )}
          </tbody>
        </table>
        <Link to={`/topics/${topicId}/stories`} style={styles.name}><FormattedMessage {...messages.details} /></Link>
      </div>
    );
  }

}

TopicTopStories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeSort: React.PropTypes.func.isRequired,
  sortedBy: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.number.isRequired,
};

export default injectIntl(TopicTopStories);
