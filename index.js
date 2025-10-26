// Railway entry point - use dynamic import for ES modules
import('./server/server.js')
  .then(() => {
    console.log('Server started successfully');
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
