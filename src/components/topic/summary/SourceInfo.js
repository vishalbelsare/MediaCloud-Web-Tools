import React from 'react';
import { injectIntl } from 'react-intl';

const SourceInfo = (props) => {
  const { source } = props;
  return (
    <div>
      <h2>{source.name}</h2>
      <ul>
        <li>{source.description}</li>
        <li>Iterations: {source.num_iterations}</li>
        <li>process_with_bitly: {source.process_with_bitly}</li>
      </ul>
    </div>
  );
};

SourceInfo.propTypes = {
  source: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SourceInfo);
