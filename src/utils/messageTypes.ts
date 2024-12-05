export const MessageTypes = {
    API_REQUEST: 'API_REQUEST',
    CHECK_SESSION: 'CHECK_SESSION',
    SESSION_STATUS: 'SESSION_STATUS',
    CHECK_COOKIE: 'CHECK_COOKIE',
    REQUEST_PERMISSION: 'REQUEST_ORIGIN_PERMISSION',
    TOGGLE_EXTENSION: 'TOGGLE_EXTENSION',
    OPEN_TAB: 'OPEN_TAB'
  } as const;
  
  export type MessageType = typeof MessageTypes[keyof typeof MessageTypes];
  
  export interface ApiRequestMessage {
    type: typeof MessageTypes.API_REQUEST;
    endpoint: string;
    options?: RequestInit;
  }
  
  export interface SessionCheckMessage {
    type: typeof MessageTypes.CHECK_SESSION;
  }
  
  export interface SessionStatusMessage {
    type: typeof MessageTypes.SESSION_STATUS;
    payload: {
      isLoggedIn: boolean;
      currentUser?: any;
    };
  }
  
  export type ChromeMessage = 
    | ApiRequestMessage 
    | SessionCheckMessage 
    | SessionStatusMessage;