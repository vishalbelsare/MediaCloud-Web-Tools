import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import messages from '../../resources/messages';
import LinkWithFilters from './LinkWithFilters';
import { storyPubDateToTimestamp } from '../../lib/dateUtil';
import { googleFavIconUrl, storyDomainName } from '../../lib/urlUtil';
import { ReadItNowButton } from '../common/IconButton';

const localMessages = {
  undateable: { id: 'story.publishDate.undateable', defaultMessage: 'Undateable' },
  foci: { id: 'story.foci.list', defaultMessage: 'List of Subtopics {list}' },
};

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

  handleReadItClick = (story) => {
    window.open(story.url, '_blank');
  }

  render() {
    const { stories, onChangeSort, onChangeFocusSelection, topicId, sortedBy, maxTitleLength } = this.props;
    const { formatMessage, formatDate } = this.props.intl;
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
      <div className="story-table">
        <table>
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.storyTitle} /></th>
              <th>{}</th>
              <th><FormattedMessage {...messages.media} /></th>
              <th><FormattedMessage {...messages.storyDate} /></th>
              <th>{inlinkHeader}</th>
              <th><FormattedMessage {...messages.outlinks} /></th>
              <th>{socialHeader}</th>
              <th><FormattedMessage {...messages.facebookShares} /></th>
              <th>{}</th>
              <th><FormattedMessage {...messages.focus} /></th>
              <th>{}</th>
            </tr>
            {stories.map((story, idx) => {
              const domain = storyDomainName(story);
              let dateToShow = null;  // need to handle undateable stories
              let dateStyle = '';
              const title = maxTitleLength !== undefined ? `${story.title.substr(0, maxTitleLength)}...` : story.title;
              if (story.publish_date === 'undateable') {
                dateToShow = formatMessage(localMessages.undateable);
                dateStyle = 'story-date-undateable';
              } else {
                dateToShow = formatDate(storyPubDateToTimestamp(story.publish_date));
                dateStyle = (story.date_is_reliable === 0) ? 'story-date-unreliable' : 'story-date-reliable';
                if (story.date_is_reliable === 0) {
                  dateToShow += '?';
                }
              }
              let listOfFoci = 'none';
              if (story.foci.length > 0) {
                listOfFoci = (
                  story.foci.map((foci, i) => (
                    <span key={i}>
                      {!!i && ', '}
                      <Link
                        to={`/topics/${topicId}/summary?focusId=${foci.foci_id}`}
                        onClick={() => onChangeFocusSelection(foci.foci_id)}
                      >
                        { foci.focal_set_name }: { foci.name }
                      </Link>
                    </span>
                  ),
                  )
                );
                // listOfFoci = intersperse(listOfFoci, ', ');
              }
              return (
                <tr key={story.stories_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td>
                    <LinkWithFilters to={`/topics/${topicId}/stories/${story.stories_id}`}>
                      {title}
                    </LinkWithFilters>
                  </td>
                  <td>
                    <img className="google-icon" src={googleFavIconUrl(domain)} alt={domain} />
                  </td>
                  <td>
                    <LinkWithFilters to={`/topics/${topicId}/media/${story.media_id}`}>
                      {story.media_name}
                    </LinkWithFilters>
                  </td>
                  <td><span className={`story-date ${dateStyle}`}>{dateToShow}</span></td>
                  <td><FormattedNumber value={story.media_inlink_count || 0} /></td>
                  <td><FormattedNumber value={story.outlink_count || 0} /></td>
                  <td><FormattedNumber value={story.bitly_click_count || 0} /></td>
                  <td><FormattedNumber value={story.facebook_share_count || 0} /></td>
                  <td><ReadItNowButton onClick={this.handleReadItClick.bind(this, story)} /></td>
                  <td>{listOfFoci}</td>
                </tr>
              );
            }
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
  onChangeFocusSelection: React.PropTypes.func,
  sortedBy: React.PropTypes.string,
  maxTitleLength: React.PropTypes.number,
};

export default injectIntl(StoryTable);
