import React from 'react';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';

const SourceList = (props) => {
  const { title, intro, sources } = props;
  return (
    <DataCard className="source-list">
      <h2>{title}</h2>
      <p>{intro}</p>
      <ul>
      {sources.map(s =>
        <li key={s.id}><Link to={`source/${s.id}/details`}>{s.name}</Link></li>
      )}
      </ul>
    </DataCard>
  );
};

SourceList.propTypes = {
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string,
  sources: React.PropTypes.array.isRequired,
};

export default SourceList;
