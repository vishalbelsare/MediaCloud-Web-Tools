import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import LinkWithFilters from './LinkWithFilters';

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
    const { media, onChangeSort, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    let inlinkHeader = null;
    let socialHeader = null;
    if ((onChangeSort !== undefined) && (onChangeSort !== null)) {
      inlinkHeader = (
        <a
          href={`#${formatMessage(messages.sortByMediaInlinks)}`}
          onClick={e => { e.preventDefault(); this.sortByInlinks(); }}
        >
          <FormattedMessage {...messages.inlinks} />
        </a>
      );
      socialHeader = (
        <a
          href={`#${formatMessage(messages.sortByBitlyClicks)}`}
          onClick={e => { e.preventDefault(); this.sortBySocial(); }}
        >
          <FormattedMessage {...messages.bitlyClicks} />
        </a>
      );
    } else {
      inlinkHeader = <FormattedMessage {...messages.mediaInlinks} />;
      socialHeader = <FormattedMessage {...messages.bitlyClicks} />;
    }
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.mediaName} /></th>
              <th><FormattedMessage {...messages.storyPlural} /></th>
              <th>{inlinkHeader}</th>
              <th><FormattedMessage {...messages.outlinks} /></th>
              <th>{socialHeader}</th>
              <th><FormattedMessage {...messages.facebookShares} /></th>
            </tr>
            {media.map((m, idx) =>
              (<tr key={m.media_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                <td>
                  <LinkWithFilters to={`/topics/${topicId}/media/${m.media_id}`}>
                    {m.name}
                  </LinkWithFilters>
                </td>
                <td>{m.story_count}</td>
                <td>{m.media_inlink_count}</td>
                <td>{m.outlink_count}</td>
                <td>{m.bitly_click_count}</td>
                <td>{m.facebook_share_count}</td>
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
