import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import messages from '../../resources/messages';
import { storyPubDateToTimestamp } from '../../lib/dateUtil';
import { googleFavIconUrl, storyDomainName } from '../../lib/urlUtil';

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

  render() {
    const { stories, onChangeSort, sortedBy, maxTitleLength } = this.props;
    const { formatMessage, formatDate } = this.props.intl;
    let socialHeader = null;
    if ((onChangeSort !== undefined) && (onChangeSort !== null)) {
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
              <th>{socialHeader}</th>
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
              const bitlyContent = story.bitly_click_count ? <FormattedNumber value={story.bitly_click_count} /> : <FormattedMessage {...messages.unknown} />;
              return (
                <tr key={story.stories_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td>
                    <a href={story.url} rel="noopener noreferrer" target="_blank">{title}</a>
                  </td>
                  <td>
                    <a href={story.media_url} rel="noopener noreferrer" target="_blank">
                      <img className="google-icon" src={googleFavIconUrl(domain)} alt={domain} />
                    </a>
                  </td>
                  <td>
                    <a href={story.media_url} rel="noopener noreferrer" target="_blank">{story.media_name}</a>
                  </td>
                  <td><span className={`story-date ${dateStyle}`}>{dateToShow}</span></td>
                  <td>{bitlyContent}</td>
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
  onChangeSort: React.PropTypes.func,
  onChangeFocusSelection: React.PropTypes.func,
  sortedBy: React.PropTypes.string,
  maxTitleLength: React.PropTypes.number,
};

export default injectIntl(StoryTable);
