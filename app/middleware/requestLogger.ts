/**
 * Global Middleware for logging incoming HTTP requests on the server side
 * to track processing time and response status.
 */
export async function requestLoggerMiddleware(
  { request }: { request: Request },
  next: () => Promise<Response>
) {
  const startTime = Date.now();
  const url = new URL(request.url);
  
  // Skip logging static assets and hot-reload checks to avoid noise
  if (url.pathname.startsWith("/_") || url.pathname.startsWith("/@") || url.pathname.includes(".")) {
    return next();
  }

  console.log(`[Request] ${request.method} ${url.pathname}`);
  
  try {
    const response = await next();
    const duration = Date.now() - startTime;
    console.log(`[Response] ${request.method} ${url.pathname} - Status: ${response.status} (${duration}ms)`);
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Response Error] ${request.method} ${url.pathname} - Failed in ${duration}ms`, error);
    throw error;
  }
}
