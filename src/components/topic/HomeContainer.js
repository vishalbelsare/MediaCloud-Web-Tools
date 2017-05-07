import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicSearchContainer from './search/TopicSearchContainer';
import TopicListContainer from './list/TopicListContainer';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Home' },
};

const HomeContainer = (props) => {
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.homeTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <div className="controlbar">
        <div className="main">
          <Grid>
            <Row>
              <Col lg={8} />
              <Col lg={4}>
                <TopicSearchContainer />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
      <Grid>
        <TopicListContainer />
      </Grid>
    </div>
  );
};

HomeContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    HomeContainer
  );
