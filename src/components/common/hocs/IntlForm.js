import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import NoSsr from '@material-ui/core/NoSsr';

/**
 * Helpful compositional wrapper for forms that want to use Material-UI, react-intl and redux-form.
 * This exposes render methods that you can use with redux-form's <Field> tag.  Pass in message objects
 * instead of strings for anything you want localized (error messages, hint text, etc.).
 */
function withIntlForm(Component) {
  class IntlFormForm extends React.Component {
    intlIfObject = (value) => {
      if (typeof value === 'object') {
        return <FormattedMessage {...value} />;
      }
      return value;
    };

    intlCustomProps = (customProps) => {
      const intlCustom = Object.assign({}, customProps);
      ['label', 'floatingLabelText', 'hintText', 'errorText', 'disabled'].forEach((prop) => {
        if ((prop in customProps)) {
          intlCustom[prop] = this.intlIfObject(customProps[prop]);
        }
      });
      return intlCustom;
    };

    renderTextField = ({ input, meta: { touched, error, warning }, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <TextField
          className="form-field-text"
          errorText={touched &&
            ((error ? this.intlIfObject(error) : null)
              || (warning ? this.intlIfObject(warning) : null))}
          {...input}
          {...intlCustom}
        />
      );
    };
    renderTextFieldWithFocus = ({ input, saveRef, meta: { touched, error, warning }, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);

      return (
        <TextField
          className="form-field-text"
          errorText={touched &&
            ((error ? this.intlIfObject(error) : null)
              || (warning ? this.intlIfObject(warning) : null))}
          ref={saveRef}
          {...input}
          {...intlCustom}
        />
      );
    };

    renderCheckbox = ({ input, label, disabled }) => (
      <Checkbox
        name={input.name}
        className="form-field-checkbox"
        label={this.intlIfObject(label)}
        checked={input.value === true || input.value === 1}
        onCheck={input.onChange}
        disabled={this.intlIfObject(disabled)}
      />
    );

    renderSelect = ({ input, meta: { touched, error }, children, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <Select
          className="form-field-select"
          errorText={touched && (error ? this.intlIfObject(error) : null)}
          {...input}
          onChange={(event, index, value) => input.onChange(value)}
          {...intlCustom}
        >
          {children}
        </Select>
      );
    }

    renderNoSsr = ({ input, meta: { touched, error }, onNewRequest: onNewRequestFunc, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <NoSsr
          className="form-field-NoSsr"
          {...input}
          errorText={touched && (error ? this.intlIfObject(error) : null)}
          onNewRequest={(currentValue, index) => {
            if (onNewRequestFunc && typeof onNewRequestFunc === 'function') {
              onNewRequestFunc(currentValue, index);
            }
            return input.onChange(intlCustom.dataSourceConfig ? currentValue[intlCustom.dataSourceConfig.value] : currentValue);
          }}
          {...intlCustom}
          filter={NoSsr.fuzzyFilter}
        />
      );
    }


    render() {
      const helpers = {
        renderTextField: this.renderTextField,
        renderCheckbox: this.renderCheckbox,
        renderSelect: this.renderSelect,
        renderNoSsr: this.renderNoSsr,
        renderTextFieldWithFocus: this.renderTextFieldWithFocus,
      };
      return (
        <Component {...this.props} {...helpers} />
      );
    }

  }

  IntlFormForm.propTypes = {
    intl: PropTypes.object.isRequired,
  };

  return injectIntl(IntlFormForm);
}

export default withIntlForm;
