import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Col } from 'react-flexbox-grid/lib';

const FocalSetSummary = (props) => {
  const { focalSet, selected, onClick } = props;
  const selectedClass = (selected === true) ? 'selected' : '';
  const rootClasses = `focal-set-summary ${selectedClass}`;
  return (
    <Col lg={3} md={3} sm={12}>
      <div onClick={onClick} className={rootClasses}>
        <p>
          <b>{focalSet.name}</b>
          <br />
          {focalSet.description}
        </p>
      </div>
    </Col>
  );
};

FocalSetSummary.propTypes = {
  focalSet: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    FocalSetSummary
  );
