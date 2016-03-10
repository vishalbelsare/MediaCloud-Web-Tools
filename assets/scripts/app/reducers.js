import { LEFT_NAV_VISIBILITY } from './actions'

function leftNavVisibility(state = false, action) {
  switch (action.type) {
  case LEFT_NAV_VISIBILITY:
    return action.visible
  default:
    return state
  }
}

export default leftNavVisibility