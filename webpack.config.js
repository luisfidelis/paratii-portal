const webpack = require('webpack')
const fs = require('fs')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')

const srcDir = path.resolve(__dirname, 'src')
const configDir = path.resolve(__dirname, 'config')
const scriptsDir = srcDir + '/scripts'
const embedDir = scriptsDir + '/embed'
const assetsDir = srcDir + '/assets'
const stylesDir = srcDir + '/styles'
const buildDir = path.resolve(__dirname, 'build')
const testDir = path.resolve(__dirname, 'test')
const unitTestsDir = testDir + '/unit-tests'
const functionalTestsDir = testDir + '/functional-tests'

const dev = process.env.NODE_ENV === 'development'
const test = process.env.NODE_ENV === 'test'
const staging = process.env.NODE_ENV === 'staging'
const prod = process.env.NODE_ENV === 'production'

const definedVariables = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
}

const registryConfigPath = `/tmp/registry.json`

if ((dev || test) && fs.existsSync(registryConfigPath)) {
  const registryConfig = JSON.parse(fs.readFileSync(registryConfigPath, 'utf8'))
  // const registryConfig = require(registryConfigPath)

  definedVariables['process.env.REGISTRY_ADDRESS'] = JSON.stringify(
    registryConfig.registryAddress
  )
}

const config = {
  entry: {
    bundle: prod || staging
      ? [scriptsDir + '/index.js']
      : [
        'react-hot-loader/patch',
        scriptsDir + '/index.js',
        'webpack-hot-middleware/client?quiet=true'
      ],
    'embed/bundle': embedDir + '/index.js'
  },
  output: {
    chunkFilename: '[name].bundle.js',
    filename: '[name].js',
    path: buildDir,
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    alias: {
      clappr: 'clappr/dist/clappr.min',
      config: configDir,
      scripts: scriptsDir,
      styles: stylesDir,
      assets: assetsDir,
      components: scriptsDir + '/components',
      constants: scriptsDir + '/constants',
      actions: scriptsDir + '/actions',
      operators: scriptsDir + '/operators',
      reducers: scriptsDir + '/reducers',
      records: scriptsDir + '/records',
      containers: scriptsDir + '/containers',
      selectors: scriptsDir + '/selectors',
      apis: scriptsDir + '/apis',
      adapters: scriptsDir + '/adapters',
      types: scriptsDir + '/types',
      utils: scriptsDir + '/utils',
      'test-utils': testDir + '/test-utils',
      'unit-tests': unitTestsDir,
      'functional-tests': functionalTestsDir
    },
    aliasFields: ['browser']
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [srcDir, testDir],
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: assetsDir,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/'
            }
          }
        ]
      },
      {
        test: /\.(svg)$/,
        include: assetsDir,
        use: 'svg-url-loader'
      },
      {
        test: /\.scss$/,
        include: stylesDir,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  devtool: prod ? undefined : 'eval-source-map',
  devServer: prod || staging
    ? {}
    : {
      hot: true
    },
  plugins: [
    new webpack.DefinePlugin(definedVariables),
    prod || staging
      ? new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          ecma: 6,
          mangle: {
            reserved: [
              'DAGNode',
              'DAGLink',
              'Name',
              'Tsize',
              'Hash',
              'Block',
              '_idB58String',
              'Multiaddr',
              'WebSockets'
            ]
          },
          compress: false,
          parallel: true,
          safari10: true
        }
      })
      : new webpack.HotModuleReplacementPlugin()
  ]
}

if (process.env.ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config
