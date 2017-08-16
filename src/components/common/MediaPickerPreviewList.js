import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from './DataCard';
import AppButton from './AppButton';
import StatBar from './statbar/StatBar';

const localMessages = {
  sourceStat: { id: 'mediaPicker.source.stat', defaultMessage: ' Stories' },
  stat1: { id: 'mediaPicker.coll.stat1', defaultMessage: 'Total Stories' },
  stat2: { id: 'mediaPicker.coll.stat2', defaultMessage: 'Media Sources' },
  stat3: { id: 'mediaPicker.coll.stat3', defaultMessage: 'Select' },
  actionMessage1: { id: 'mediaPicker.action1', defaultMessage: 'Select' },
  actionMessage2: { id: 'mediaPicker.action2', defaultMessage: 'Selected' },
};

const MediaPickerPreviewList = (props) => {
  const { items, icon, linkInfo, linkDisplay, disabled, onSelectMedia } = props;
  let content = null;
  let statProps = null;
  const collProps = [
    { message: localMessages.stat1, data: '100' },
    { message: localMessages.stat2, data: '200' },
    { message: localMessages.stat3,
      content: (
        <AppButton // need icon also
          label={props.disabled ? localMessages.actionMessage2 : localMessages.actionMessage1} // the toggle has to be implemented
          backgroundColor={props.disabled ? '#ccc' : '#fff'}
          onTouchTap={onSelectMedia}
        />
      ),
    },
  ];
  const srcProps = [
    { message: localMessages.stat1, data: '20' },
    { message: localMessages.stat2, data: '40' },
    { message: localMessages.stat3,
      content: (
        <AppButton // need icon also
          label={props.disabled ? localMessages.actionMessage2 : localMessages.actionMessage1} // the toggle has to be implemented
          backgroundColor={props.disabled ? '#ccc' : '#fff'}
          onTouchTap={onSelectMedia}
        />
      ),
    },
  ];

  if (items && items.length > 0) {
    content = (
      items.map((c, idx) => {
        const isDisabled = disabled ? disabled(c) : false;
        const title = isDisabled ? (linkDisplay(c)) : (<Link to={linkInfo(c)}>{linkDisplay(c)}</Link>);
        // const exploreButton = isDisabled ? null : (<ExploreButton linkTo={linkInfo(c)} />);
        statProps = c.tags_id ? collProps : srcProps;
        return (
          <Col key={idx} lg={4} xs={12}>
            <DataCard key={idx} className="browse-items" disabled={isDisabled}>
              {icon}
              <div className="content">
                <div>
                  <h2>{title}</h2>
                  <p>{c.description || c.url}</p>
                </div>
              </div>
              <div className="media-picker">
                <StatBar disabled={c.selected} stats={statProps} onClick={() => onSelectMedia(c)} />
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
  onSelectMedia: PropTypes.func,
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
