import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkWithFilters from '../topic/LinkWithFilters';
import messages from '../../resources/messages';

const EntitiesTable = (props) => {
  const { topicId, entities } = props;
  const { formatNumber } = props.intl;
  const content = null;
  if (entities === undefined) {
    return (
      <div className="entity-table">
        { content }
      </div>
    );
  }
  return (
    <div className="entity-table">
      <table width="100%">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.entityName} /></th>
            <th className="numeric"><FormattedMessage {...messages.entityPercentage} /></th>
          </tr>
          {entities.map((entity, idx) =>
            (<tr key={entity.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <LinkWithFilters to={`/topics/${topicId}/summary?q=${encodeURIComponent(entity.label)}`} >
                  {entity.label}
                </LinkWithFilters>
              </td>
              <td className="numeric">
                { formatNumber(entity.pct, { style: 'percent', maximumFractionDigits: 2 }) }
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
  topicId: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntitiesTable);
