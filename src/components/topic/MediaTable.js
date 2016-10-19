import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import messages from '../../resources/messages';
import LinkWithFilters from './LinkWithFilters';
import { googleFavIconUrl } from '../../lib/urlUtil';

const ICON_STYLE = { margin: 0, padding: 0, width: 12, height: 12 };

class MediaTable extends React.Component {

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { media, onChangeSort, topicId, sortedBy } = this.props;
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
        <table>
          <tbody>
            <tr>
              <th />
              <th><FormattedMessage {...messages.mediaName} /></th>
              <th><FormattedMessage {...messages.storyPlural} /></th>
              <th>{inlinkHeader}</th>
              <th><FormattedMessage {...messages.outlinks} /></th>
              <th>{socialHeader}</th>
            </tr>
            {media.map((m, idx) =>
              (<tr key={m.media_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                <td>
                  <img src={googleFavIconUrl(m.url)} alt={m.name} />
                </td>
                <td>
                  <LinkWithFilters to={`/topics/${topicId}/media/${m.media_id}`}>
                    {m.name}
                  </LinkWithFilters>
                </td>
                <td><FormattedNumber value={m.story_count} /></td>
                <td><FormattedNumber value={m.media_inlink_count} /></td>
                <td><FormattedNumber value={m.outlink_count} /></td>
                <td><FormattedNumber value={m.bitly_click_count} /></td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

MediaTable.propTypes = {
  media: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  onChangeSort: React.PropTypes.func,
  sortedBy: React.PropTypes.string,
};

export default injectIntl(MediaTable);
