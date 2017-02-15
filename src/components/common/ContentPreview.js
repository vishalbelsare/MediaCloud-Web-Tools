import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from './DataCard';
import { ExploreButton } from './IconButton';

const ContentPreview = (props) => {
  const { items, icon, linkInfo, linkDisplay } = props;
  let content = null;
  if (items && items.length > 0) {
    content = (
      items.map((c, idx) =>
        <Col key={idx} lg={4} md={4} xs={4}>
          <DataCard key={idx} className="browse-items">
            {icon}
            <div className="content">
              <div>
                <h2><Link to={linkInfo(c)}>{linkDisplay(c)}</Link></h2>
                <p>{c.description}</p>
              </div>
            </div>
            <div className="actions">
              <ExploreButton linkTo={linkInfo(c)} />
            </div>
          </DataCard>
        </Col>
      )
    );
  }
  return (
    <div className="browse-items">
      <Row>
        {content}
      </Row>
    </div>
  );
};

ContentPreview.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string,
  icon: React.PropTypes.object,
  linkDisplay: React.PropTypes.func,
  linkInfo: React.PropTypes.func,
  items: React.PropTypes.array.isRequired,
  helpButton: React.PropTypes.node,
  // from dispatch
  handleClick: React.PropTypes.func.isRequired,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(null)(
      ContentPreview
    )
  );
