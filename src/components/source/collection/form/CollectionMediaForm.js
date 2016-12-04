import React from 'react';
import Link from 'react-router/lib/Link';
import { FieldArray, Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { Tabs, Tab } from 'material-ui/Tabs';
import composeIntlForm from '../../../common/IntlForm';
import ComingSoon from '../../../common/ComingSoon';
import SourceSearchContainer from '../../controlbar/SourceSearchContainer';
import { googleFavIconUrl } from '../../../../lib/urlUtil';
import { RemoveButton } from '../../../common/IconButton';
import messages from '../../../../resources/messages';
import CollectionCopyConfirmer from './CollectionCopyConfirmer';

const localMessages = {
  title: { id: 'collection.media.title', defaultMessage: 'Add Media Sources' },
  sourcesToInclude: { id: 'collection.media.sources', defaultMessage: 'Sources To Include' },

  tabSource: { id: 'collection.media.addSource', defaultMessage: 'Add Existing Source' },
  tabCollection: { id: 'collection.media.addCollection', defaultMessage: 'Copy From Collection' },
  tabUpload: { id: 'collection.media.addSpreadsheet', defaultMessage: 'Upload a Spreadsheet' },
  tabUrls: { id: 'collection.media.addURLs', defaultMessage: 'Add URLs Manually' },
  sourceUrlHint: { id: 'collection.media.addURLs.hint', defaultMessage: 'Type in the URLs of each media source, one per line.' },
};

class SourceSelectionRenderer extends React.Component {

  state = {
    collectionId: null, // the id of a collection to copy
  };

  resetCollectionId = () => this.setState({ collectionId: null });

  pickCollectionToCopy = (collectionId) => {
    this.setState({ collectionId });
  }

  copyCollection = (collection) => {
    const { fields } = this.props;
    collection.media.forEach(m => fields.unshift(m));
  }

  render() {
    const { goToASearch, fields, meta: { error } } = this.props;
    let copyConfirmation = null;
    if (this.state.collectionId) {
      copyConfirmation = (
        <CollectionCopyConfirmer
          collectionId={this.state.collectionId}
          onConfirm={this.copyCollection}
          onCancel={this.resetCollectionId}
        />
      );
    }
    return (
      <div className="collection-media-form">

        <div className="form-section collection-media-form-inputs">
          <Row>
            <Col lg={12}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={10}>
              <Tabs>
                <Tab label={<FormattedMessage {...localMessages.tabSource} />} >
                  <h3><FormattedMessage {...localMessages.tabSource} /></h3>
                  <SourceSearchContainer
                    searchCollections={false}
                    onAdvancedSearchSelected={goToASearch}
                    onMediaSourceSelected={item => fields.unshift(item)}
                  />
                </Tab>
                <Tab label={<FormattedMessage {...localMessages.tabCollection} />} >
                  <h3><FormattedMessage {...localMessages.tabCollection} /></h3>
                  <SourceSearchContainer
                    searchSources={false}
                    onAdvancedSearchSelected={goToASearch}
                    onCollectionSelected={c => this.pickCollectionToCopy(c.tags_id)}
                  />
                  {copyConfirmation}
                </Tab>
                <Tab label={<FormattedMessage {...localMessages.tabUpload} />} >
                  <h3><FormattedMessage {...localMessages.tabUpload} /></h3>
                  <ComingSoon />
                </Tab>
                <Tab label={<FormattedMessage {...localMessages.tabUrls} />} >
                  <h3><FormattedMessage {...localMessages.tabUrls} /></h3>
                  <ComingSoon />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </div>

        <div className="form-section collection-media-form-list">
          <Row>
            <Col lg={12}>
              <h2><FormattedMessage {...localMessages.sourcesToInclude} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={10}>
              <table width="100%">
                <tbody>
                  <tr>
                    <th />
                    <th><FormattedMessage {...messages.sourceNameProp} /></th>
                    <th><FormattedMessage {...messages.sourceUrlProp} /></th>
                    <th />
                  </tr>
                  {fields.map((source, idx) =>
                    <Field
                      key={`c${idx}`}
                      name={source}
                      component={info => (
                        <tr key={source.id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                          <td>
                            <img className="google-icon" src={googleFavIconUrl(info.input.value.url)} alt={info.input.value.name} />
                          </td>
                          <td>
                            <Link to={`/sources/${info.input.value.id}`}>{info.input.value.name}</Link>
                          </td>
                          <td>
                            <a href="{source.url}" target="_new">{info.input.value.url}</a>
                          </td>
                          <td>
                            <RemoveButton onClick={() => fields.remove(idx)} />
                          </td>
                        </tr>
                      )}
                    />
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col lg={10}>
              {error && <div className="error">{error}</div>}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

SourceSelectionRenderer.propTypes = {
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
  goToASearch: React.PropTypes.func.isRequired,
};

const CollectionMediaForm = (props) => {
  const { goToASearch } = props;
  return (
    <FieldArray name="sources" component={SourceSelectionRenderer} goToASearch={goToASearch} />
  );
};

CollectionMediaForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  goToASearch: React.PropTypes.func.isRequired,
  // from form helper
  // from parent
};

function validate() {
  const errors = {};
  errors.error = "don't know yet";
  return errors;
}

const reduxFormConfig = {
  form: 'collectionForm', // make sure this matches the sub-components and other wizard steps
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        CollectionMediaForm
      )
    )
  );
