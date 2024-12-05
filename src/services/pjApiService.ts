type SipInfo = {
    sipOutboundHost: string;
    sipOutboundPort: string;
    registrar: string;
  };
  
  type RegisterPhoneRequest = {
    physicalId: string;
    password: string;
    sip: SipInfo;
    userAgent: string;
  };
  
  type LineItem = {
    owner_number: string;
    remote_number: string;
    state: string;
    status_code: number;
    reason: string;
  };
  
  type RegisterPhoneResponse = {
    id: number;
    lines: {
      items: LineItem[];
    };
  };
  
  type ErrorResponse = {
    message?: string;
    detail?: {
      loc: (string | number)[];
      msg: string;
      type: string;
    }[];
  };
  
  // Base API URL
  const BASE_URL = "https://api.example.com"; // Replace with the actual base URL
  
  /**
   * Register a phone.
   * @param phoneData The data for the phone to register.
   * @returns The registered phone's response data or an error message.
   */
  export async function registerPhone(
    phoneData: RegisterPhoneRequest
  ): Promise<RegisterPhoneResponse | ErrorResponse> {
    try {
      const response = await fetch(`${BASE_URL}/phones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(phoneData),
      });
  
      if (response.status === 201) {
        return await response.json(); // Successfully registered
      } else if (response.status === 422 || response.status === 500) {
        return await response.json(); // Validation or server error
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error registering phone:", error.message);
      throw new Error("An error occurred while registering the phone.");
    }
  }
  
  /**
   * Initiate a call to a number using a specific phone.
   * @param phoneId The ID of the phone.
   * @param number The number to call.
   * @returns The call's response data or an error message.
   */
  export async function makeCall(
    phoneId: string,
    number: string
  ): Promise<RegisterPhoneResponse | ErrorResponse> {
    try {
      const response = await fetch(`${BASE_URL}/phones/call/${phoneId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number }),
      });
  
      if (response.status === 200) {
        return await response.json(); // Call initiated successfully
      } else if (response.status === 401 || response.status === 404) {
        return await response.json(); // Unauthorized or not found
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error making a call:", error.message);
      throw new Error("An error occurred while making the call.");
    }
  }