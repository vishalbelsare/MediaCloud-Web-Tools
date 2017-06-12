import React from 'react';
import { injectIntl } from 'react-intl';
import ClippingList from './ClippingList';
import Clipping from './Clipping';

const ClippingListContainer = props => (
  <div className="notebook-clippings-list">
    {props.clippings.map(clipping => (
      <Clipping clipping={clipping} />
    ))}
  </div>
);

ClippingListContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  clippings: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    ClippingList
  );
