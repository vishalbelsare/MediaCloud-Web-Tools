import React from 'react';
import { injectIntl } from 'react-intl';
import Clipping from './Clipping';

const ClippingList = props => (
  <div className="notebook-clipping-list">
    {props.clippings.map(clipping => (
      <Clipping key={clipping.id} clipping={clipping} />
    ))}
  </div>
);

ClippingList.propTypes = {
  clippings: React.PropTypes.array.isRequired,
};

export default
  injectIntl(
    ClippingList
  );
