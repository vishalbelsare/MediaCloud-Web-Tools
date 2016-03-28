import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';

const messages = {
};

class ControversySummary extends React.Component {
  render() {
    const { controversy } = this.props;
    return (
      <div>
        <h1>{controversy.name}</h1>
        <ul>
          <li>{controversy.description}</li>
          <li>Iterations: {controversy.num_iterations}</li>
          <li>process_with_bitly: {controversy.process_with_bitly}</li>
        </ul>
      </div>
    );
  }
}

ControversySummary.propTypes = {
  controversy: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired
};

export default injectIntl(ControversySummary);
