/* @flow */

import { Paratii } from 'paratii-lib/lib/paratii'

let instance

export default (config = {}) => {
  if (!instance) {
    instance = new Paratii({
      ...config,
      registryAddress: '0x9e2d04eef5b16CFfB4328Ddd027B55736407B275',
      privateKey: '399b141d0cc2b863b2f514ffe53edc6afc9416d5899da4d9bd2350074c38f1c6'
    })
  }

  return instance
}
