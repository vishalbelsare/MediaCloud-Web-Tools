import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';

const localMessage = {
  showDetails: { id: 'describedDataCard.description.show', defaultMessage: '...learn more' },
  hideDescription: { id: 'describedDataCard.description.hide', defaultMessage: 'hide details' },
};

function composeSummarizedVisualization(titleMesage, introMessage, detailedMesasge) {
  return (ChildComponent) => {
    class SummarizedVisualization extends React.Component {
      state = {
        showingDetails: false,
      };
      toggleShowingDetails = () => {
        this.setState({ showingDetails: !this.state.showingDetails });
      }
      render() {
        let detailsContent;
        let showDetailsButton;

        if (detailedMesasge) {  // only toggle extra text if there is any
          if (this.state.showingDetails) {
            if (Array.isArray(detailedMesasge)) {
              detailsContent = detailedMesasge.map(msgId => <FormattedHTMLMessage key={msgId.id} {...msgId} />);
            } else {
              detailsContent = <FormattedHTMLMessage {...detailedMesasge} />;
            }
            detailsContent = (
              <span className="summary-details">
                {detailsContent}
                <p>
                  <a onTouchTap={this.toggleShowingDetails}>
                    <FormattedHTMLMessage {...localMessage.hideDescription} />
                  </a>
                </p>
              </span>
            );
          } else {
            showDetailsButton = (
              <a onTouchTap={this.toggleShowingDetails}>
                <FormattedHTMLMessage {...localMessage.showDetails} />
              </a>
            );
          }
        }

        return (
          <div className="summarized-viz">
            <Row>
              <Col lg={4}>
                <div className="summary">
                  <h2><FormattedHTMLMessage {...titleMesage} /></h2>
                  <div className="summary-intro">
                    <FormattedHTMLMessage {...introMessage} />
                    {showDetailsButton}
                  </div>
                  {detailsContent}
                </div>
              </Col>
              <Col lg={1} />
              <Col lg={7}>
                <div className="content">
                  <ChildComponent {...this.props} showingDetails={this.state.showingDetails} />
                </div>
              </Col>
            </Row>
          </div>
        );
      }
    }

    SummarizedVisualization.propTypes = {
      intl: PropTypes.object.isRequired,
    };

    return injectIntl(SummarizedVisualization);
  };
}

export default composeSummarizedVisualization;
