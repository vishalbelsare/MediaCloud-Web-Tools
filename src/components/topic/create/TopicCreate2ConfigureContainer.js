import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, reduxFormConfig } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import composeIntlForm from '../../common/IntlForm';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import messages from '../../../resources/messages';


const localMessages = {
  title: { id: 'topic.create.setup.title', defaultMessage: 'Step 2: Preview Your Topic' },
  about: { id: 'topic.create.setup.about',
    defaultMessage: 'Preview your Topic then click Confim' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'Here is your previewed Topic to add to the MediaCloud system.' },
};

const TopicCreate2PreviewContainer = (props) => {
  const { finishStep } = props;
  const { formatMessage } = props.intl;
  
  const content = (<TopicCreatePreview
    initialValues={initialValues}
    onPreviousStep={handlePreviousStep}
    onNextStep={handleNextStep}
  />);

  return (
    <div>
      { content }
    </div>
  );
};

TopicCreate2PreviewContainer.propTypes = {
  // from parent
  location: React.PropTypes.object.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  currentStep: React.PropTypes.string,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
  // pull the focal set id out of the form so we know when to show the focal set create sub form
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreateTopicStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.goToStep(2);
    },
  });
}

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          TopicCreate2PreviewContainer
        )
      )
    )
  );
