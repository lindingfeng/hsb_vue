let _setup = false

const setup = ({ dev }) => {
  // Apply default NODE_ENV if not provided
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = dev ? 'development' : 'production'
  }

  if (_setup) {
    return;
  }
  _setup = true;

  // Global error handler
  /* istanbul ignore next */
  process.on('unhandledRejection', (err) => {
    console.error(err)
  })

}

module.exports = setup;
