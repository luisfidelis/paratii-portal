const fs = require('fs')
const path = require('path')
const { Paratii } = require('paratii-lib')

const env = process.env.NODE_ENV || 'development'

const configFilename = path.join(__dirname, `/../../config/${env}.json`)

const config = require(configFilename)

const paratii = new Paratii(config)
let newConfig

function deployContracts () {
  paratii.eth.deployContracts()
    .then(
      () => paratii.eth.getRegistryAddress()
    )
    .then(
      registryAddress => {
        console.log(`new registry address: ${registryAddress}`)
        newConfig = {
          ...config,
          registryAddress
        }
        fs.writeFileSync(configFilename, JSON.stringify(newConfig, null, 2), 'utf-8')
        let msg = `written new configuation to ${configFilename}`
        console.log(msg)

        return msg
      }
    )
    .then(
      () => paratii.diagnose()
    )
    .then(
      (diagnosis) => console.log(diagnosis)
    )
}
deployContracts()