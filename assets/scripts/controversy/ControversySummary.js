import React from 'react';
import { injectIntl } from 'react-intl';

const ControversySummary = (props) => {
  const { controversy } = props;
  return (
    <div>
      <h1>{controversy.name}</h1>
      <ul>
        <li>{controversy.description}</li>
        <li>Iterations: {controversy.num_iterations}</li>
        <li>process_with_bitly: {controversy.process_with_bitly}</li>
        <li>Dumps: {controversy.dumps.length}</li>
      </ul>
    </div>
  );
};

ControversySummary.propTypes = {
  controversy: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ControversySummary);
