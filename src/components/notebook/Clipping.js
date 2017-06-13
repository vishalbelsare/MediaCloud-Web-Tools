import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../common/DataCard';
import AttentionOverTimeChart from '../vis/AttentionOverTimeChart';

const Clipping = (props) => {
  const { entry, createdDate } = props.clipping;
  let content = null;
  if (entry.type === 'AttentionOverTimeChart') {
    content = (
      <AttentionOverTimeChart
        height={200}
        data={entry.data}
        // lineColor={getBrandDarkColor()}
      />
    );
  }
  return (
    <div className="clipping">
      <DataCard>
        <h2>{entry.title}</h2>
        {content}
        <p><small>{createdDate}</small></p>
      </DataCard>
    </div>
  );
};

Clipping.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from parent
  clipping: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    Clipping
  );
