import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';

const EntitiesTable = (props) => {
  const { entities } = props;
  const content = null;
  if (entities === undefined) {
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
            <th><FormattedMessage {...messages.entityName} /></th>
            <th><FormattedMessage {...messages.entityPercentage} /></th>
          </tr>
          {entities.map((entity, idx) =>
            (<tr key={entity.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <Link to={`/sources/${entity.tags_id}`}>{entity.label}</Link>
              </td>
              <td>
                <p>{entity.pct}</p>
              </td>
            </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

EntitiesTable.propTypes = {
  entities: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntitiesTable);
