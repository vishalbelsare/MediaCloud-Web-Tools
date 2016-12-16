import React from 'react';
import Link from 'react-router/lib/Link';
import { injectIntl } from 'react-intl';

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
          {feeds.map((feed, idx) =>
            (<tr key={feeds.feeds_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                {feed.name}
              </td>
              <td>
                {feed.feed_type}
              </td>
              <td>
                <Link to={`/sources/${feed.url}`}>{feed.url}</Link>
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
