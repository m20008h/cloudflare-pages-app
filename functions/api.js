// Cloudflare Pages Function for API endpoints
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API endpoint
  if (url.pathname === '/api/data') {
    if (request.method === 'GET') {
      const data = {
        message: 'Hello from Cloudflare Pages Function!',
        timestamp: new Date().toISOString(),
        location: 'Cloudflare Edge',
        request_info: {
          method: request.method,
          url: url.href,
          user_agent: request.headers.get('user-agent') || 'Unknown',
        },
        function_info: {
          region: 'Global Edge Network',
          method: 'Pages Function'
        }
      };

      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  // 404 for other routes
  return new Response('Not Found', { status: 404 });
}