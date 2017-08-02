import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Captcha = props => (
  <div className="captcha">
    <ReCAPTCHA sitekey={document.appConfig.captchaSiteKey} onChange={props.onChange} />
  </div>
);

Captcha.propTypes = {
  onChange: React.PropTypes.func.isRequired,
};

export default Captcha;
