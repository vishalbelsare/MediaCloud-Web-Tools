import React from 'react';
import Title from 'react-title-component';
// import { formValueSelector } from 'redux-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Divider from 'material-ui/Divider';
import SearchMetadataPickerForm from './SearchMetadataPickerForm';
import SourcesAndCollectionsContainer from '../SourcesAndCollectionsContainer';

// const formSelector = formValueSelector('advancedQueryForm');

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Advanced Search' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Search' },
};

class AdvancedSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    const defaultQueryStr = (props.urlQueryString) ? props.urlQueryString : null;
    this.state = { queryStr: defaultQueryStr };
  }

  componentWillReceiveProps(nextProps) {
    const { urlQueryString } = this.props;
    if (nextProps.urlQueryString !== urlQueryString) {
      this.state = { queryStr: nextProps.urlQueryString };
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
    let resultsContent = null;
    if ((this.state.queryStr !== null) && (this.state.queryStr !== undefined) && (this.state.queryStr.length > 0)) {
      resultsContent = <SourcesAndCollectionsContainer searchString={this.state.queryStr} />;
    }
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <SearchMetadataPickerForm
            initialValues={{ advancedSearchQueryString: this.state.queryStr }}
            buttonLabel={formatMessage(localMessages.addButton)}
            onSearch={values => this.setState({ queryStr: values.advancedSearchQueryString })}
          />
          <Divider />
          {resultsContent}
        </Grid>
      </div>
    );
  }

}

AdvancedSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  location: React.PropTypes.object,
  // from dispatch
  // from url
  urlQueryString: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  urlQueryString: ownProps.location.query.search,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      AdvancedSearchContainer
    ),
  );
