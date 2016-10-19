import React from 'react';
import { FormattedMessage, FormattedNumber, FormattedDate, injectIntl } from 'react-intl';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import messages from '../../resources/messages';
import LinkWithFilters from './LinkWithFilters';
import { storyPubDateToTimestamp } from '../../lib/dateUtil';

const ICON_STYLE = { margin: 0, padding: 0, width: 12, height: 12 };

class StoryTable extends React.Component {

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { stories, onChangeSort, topicId, sortedBy } = this.props;
    const { formatMessage } = this.props.intl;
    let inlinkHeader = null;
    let socialHeader = null;
    if ((onChangeSort !== undefined) && (onChangeSort !== null)) {
      if (sortedBy === 'inlink') {
        inlinkHeader = (
          <div>
            <FormattedMessage {...messages.mediaInlinks} />
            <ArrowDropDownIcon style={ICON_STYLE} />
          </div>
        );
      } else {
        inlinkHeader = (
          <a
            href={`#${formatMessage(messages.sortByMediaInlinks)}`}
            onClick={(e) => { e.preventDefault(); this.sortByInlinks(); }}
            title={formatMessage(messages.sortByMediaInlinks)}
          >
            <FormattedMessage {...messages.mediaInlinks} />
          </a>
        );
      }
      if (sortedBy === 'social') {
        socialHeader = (
          <div>
            <FormattedMessage {...messages.bitlyClicks} />
            <ArrowDropDownIcon style={ICON_STYLE} />
          </div>
        );
      } else {
        socialHeader = (
          <a
            href={`#${formatMessage(messages.sortByBitlyClicks)}`}
            onClick={(e) => { e.preventDefault(); this.sortBySocial(); }}
            title={formatMessage(messages.sortByBitlyClicks)}
          >
            <FormattedMessage {...messages.bitlyClicks} />
          </a>
        );
      }
    } else {
      inlinkHeader = <FormattedMessage {...messages.mediaInlinks} />;
      socialHeader = <FormattedMessage {...messages.bitlyClicks} />;
    }
    return (
      <div>
        <table width="100%">
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.storyTitle} /></th>
              <th><FormattedMessage {...messages.media} /></th>
              <th><FormattedMessage {...messages.storyDate} /></th>
              <th>{inlinkHeader}</th>
              <th><FormattedMessage {...messages.outlinks} /></th>
              <th>{socialHeader}</th>
              <th><FormattedMessage {...messages.facebookShares} /></th>
            </tr>
            {stories.map((story, idx) =>
              (<tr key={story.stories_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                <td>
                  <LinkWithFilters to={`/topics/${topicId}/stories/${story.stories_id}`}>
                    {story.title}
                  </LinkWithFilters>
                </td>
                <td>
                  <LinkWithFilters to={`/topics/${topicId}/media/${story.media_id}`}>
                    {story.media_name}
                  </LinkWithFilters>
                </td>
                <td><FormattedDate value={storyPubDateToTimestamp(story.publish_date)} /></td>
                <td><FormattedNumber value={story.media_inlink_count} /></td>
                <td><FormattedNumber value={story.outlink_count} /></td>
                <td><FormattedNumber value={story.bitly_click_count} /></td>
                <td><FormattedNumber value={story.facebook_share_count} /></td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

StoryTable.propTypes = {
  stories: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  onChangeSort: React.PropTypes.func,
  sortedBy: React.PropTypes.string,
};

export default injectIntl(StoryTable);
