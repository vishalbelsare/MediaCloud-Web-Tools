import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import FilledStarIcon from '../../../common/icons/FilledStarIcon';
import messages from '../../../../resources/messages';

const CollectionTable = (props) => {
  const { title, description, collections } = props;
  let headerContent;
  if (description) {
    headerContent = (
      <div>
        <h2>
          <CollectionIcon height={32} />
          {title}
        </h2>
        <p>{description}</p>
      </div>
    );
  } else {
    headerContent = (
      <div>
        <h2>
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div className="collection-table">
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {headerContent}
          </Col>
        </Row>
        <Row>
          <table width="100%">
            <tbody>
              <tr>
                <th><FormattedMessage {...messages.collectionNameProp} /></th>
                <th><FormattedMessage {...messages.collectionDescriptionProp} /></th>
              </tr>
              {collections.map((c, idx) => (
                <tr key={c.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td>
                    <Link to={`/collections/${c.tags_id}`}>{c.label}</Link>
                  </td>
                  <td>
                    {c.description}
                  </td>
                  <td>
                    { c.isFavorite ? <FilledStarIcon /> : '' }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Row>
      </Grid>
    </div>
  );
};

CollectionTable.propTypes = {
  // from parent
  collections: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    CollectionTable
  );
