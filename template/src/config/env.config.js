import pkg from '../../package.json'

const env = process.env.ENV;
const version = pkg.version;

export {
    env,
    version
};