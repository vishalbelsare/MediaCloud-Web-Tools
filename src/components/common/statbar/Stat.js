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
  message: React.PropTypes.object.isRequired,
  data: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]).isRequired,
  helpTitleMsg: React.PropTypes.object,
  helpContentMsg: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
  // from context
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  setHelpTitleMsg: React.PropTypes.func.isRequired,
  setHelpContentMsg: React.PropTypes.func.isRequired,
};

export default
  injectIntl(
    composeHelpfulContainer()(
      Stat
    )
  );
