/* @flow */

import { handleActions } from 'redux-actions'

import type { Action } from 'types/ApplicationTypes'
import { LOGIN_REQUESTED, LOGIN_SUCCESS } from 'constants/ActionConstants'
import UserRecord from 'records/UserRecords'

const reducer = {
  [LOGIN_REQUESTED]: (
    state: UserRecord
  ): UserRecord => {
    return state.set('isLoggingIn', true)
  },
  [LOGIN_SUCCESS]: (
    state: UserRecord,
    { payload }: Action<{email: string}>
  ): UserRecord => {
    return state
      .set('isLoggingIn', false)
      .set('email', payload.email)
  }
}

export default handleActions(reducer, new UserRecord())
