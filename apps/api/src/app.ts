import express, { type ErrorRequestHandler } from 'express';

/**
 * Builds the Express application without starting it.
 *
 * Keeping "build the app" separate from "listen on a port" (server.ts) lets tests
 * send requests to the app directly with Supertest, with no real network port.
 */
export function createApp() {
  const app = express();

  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Any /api route that did not match above.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: { code: 'not_found', message: 'Route not found' } });
  });

  // Central error handler: one place decides how errors become responses.
  // Express recognises it as an error handler because it takes four arguments.
  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: { code: 'internal', message: 'Something went wrong' } });
  };
  app.use(errorHandler);

  return app;
}
