import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import { googleFavIconUrl } from '../../lib/urlUtil';

const SourceTable = (props) => {
  const sourceHeader = <FormattedMessage {...messages.sourceName} />;
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
            <th />
            <th>{sourceHeader}</th>
          </tr>
          {sources.map((source, idx) =>
            (<tr key={source.id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <img className="google-icon" src={googleFavIconUrl(source.url)} alt={source.name} />
              </td>
              <td>
                <Link to={`/sources/${source.id}/details`}>{source.name}</Link>
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
