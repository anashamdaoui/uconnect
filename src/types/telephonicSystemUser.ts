export interface TelephonyUser {
    Id: string;
    entId: string;
    displayName: string;
    emailAddress: string;
  }
  
  export interface TelephonySession {
    isLoggedIn: boolean;
    currentUser?: TelephonyUser;
  }