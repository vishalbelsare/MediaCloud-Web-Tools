import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import CollectionTable from '../CollectionTable';

const TitledCollectionTable = (props) => {
  const { title, description, collections, user } = props;
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
          <CollectionTable collections={collections} user={user} />
        </Row>
      </Grid>
    </div>
  );
};

TitledCollectionTable.propTypes = {
  // from parent
  collections: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  user: PropTypes.object.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    TitledCollectionTable
  );
