import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';

const localMessages = {
  pickQuery: { id: 'query.pick', defaultMessage: 'Search Sentences Matching' },
};

class QuerySelector extends React.Component {

  handleApply = () => {
    const { onQuerySelected } = this.props;
    const newQuery = document.getElementById('topic-filter-query').value;
    onQuerySelected(newQuery);
  }

  handleMenuItemKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
        this.handleApply();
        break;
      default: break;
    }
  }

  render() {
    const { query } = this.props;
    const { formatMessage } = this.props.intl;
    const queryToShow = (query === null) ? undefined : query;
    return (
      <div className="query-selector-wrapper">
        <TextField
          floatingLabelText={formatMessage(localMessages.pickQuery)}
          floatingLabelFixed
          floatingLabelStyle={{ color: 'rgb(224,224,224)', opacity: 0.8 }}
          value={queryToShow}
          onKeyDown={this.handleMenuItemKeyDown}
          fullWidth
          id="topic-filter-query"
          onChange={this.handleChange}
          inputStyle={{
            color: '#FFFFFF',
          }}
        />
      </div>
    );
  }

}

QuerySelector.propTypes = {
  // from parent
  query: PropTypes.string,
  onQuerySelected: PropTypes.func.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QuerySelector
  );
