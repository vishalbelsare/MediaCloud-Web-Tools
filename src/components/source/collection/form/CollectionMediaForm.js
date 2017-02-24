import React from 'react';
import Link from 'react-router/lib/Link';
import { FieldArray, Field, reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { Tabs, Tab } from 'material-ui/Tabs';
import { updateFeedback } from '../../../../actions/appActions';
import composeIntlForm from '../../../common/IntlForm';
import SourceSearchContainer from '../../controlbar/SourceSearchContainer';
import CollectionUploadSourceContainer from '../CollectionUploadSourceContainer';
import { googleFavIconUrl } from '../../../../lib/urlUtil';
import { RemoveButton } from '../../../common/IconButton';
import messages from '../../../../resources/messages';
import CollectionCopyConfirmer from './CollectionCopyConfirmer';

// show an extra submit button if source list is longer than this many entries
const EXTRA_BUTTON_LIST_LENGTH = 7;

const formSelector = formValueSelector('collectionForm');

const localMessages = {
  title: { id: 'collection.media.title', defaultMessage: 'Add Media Sources' },
  sourcesToInclude: { id: 'collection.media.sources', defaultMessage: 'Sources To Include' },
  tabSource: { id: 'collection.media.addSource', defaultMessage: 'Add Existing Source' },
  tabSourceIntro: { id: 'collection.media.addSource.intro', defaultMessage: 'You can add individual sources to this collection by searching for their name or url:' },
  tabCollection: { id: 'collection.media.addCollection', defaultMessage: 'Import From Collection' },
  tabCollectionIntro: { id: 'collection.media.addCollection.intro', defaultMessage: 'You can import all the sources from another collection into this one.  This is useful for "merging" collections.  Just search for the collection to import sources from:' },
  tabUpload: { id: 'collection.media.addSpreadsheet', defaultMessage: 'Upload a Spreadsheet' },
  tabUrls: { id: 'collection.media.addURLs', defaultMessage: 'Add URLs Manually' },
  sourceUrlHint: { id: 'collection.media.addURLs.hint', defaultMessage: 'Type in the URLs of each media source, one per line.' },
  sourcesAddedFeedback: { id: 'collection.media.sources.addedFeedback',
    defaultMessage: 'Added {sourceCount, plural,\n =0 {nothing}\n =1 {one source}\n other {# sources}}',
  },
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
    this.addSources(collection.media);
    this.setState({ collectionId: null });
  }

  // make sure we don't add sources that are already on the list
  addSources = (sources) => {
    const { fields, currentSources, onSourcesAdded } = this.props;
    const existingSourceIds = currentSources ? currentSources.map(source => source.media_id) : [];
    let countAdded = 0;
    sources.forEach((m) => {
      if (!existingSourceIds.includes(m.id)) {
        fields.unshift(m);
        countAdded += 1;
      }
    });
    onSourcesAdded(countAdded);
  }

  mergeSourcesFromCollectionsOrSearch = (searchResults) => {
    if (searchResults) {
      this.addSources(searchResults);
    }
  }
  render() {
    const { submitButton, fields, meta: { error }, currentSources, editCollectionId } = this.props;
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
    // show a extra submit button for convenience at top of long list
    const topButtonContent = (fields.length > EXTRA_BUTTON_LIST_LENGTH) ? submitButton : null;
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
                  <p><FormattedMessage {...localMessages.tabSourceIntro} /></p>
                  <SourceSearchContainer
                    searchCollections={false}
                    onMediaSourceSelected={item => this.addSources([item])}
                  />
                </Tab>
                <Tab label={<FormattedMessage {...localMessages.tabCollection} />} >
                  <h3><FormattedMessage {...localMessages.tabCollection} /></h3>
                  <p><FormattedMessage {...localMessages.tabCollectionIntro} /></p>
                  <SourceSearchContainer
                    searchSources={false}
                    onCollectionSelected={c => this.pickCollectionToCopy(c.tags_id)}
                  />
                  {copyConfirmation}
                </Tab>
                <Tab label={<FormattedMessage {...localMessages.tabUpload} />} >
                  <h3><FormattedMessage {...localMessages.tabUpload} /></h3>
                  <CollectionUploadSourceContainer
                    onConfirm={item => this.addSources(item)}
                    mysources={currentSources}
                    myCollectionId={editCollectionId}
                  />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </div>

        <div className="form-section collection-media-form-list">
          <Row>
            <Col lg={10}>
              {topButtonContent}
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
                        <tr key={info.input.value.media_id ? info.input.value.media_id : info.input.value.id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                          <td>
                            <img className="google-icon" src={googleFavIconUrl(info.input.value.url)} alt={info.input.value.name} />
                          </td>
                          <td>
                            <Link to={`/sources/${info.input.value.media_id ? info.input.value.media_id : info.input.value.id}`}>{info.input.value.name}</Link>
                          </td>
                          <td>
                            <a href={`${info.input.value.url}`} target="_new">{info.input.value.url}</a>
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
  // from form heper
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
  initialValues: React.PropTypes.object,
  // from parent
  submitButton: React.PropTypes.node,
  currentSources: React.PropTypes.array,
  editCollectionId: React.PropTypes.string,
  onSourcesAdded: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

const CollectionMediaForm = props => (
  <div>
    <FieldArray
      name="sources"
      component={SourceSelectionRenderer}
      currentSources={props.currentSources}
      editCollectionId={props.initialValues.id}
      onSourcesAdded={props.handleSourceAdded}
      submitButton={props.submitButton}
      intl={props.intl}
    />
  </div>
);


CollectionMediaForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from form helper
  // from parent
  submitButton: React.PropTypes.node,
  // from state
  currentSources: React.PropTypes.array,
  // from dispatch
  handleSourceAdded: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentSources: formSelector(state, 'sources'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSourceAdded: (sourceCount) => {
    const message = ownProps.intl.formatMessage(localMessages.sourcesAddedFeedback, { sourceCount });
    dispatch(updateFeedback({ open: true, message }));
  },
});

function validate() {
  const errors = {};
  return errors;
}

const reduxFormConfig = {
  form: 'collectionForm', // make sure this matches the sub-components and other wizard steps
  validate,
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps)(
        CollectionMediaForm
      )
    )
  );
