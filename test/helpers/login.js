import config from '../../config/test.config';
import { SUBMIT_BUTTON, inputNamed } from './dom';

// helper that will login for you
const login = (nightmare) => {
  nightmare.insert(inputNamed('email'), config.username)
           .insert(inputNamed('password'), config.password)
           .click(SUBMIT_BUTTON);
};

export default login;
