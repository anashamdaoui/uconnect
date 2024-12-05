export function findPhoneNumbers(text: string): string[] {
    // Match various phone number formats
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?(\d{3,4}[-.\s]?)?\d{3,4}/g;
    console.log("findPhoneNumbers: ", text.match(phoneRegex));
    return text.match(phoneRegex) || [];
  }
  
  export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    /*if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Format with country code
    if (cleaned.length > 10) {
      const countryCode = cleaned.slice(0, cleaned.length - 10);
      const rest = cleaned.slice(-10);
      return `+${countryCode} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
    }*/
    
    return phone; // Return original if format doesn't match
  }