import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, fileName } = await req.json();
    
    if (!file || !fileName) {
      return new Response(
        JSON.stringify({ error: 'File and fileName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imagekitPrivateKey = Deno.env.get('IMAGEKIT_PRIVATE_KEY');

    if (!imagekitPrivateKey) {
      console.error('IMAGEKIT_PRIVATE_KEY not found');
      return new Response(
        JSON.stringify({ error: 'ImageKit configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Basic Auth header
    const authString = btoa(`${imagekitPrivateKey}:`);
    
    // Upload to ImageKit
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('useUniqueFileName', 'true');

    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('ImageKit upload error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to upload to ImageKit' }),
        { status: uploadResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await uploadResponse.json();
    
    console.log('Upload successful:', result.url);

    return new Response(
      JSON.stringify({ 
        url: result.url,
        fileId: result.fileId,
        name: result.name 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in upload-to-imagekit:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
