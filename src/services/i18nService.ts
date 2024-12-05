// src/services/I18nService.ts
class I18nService {
    private static instance: I18nService;
    private currentLang: string = 'en';
    
    private translations: Record<string, Record<string, string>> = {
      en: {
        // Common translations
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        
        // Settings translations
        'settings.language': 'Language',
        'settings.appearance': 'Appearance',
        'settings.contentSize': 'Content Size',
        'settings.shortcut': 'Shortcut',
        'settings.sidebarPosition': 'Sidebar Position',
        'settings.powerUpBar': 'Power-Up Bar',
        
        // Error translations
        'error.invalidShortcut': 'Invalid shortcut format',
        'error.requiredField': 'This field is required',
        'error.networkError': 'Network connection failed',
      },
      fr: {
        // French translations
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.loading': 'Chargement...',
        'common.error': 'Une erreur est survenue',
        
        'settings.language': 'Langue',
        'settings.appearance': 'Apparence',
        'settings.contentSize': 'Taille du Contenu',
        'settings.shortcut': 'Raccourci',
        'settings.sidebarPosition': 'Position de la Barre Latérale',
        'settings.powerUpBar': 'Barre de Puissance',
        
        'error.invalidShortcut': 'Format de raccourci invalide',
        'error.requiredField': 'Ce champ est requis',
        'error.networkError': 'Échec de la connexion réseau',
      }
    };
  
    private constructor() {}
  
    public static getInstance(): I18nService {
      if (!I18nService.instance) {
        I18nService.instance = new I18nService();
      }
      return I18nService.instance;
    }
  
    // Set current language
    setLanguage(lang: string) {
      if (this.translations[lang]) {
        this.currentLang = lang;
      } else {
        console.warn(`Language ${lang} not supported. Defaulting to English.`);
        this.currentLang = 'en';
      }
    }
  
    // Get current language
    getCurrentLanguage(): string {
      return this.currentLang;
    }
  
    // Translate a key
    translate(key: string, params?: Record<string, string>): string {
      const translation = this.translations[this.currentLang][key] || 
                          this.translations['en'][key] || 
                          key;
  
      // Replace parameters if provided
      if (params) {
        return Object.entries(params).reduce(
          (result, [k, v]) => result.replace(`{${k}}`, v),
          translation
        );
      }
  
      return translation;
    }
  
    // Get available languages
    getAvailableLanguages(): string[] {
      return Object.keys(this.translations);
    }
  }
  
  export const i18n = I18nService.getInstance();