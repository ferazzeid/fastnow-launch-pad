import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  context?: string;
}

const LANGUAGE_NAMES = {
  'ar': 'Arabic',
  'ru': 'Russian',
  'de': 'German',
  'en': 'English'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { text, targetLanguage, sourceLanguage = 'en', context = '' }: TranslationRequest = await req.json();

    if (!text || !targetLanguage) {
      throw new Error('Text and target language are required');
    }

    // Check if translation already exists in cache
    const cacheKey = `${text}-${targetLanguage}`;
    const { data: cachedTranslation } = await supabase
      .from('ui_translations')
      .select('translated_text')
      .eq('translation_key', cacheKey)
      .eq('language_code', targetLanguage)
      .single();

    if (cachedTranslation) {
      console.log('Returning cached translation');
      return new Response(JSON.stringify({ 
        translatedText: cachedTranslation.translated_text,
        cached: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare system prompt based on target language
    let systemPrompt = `You are a professional translator. Translate the following text to ${LANGUAGE_NAMES[targetLanguage] || targetLanguage}. 

Important guidelines:
- Maintain the tone and style of the original text
- Preserve any HTML tags, markdown formatting, or special characters
- For technical terms, use commonly accepted translations
- For brand names like "FastNow", keep them unchanged unless there's a standard localized version
- Ensure cultural appropriateness for the target audience
${context ? `- Context: ${context}` : ''}`;

    // Add specific instructions for each language
    if (targetLanguage === 'ar') {
      systemPrompt += `
- Use Modern Standard Arabic (فصحى)
- Ensure proper right-to-left text flow
- Use appropriate Arabic punctuation
- For technical/medical terms, use the most commonly accepted Arabic equivalents`;
    } else if (targetLanguage === 'ru') {
      systemPrompt += `
- Use contemporary Russian
- Apply proper case declensions
- Use formal tone (вы form) unless context suggests informal
- Maintain proper Cyrillic typography`;
    } else if (targetLanguage === 'de') {
      systemPrompt += `
- Use Standard German (Hochdeutsch)
- Apply proper capitalization rules for nouns
- Use formal address (Sie) for user-facing content
- Handle compound words appropriately`;
    }

    // Make API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Translate this text: "${text}"` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;

    // Cache the translation
    try {
      await supabase
        .from('ui_translations')
        .upsert({
          translation_key: cacheKey,
          language_code: targetLanguage,
          translated_text: translatedText,
        });
    } catch (cacheError) {
      console.error('Failed to cache translation:', cacheError);
      // Continue anyway - don't fail the request if caching fails
    }

    console.log(`Translated "${text}" to ${targetLanguage}: "${translatedText}"`);

    return new Response(JSON.stringify({ 
      translatedText,
      cached: false,
      sourceLanguage,
      targetLanguage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackText: 'Translation unavailable' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});