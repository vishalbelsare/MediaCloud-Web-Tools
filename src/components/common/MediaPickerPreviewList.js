import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from './DataCard';
// import { ExploreButton } from './IconButton';
import StatsWithAction from './statbar/StatsWithAction';

const localMessages = {
  stat1: { id: 'mediaPicker.stat1', defaultMessage: 'stories' },
  stat1HelpTitle: { id: 'mediaPicker.stat1.help.title', defaultMessage: 'annoyig' },
  stat1HelpMsg: { id: 'mediaPicker.stat1.help.message', defaultMessage: 'annoyig' },
  stat2: { id: 'mediaPicker.stat2', defaultMessage: 'media' },
  stat2HelpTitle: { id: 'mediaPicker.stat1.help.title', defaultMessage: 'annoyig' },
  stat2HelpMsg: { id: 'mediaPicker.stat1.help.message', defaultMessage: 'annoyig' },
  actionMessage1: { id: 'mediaPicker.action1', defaultMessage: 'Select' },
  actionMessage2: { id: 'mediaPicker.action2', defaultMessage: 'Selected' },
};

const MediaPickerPreviewList = (props) => {
  const { items, icon, linkInfo, linkDisplay, disabled, onClick } = props;
  let content = null;
  if (items && items.length > 0) {
    content = (
      items.map((c, idx) => {
        const isDisabled = disabled ? disabled(c) : false;
        const title = isDisabled ? (linkDisplay(c)) : (<Link to={linkInfo(c)}>{linkDisplay(c)}</Link>);
        // const exploreButton = isDisabled ? null : (<ExploreButton linkTo={linkInfo(c)} />);
        const statProps = {
          stat1: {
            message: localMessages.stat1,
            data: '100', // c.media_source_tags
            // helpTitleMsg: localMessages.stat1HelpTitle,
            // helpContentMsg: localMessages.stat1HelpMsg,
          },
          stat2: {
            message: localMessages.stat2,
            data: '200',
            // helpTitleMsg: localMessages.stat2HelpTitle,
            // helpContentMsg: localMessages.sta21HelpMsg,
          },
          selected: c.selected,
          actionMessage1: localMessages.actionMessage1,
          actionMessage2: localMessages.actionMessage2,
        };
        return (
          <Col key={idx} lg={4} xs={12}>
            <DataCard key={idx} className="browse-items" disabled={isDisabled}>
              {icon}
              <div className="content">
                <div>
                  <h2>{title}</h2>
                  <p>{c.description}</p>
                </div>
              </div>
              <div className="media-picker">
                <StatsWithAction disabled={statProps.selected} statProps={statProps} onClick={() => onClick(c)} />
              </div>
            </DataCard>
          </Col>
        );
      })
    );
  }
  return (
    <div className="browse-list">
      <Row>
        {content}
      </Row>
    </div>
  );
};

MediaPickerPreviewList.propTypes = {
  // from parent
  intro: PropTypes.string,
  icon: PropTypes.object,
  linkDisplay: PropTypes.func,
  linkInfo: PropTypes.func,
  items: PropTypes.array.isRequired,
  classStyle: PropTypes.string,
  helpButton: PropTypes.node,
  disabled: PropTypes.func,
  onClick: PropTypes.func,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  contentType: PropTypes.string,
};


export default
  injectIntl(
    connect(null)(
      MediaPickerPreviewList
    )
  );
