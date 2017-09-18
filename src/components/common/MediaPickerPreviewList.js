import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import Stat from './statbar/Stat';
import { humanReadableNumber } from '../../lib/stringUtil';
import { AddButton, DeleteButton } from './IconButton';

const localMessages = {
  sourceStat: { id: 'mediaPicker.source.stat', defaultMessage: ' Stories' },
  stat1: { id: 'mediaPicker.coll.stat1', defaultMessage: 'Stories Last Week' },
  stat2: { id: 'mediaPicker.coll.stat2', defaultMessage: 'Media Sources' },
  stat3: { id: 'mediaPicker.coll.stat3', defaultMessage: 'Select' },
  actionMessage1: { id: 'mediaPicker.action1', defaultMessage: 'Add Collection' },
  actionMessage2: { id: 'mediaPicker.action2', defaultMessage: 'Remove Collection' },
};

const MediaPickerPreviewList = (props) => {
  const { items, icon, linkInfo, linkDisplay, onSelectMedia } = props;
  const { formatMessage, formatNumber } = props.intl;
  let content = null;
  let statProps = null;

  if (items && items.length > 0) {
    content = (
      items.map((c) => {
        const isDisabled = c.selected;
        const title = isDisabled ? (linkDisplay(c)) : (<Link to={linkInfo(c)}>{linkDisplay(c)}</Link>); // TODO we need to open a new window
        const ActionButton = (isDisabled) ? DeleteButton : AddButton;
        const actionMsg = isDisabled ? formatMessage(localMessages.actionMessage2) : formatMessage(localMessages.actionMessage1);
        const collProps = [
          { message: localMessages.stat1, data: humanReadableNumber(c.story_count, 1, formatNumber) },
          { message: localMessages.stat2, data: (c.media_count === 100) ? `${c.media_count}+` : c.media_count },
          { message: localMessages.stat3,
            content: (
              <div className="media-action">
                <ActionButton
                  label={actionMsg}
                  onClick={() => onSelectMedia(c)}
                />
                <small>{actionMsg}</small>
              </div>
            ),
          },
        ];
        const srcProps = [
          { message: localMessages.stat1, data: humanReadableNumber(c.story_count, 1, formatNumber) },
          { message: localMessages.stat3,
            content: (
              <AddButton // need icon also
                label={c.selected ? formatMessage(localMessages.actionMessage2) : formatMessage(localMessages.actionMessage1)}
                onClick={() => onSelectMedia(c)}
              />
            ),
          },
        ];
        statProps = c.tags_id ? collProps : srcProps;
        return (
          <Col lg={6} key={c.tags_id || c.media_id} >
            <div className="media-item">
              <div className="media-info">
                <h2>{icon}{title}</h2>
                <p>{c.description || c.url}</p>
              </div>
              <div className="media-stats">
                <Row>
                  {statProps.map((stat, idx) => (
                    <Col lg={4} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div className={`stat-wrapper ${idx === 0 ? 'first' : ''}`} key={idx}>
                        <Stat {...stat} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>
        );
      })
    );
  }
  return (
    <div className="media-list">
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
