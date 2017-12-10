import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';


const localMessages = {
  attention: { id: 'explorer.results.attention.title', defaultMessage: 'Attention' },
  language: { id: 'explorer.results.language.title', defaultMessage: 'Language' },
  people: { id: 'explorer.results.people.title', defaultMessage: 'People' },
  reach: { id: 'explorer.results.reach.title', defaultMessage: 'Reach' },
};

class QueryViewSelector extends React.Component {
  state = {
    selectedViewIndex: 0,
  }

  render() {
    const { onViewSelected } = this.props;
    const { formatMessage } = this.props.intl;
    const menuOptions = [
      { label: formatMessage(localMessages.attention), index: 0 },
      { label: formatMessage(localMessages.language), index: 1 },
      { label: formatMessage(localMessages.people), index: 2 },
      { label: formatMessage(localMessages.reach), index: 3 },
    ];
    return (
      <ul className="query-view-selector">
        {menuOptions.map(q =>
          <li
            role="button"
            tabIndex={0}
            onKeyPress={evt => evt.preventDefault()}
            key={q.index}
            className={`${this.state.selectedViewIndex === q.index ? 'selected' : ''}`}
            onClick={() => {
              this.setState({ selectedViewIndex: q.index });
              onViewSelected(q.index);
            }}
          >
            {q.label}
          </li>
        )}
      </ul>
    );
  }
}

QueryViewSelector.propTypes = {
  // from parent
  options: PropTypes.array,
  onViewSelected: PropTypes.func,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryViewSelector
  );
