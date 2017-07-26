import config from '../../config/test.config';

// helper that will login for you
const login = (nightmare) => {
  nightmare.insert('.login-form input[type=text]', config.username)
           .insert('.login-form input[type=password]', config.password)
           .click('.login-form .app-button button');
};

export default login;
