import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../common/DataCard';

const Clipping = props => (
  <div className="clipping">
    <DataCard>
      <h2>{props.clipping.name}</h2>
    </DataCard>
  </div>
);

Clipping.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from parent
  clipping: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    Clipping
  );
