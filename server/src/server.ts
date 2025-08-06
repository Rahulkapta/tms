import app from "./app";
import { logger, initializeLogger } from "./config/logger.config";
import { connectDatabase } from "./config/mongodb.config";

// Initialize logger and database connection
initializeLogger();
connectDatabase();

// For Vercel deployment, we don't need to call app.listen()
// Vercel handles the serverless function execution
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    logger.info(`⚡️[server]: Server is running at ${PORT}...`);
  });

export default app;
