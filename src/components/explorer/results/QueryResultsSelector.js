import PropTypes from 'prop-types';
import React from 'react';

class QueryResultsSelector extends React.Component {
  state = {
    selectedQueryIndex: 0,
  }
  render() {
    const { options, onQuerySelected } = this.props;
    if (options.length === 1) {
      // if only one query don't show option to switch between them
      return null;
    }
    return (
      <ul className="query-results-selector">
        {options.map(q =>
          <li
            role="button"
            tabIndex={0}
            onKeyPress={evt => evt.preventDefault()}
            key={q.index}
            style={{ color: q.color }}
            className={`${this.state.selectedQueryIndex === q.index ? 'selected' : ''}`}
            onClick={() => {
              this.setState({ selectedQueryIndex: q.index });
              onQuerySelected(q.index);
            }}
          >
            {q.label}
          </li>
        )}
      </ul>
    );
  }
}

QueryResultsSelector.propTypes = {
  // from parent
  options: PropTypes.array,
  onQuerySelected: PropTypes.func,
};

export default QueryResultsSelector;
