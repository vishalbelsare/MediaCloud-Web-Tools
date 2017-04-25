import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import { EditButton } from '../common/IconButton';


const SourceFeedTable = (props) => {
  const { feeds } = props;
  const content = null;
  if (feeds === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <div className="source-feed-table">
      <table width="100%">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.feedName} /></th>
            <th><FormattedMessage {...messages.feedType} /></th>
            <th><FormattedMessage {...messages.feedDescription} /></th>
          </tr>
          {feeds.map((feed, idx) =>
            (<tr key={feed.feeds_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                {feed.name}
              </td>
              <td>
                {feed.feed_type}
              </td>
              <td>
                <Link to={`/sources/${feed.url}`}>{feed.url}</Link>
              </td>
              <td>
                <Link to={`/sources/${feed.feeds_id}/feeds/edit`} >
                  <EditButton />
                </Link>
              </td>
            </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

SourceFeedTable.propTypes = {
  feeds: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SourceFeedTable);
