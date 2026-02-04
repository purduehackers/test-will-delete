export default {
    async fetch(request, env) {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      };
  
      // Check for preflight request from the browser.
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            ...corsHeaders,
            'Access-Control-Allow-Headers': request.headers.get(
              'Access-Control-Request-Headers'
            ),
          }
        });
      } else {
        // Handle actual request and store image to bucket.
        const { headers } = request;
        
        // Key is date now since we want keys to be unique. 
        const key = Date.now();
        await env.MY_BUCKET.put(key, request.body, {
          httpMetadata: {
            contentType: headers.get('content-type')
          }
        });
  
        return new Response('success!', {
          headers: {
            ...corsHeaders,
            'Access-Control-Allow-Headers': request.headers.get(
              'Access-Control-Request-Headers'
            ),
          }
        });
      }
    }
  }