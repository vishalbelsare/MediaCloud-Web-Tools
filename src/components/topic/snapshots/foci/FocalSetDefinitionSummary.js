import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { DeleteButton, AddButton } from '../../../common/IconButton';
import KeywordSearchIcon from '../../../common/icons/KeywordSearchIcon';
import DataCard from '../../../common/DataCard';
import FocusDefinition from './FocusDefinition';

const localMessages = {
  focalSetAdd: { id: 'focalSets.delete', defaultMessage: 'Add another Subtopic to this Set' },
  focalSetDelete: { id: 'focalSets.delete', defaultMessage: 'Delete this entire Set' },
  focalSetTechnique: { id: 'focalSets.technique', defaultMessage: 'Technique: {technique}' },
  focusCount: { id: 'focalSets.focus.count',
    defaultMessage: 'Number of Subtopics: {count, plural,\n =0 {none}\n =1 {one}\n other {#}}',
  },
  focalSetName: { id: 'focalSets.name', defaultMessage: 'Set: {name}' },
  focalSetDescription: { id: 'focalSets.description', defaultMessage: 'Description: {description}' },
};

class FocalSetDefinitionSummary extends React.Component {

  handleDelete = (event) => {
    const { focalSetDefinition, onDelete } = this.props;
    event.preventDefault();
    if ((onDelete !== undefined) && (onDelete !== null)) {
      onDelete(focalSetDefinition);
    }
  }

  render() {
    const { focalSetDefinition, onFocusDefinitionDelete, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard
        className="focal-set-definition-summary"
        data-focal-set-definitions-id={focalSetDefinition.focal_set_definitions_id}
        inline
      >
        <Row>
          <Col lg={9} md={9} sm={8} xs={12}>
            <h2>
              <KeywordSearchIcon />
              <FormattedMessage
                {...localMessages.focalSetName}
                values={{ name: focalSetDefinition.name }}
              />
            </h2>
            <p>
              <FormattedMessage
                {...localMessages.focalSetDescription}
                values={{ description: focalSetDefinition.description }}
              />
              <br />
              <FormattedMessage
                {...localMessages.focalSetTechnique}
                values={{ technique: focalSetDefinition.focal_technique }}
              />
              <br />
              <FormattedMessage
                {...localMessages.focusCount}
                values={{ count: focalSetDefinition.focus_definitions.length }}
              />
            </p>
          </Col>
          <Col lg={3} md={3} sm={4} xs={12}>
            <div className="controls">
              <AddButton
                tooltip={formatMessage(localMessages.focalSetAdd)}
                linkTo={`/topics/${topicId}/snapshot/foci/create?focalSetDefId=${focalSetDefinition.focal_set_definitions_id}&focalTechnique=${focalSetDefinition.focal_technique}`}
              />
              <FormattedMessage {...localMessages.focalSetAdd} />
              <br />
              <DeleteButton onClick={this.handleDelete} tooltip={formatMessage(localMessages.focalSetDelete)} />
              <FormattedMessage {...localMessages.focalSetDelete} />
            </div>
          </Col>
        </Row>
        <Row>
          {focalSetDefinition.focus_definitions.map(focusDef => (
            <Col lg={4} md={4} sm={6} xs={12} key={`fs-${focusDef.focus_definitions_id}`}>
              <FocusDefinition
                topicId={topicId}
                key={focusDef.focus_definitions_id}
                focusDefinition={focusDef}
                onDelete={onFocusDefinitionDelete}
              />
            </Col>
          ))}
        </Row>
      </DataCard>
    );
  }

}

FocalSetDefinitionSummary.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  focalSetDefinition: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onFocusDefinitionDelete: PropTypes.func.isRequired,
  topicId: PropTypes.number.isRequired,
};

export default
  injectIntl(
    FocalSetDefinitionSummary
  );
