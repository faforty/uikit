const Path = require('path');

// Extend Base Config
const config = module.exports = require('./webpack');

// This is a node.js bundle
config.target = 'node';

config.entry={
  bootstrapVue: Path.resolve(__dirname, '../index.js'),
};

// Output settings
config.output.filename = '/js/uikit.common.js';
config.output.libraryTarget = 'commonjs2';
