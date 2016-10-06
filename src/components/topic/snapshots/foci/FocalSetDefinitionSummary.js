import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { DeleteButton, AddButton } from '../../../common/IconButton';
import KeywordSearchIcon from '../../../common/icons/KeywordSearchIcon';
import DataCard from '../../../common/DataCard';
import FocusDefinition from './FocusDefinition';

const localMessages = {
  focalSetAdd: { id: 'focalSets.delete', defaultMessage: 'Add another Focus to this Set' },
  focalSetDelete: { id: 'focalSets.delete', defaultMessage: 'Delete this entire Set' },
  focalSetTechnique: { id: 'focalSets.technique', defaultMessage: 'Focal Technique: {technique}' },
  focusCount: { id: 'focalSets.focus.count',
    defaultMessage: 'Number of Foci: {count, plural,\n =0 {none}\n =1 {one}\n other {#}}',
  },
  focalSetName: { id: 'focalSets.name', defaultMessage: 'Set: {name}' },
  focalSetDescription: { id: 'focalSets.description', defaultMessage: 'Description: {description}' },
};

class FocalSetDefinitionSummary extends React.Component {

  handleOnAddClick = (event) => {
    const { focalSetDefinition, onAddClick } = this.props;
    event.preventDefault();
    if ((onAddClick !== undefined) && (onAddClick !== null)) {
      onAddClick(focalSetDefinition);
    }
  }

  handleOnDeleteClick = (event) => {
    const { focalSetDefinition, onDeleteClick } = this.props;
    event.preventDefault();
    if ((onDeleteClick !== undefined) && (onDeleteClick !== null)) {
      onDeleteClick(focalSetDefinition);
    }
  }

  render() {
    const { focalSetDefinition } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard className="focal-set-definition-summary">
        <Row>
          <Col lg={9} md={9} sm={12}>
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
          <Col lg={3} md={3} sm={12}>
            <div className="controls">
              <AddButton onClick={this.handleOnAddClick} tooltip={formatMessage(localMessages.focalSetAdd)} />
              <FormattedMessage {...localMessages.focalSetAdd} />
              <br />
              <DeleteButton onClick={this.handleOnDeleteClick} tooltip={formatMessage(localMessages.focalSetDelete)} />
              <FormattedMessage {...localMessages.focalSetDelete} />
            </div>
          </Col>
        </Row>
        <Row>
          {focalSetDefinition.focus_definitions.map(focusDef => (
            <Col lg={4} md={4} sm={12}>
              <FocusDefinition
                key={focusDef.focus_definitions_id}
                focusDefinition={focusDef}
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
  intl: React.PropTypes.object.isRequired,
  // from parent
  focalSetDefinition: React.PropTypes.object.isRequired,
  onAddClick: React.PropTypes.func,
  onDeleteClick: React.PropTypes.func,
};

export default
  injectIntl(
    FocalSetDefinitionSummary
  );
