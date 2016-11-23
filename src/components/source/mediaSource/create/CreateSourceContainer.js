import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import { createSource, addThisSourceToCollection } from '../../../../actions/sourceActions';
import AppButton from '../../../common/AppButton';
import SourceDetailsForm from './SourceDetailsForm';
import SourceMetadataForm from './SourceMetadataForm';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New source' },
};

const CreateSourceContainer = (props) => {
  const { handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = formatMessage(localMessages.mainTitle);
  const buttonLabel = formatMessage(localMessages.addButton);
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <SourceDetailsForm onSave={handleSave} />
        <SourceMetadataForm />
        <Row>
          <Col lg={12}>
            <AppButton
              style={{ marginTop: 30 }}
              type="submit"
              label={buttonLabel}
              primary
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

CreateSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  handleSave: React.PropTypes.func.isRequired,
  extHandleClick: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  collections: React.PropTypes.array,
  // from state
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleSave: (values) => {
    const newVals = Object.assign({}, values, {
      sourceObj: [{ name: values.sourceName, url: values.sourceUrl }] });
    dispatch(createSource(newVals));
   // .then(() => dispatch(createSource(ownProps.sourceId)));
  },
  extHandleClick: (item) => {
    dispatch(addThisSourceToCollection(item));
  },
});

export default
  injectIntl(
    composeIntlForm(
      connect(mapStateToProps, mapDispatchToProps)(
        CreateSourceContainer
      ),
    ),
  );
