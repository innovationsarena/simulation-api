const path = require('path');
require('tsconfig-paths/register');

const { register } = require('tsconfig-paths');
const { loadConfig } = require('tsconfig-paths');

// Override to use dist paths for production
const config = loadConfig(path.join(__dirname, 'tsconfig.json'));

if (config.resultType === 'success') {
  // Update baseUrl to point to dist
  register({
    baseUrl: path.join(__dirname, 'dist'),
    paths: config.paths
  });
}
