export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
}

export interface JiraSession {
  isLoggedIn: boolean;
  currentUser?: JiraUser;
}