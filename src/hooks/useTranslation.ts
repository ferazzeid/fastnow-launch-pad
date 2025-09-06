import { useTranslation as useI18nTranslation } from 'react-i18next';

// Re-export the useTranslation hook with our custom types
export const useTranslation = (namespace?: string | string[]) => {
  return useI18nTranslation(namespace);
};

// Custom hook for common translations
export const useCommonTranslation = () => {
  return useI18nTranslation('common');
};

// Custom hook for navigation translations
export const useNavigationTranslation = () => {
  return useI18nTranslation('navigation');
};

// Custom hook for form translations
export const useFormTranslation = () => {
  return useI18nTranslation('forms');
};