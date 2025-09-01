import { supabase } from "@/integrations/supabase/client";

export interface CalculatorSettings {
  id: string;
  calculator_type: 'walking' | 'weight_loss';
  background_image_url?: string;
  background_color: string;
  created_at: string;
  updated_at: string;
}

export class CalculatorSettingsService {
  static async getCalculatorSettings(calculatorType: 'walking' | 'weight_loss'): Promise<CalculatorSettings | null> {
    const { data, error } = await supabase
      .from('calculator_settings')
      .select('*')
      .eq('calculator_type', calculatorType)
      .maybeSingle();

    if (error) {
      console.error('Error fetching calculator settings:', error);
      throw error;
    }

    return data as CalculatorSettings | null;
  }

  static async updateCalculatorSettings(
    calculatorType: 'walking' | 'weight_loss',
    settings: Partial<Pick<CalculatorSettings, 'background_image_url' | 'background_color'>>
  ): Promise<CalculatorSettings> {
    const { data, error } = await supabase
      .from('calculator_settings')
      .update(settings)
      .eq('calculator_type', calculatorType)
      .select()
      .single();

    if (error) {
      console.error('Error updating calculator settings:', error);
      throw error;
    }

    return data as CalculatorSettings;
  }

  static async uploadAndSetBackground(calculatorType: 'walking' | 'weight_loss', file: File): Promise<CalculatorSettings> {
    // Upload image to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('calculator-backgrounds')
      .upload(`${calculatorType}-bg-${Date.now()}.${file.name.split('.').pop()}`, file);

    if (uploadError) {
      console.error('Error uploading background image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('calculator-backgrounds')
      .getPublicUrl(uploadData.path);

    // Update calculator settings
    return await this.updateCalculatorSettings(calculatorType, {
      background_image_url: publicUrl
    });
  }

  static async getAllCalculatorSettings(): Promise<CalculatorSettings[]> {
    const { data, error } = await supabase
      .from('calculator_settings')
      .select('*')
      .order('calculator_type');

    if (error) {
      console.error('Error fetching all calculator settings:', error);
      throw error;
    }

    return (data as CalculatorSettings[]) || [];
  }
}