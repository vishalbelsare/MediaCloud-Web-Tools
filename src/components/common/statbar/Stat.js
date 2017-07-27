import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from '../DataCard';
import composeHelpfulContainer from '../HelpfulContainer';

class Stat extends React.Component {

  componentWillMount = () => {
    const { helpTitleMsg, helpContentMsg, setHelpTitleMsg, setHelpContentMsg } = this.props;
    if (helpTitleMsg) {
      setHelpTitleMsg(helpTitleMsg);
    }
    if (helpContentMsg) {
      setHelpContentMsg(helpContentMsg);
    }
  }

  render() {
    const { helpTitleMsg, message, data, helpButton } = this.props;
    const helpDisplayContent = (helpTitleMsg) ? helpButton : null;  // only show help button if there is any help
    return (
      <DataCard className="stat">
        <small><FormattedMessage {...message} /> { helpDisplayContent }</small>
        <em>{data}</em>
      </DataCard>
    );
  }

}

Stat.propTypes = {
  // from parent
  message: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  helpTitleMsg: PropTypes.object,
  helpContentMsg: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  setHelpTitleMsg: PropTypes.func.isRequired,
  setHelpContentMsg: PropTypes.func.isRequired,
};

export default
  injectIntl(
    composeHelpfulContainer()(
      Stat
    )
  );
