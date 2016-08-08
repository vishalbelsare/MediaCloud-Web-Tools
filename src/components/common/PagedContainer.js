import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import messages from '../../resources/messages';

/**
 * Use this with the JS Composition pattern to make a Container that has paging controls.
 * Your container MUST expose `previousPage` and `nextPage` event handler methods.
 * Most likely those methods will call out to a fetchData property that loads the previous or
 * next page.
 */
export default function composePagedContainer(ComposedContainer) {
  class PagedContainer extends React.Component {
    render() {
      const { links, nextPage, previousPage } = this.props;
      const { formatMessage } = this.props.intl;
      let previousButton = null;
      if ((links !== undefined) && links.hasOwnProperty('previous')) {
        previousButton = <FlatButton label={formatMessage(messages.previousPage)} primary onClick={previousPage} />;
      }
      let nextButton = null;
      if ((links !== undefined) && links.hasOwnProperty('next')) {
        nextButton = <FlatButton label={formatMessage(messages.nextPage)} primary onClick={nextPage} />;
      }
      return <ComposedContainer {...this.props} nextButton={nextButton} previousButton={previousButton} />;
    }
  }
  PagedContainer.propTypes = {
    intl: React.PropTypes.object.isRequired,
    links: React.PropTypes.object.isRequired,
    nextPage: React.PropTypes.func.isRequired,
    previousPage: React.PropTypes.func.isRequired,
  };
  return PagedContainer;
}

export default composePagedContainer;
