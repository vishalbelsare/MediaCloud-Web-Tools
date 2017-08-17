import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from '../DataCard';
<<<<<<< HEAD
import composeHelpfulContainer from '../HelpfulContainer';
=======
import composeHelpfulContainer from '../../common/HelpfulContainer';
>>>>>>> 03cba8d9e5021cf796bc555c0a590f320ff1a8c5

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
    const { helpTitleMsg, message, data, content, helpButton } = this.props;
    const helpDisplayContent = (helpTitleMsg) ? helpButton : null;  // only show help button if there is any help
    let contentToShow = null;
    if (content) {
      contentToShow = content;
    } else {
      contentToShow = (
        <div>
          <small><FormattedMessage {...message} /> { helpDisplayContent }</small>
          <em>{data}</em>
        </div>
      );
    }
    return (
      <DataCard className="stat">
        {contentToShow}
      </DataCard>
    );
  }
}

Stat.propTypes = {
  // from parent
  message: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  content: PropTypes.object,
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
