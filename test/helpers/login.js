import config from '../../config/test.config'

export default function (nightmare) {
  nightmare.type('.login-form input[type=text]', config.username)
           .type('.login-form input[type=password]', config.password)
           .click('.login-form .app-button button');
}