import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import FilledStarIcon from '../common/icons/FilledStarIcon';
import messages from '../../resources/messages';
import { googleFavIconUrl } from '../../lib/urlUtil';

const SourceTable = (props) => {
  const { sources } = props;
  const content = null;
  if (sources === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <div className="source-table">
      <table width="100%">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.sourceIcon} /></th>
            <th><FormattedMessage {...messages.sourceName} /></th>
          </tr>
          {sources.map((source, idx) =>
            (<tr key={source.id ? source.id : source.media_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <img className="google-icon" src={googleFavIconUrl(source.url)} alt={source.name} />
              </td>
              <td>
                <Link to={`/sources/${source.id ? source.id : source.media_id}`}>{source.name}</Link>
              </td>
              <td>
                { source.isFavorite ? <FilledStarIcon /> : '' }
              </td>
            </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

SourceTable.propTypes = {
  sources: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SourceTable);
