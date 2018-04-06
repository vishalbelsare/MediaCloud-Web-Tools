import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import LockIcon from '../../common/icons/LockIcon';
import FilledStarIcon from '../../common/icons/FilledStarIcon';
import messages from '../../../resources/messages';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';

const CollectionTable = (props) => {
  const userCanSeePrivateCollections = hasPermissions(getUserRoles(props.user), PERMISSION_MEDIA_EDIT);
  const collectionsToShow = props.collections.filter(c => (c.show_on_media === true) ||
    ((c.show_on_media !== true) && userCanSeePrivateCollections));
  return (
    <table width="100%">
      <tbody>
        <tr>
          <th><FormattedMessage {...messages.collectionNameProp} /></th>
          <th><FormattedMessage {...messages.collectionDescriptionProp} /></th>
        </tr>
        {collectionsToShow.map((c, idx) => (
          <tr key={c.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>
              <Link to={`/collections/${c.tags_id}`}>{c.label || c.tag}</Link>
            </td>
            <td>
              {c.description}
            </td>
            <td>
              { c.isFavorite ? <FilledStarIcon /> : '' }
              { c.show_on_media === false ? <LockIcon /> : '' }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CollectionTable.propTypes = {
  // from parent
  collections: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    CollectionTable
  );

