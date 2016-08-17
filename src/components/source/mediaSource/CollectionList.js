import React from 'react';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';

const CollectionList = (props) => {
  const { title, intro, collections } = props;
  return (
    <DataCard className="collection-list">
      <h3>{title}</h3>
      <p>{intro}</p>
      <ul>
      {collections.map(c =>
        <li key={c.tags_id}><Link to={`collection/${c.tags_id}/details`}>{c.label}</Link></li>
      )}
      </ul>
    </DataCard>
  );
};

CollectionList.propTypes = {
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string,
  collections: React.PropTypes.array.isRequired,
};

export default CollectionList;
