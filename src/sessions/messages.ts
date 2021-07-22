export default {
  sessions: {
    title: "Sessions",
    sessionExplain: "Some description about sessions",
    searchForSession: "Search session",
    subject: "Subject",
    lastAccess: "Last access",
    startDate: "Start date",
    accessedClients: "Accessed clients",
    sessionsType: {
      allSessions: "All session types",
      regularSSO: "Regular SSO",
      offline: "Offline",
      directGrant: "Direct grant",
      serviceAccount: "Service account",
    },
    revocation: "Revocation",
    revocationDescription:
      "This is a way to revoke all active sessions and access tokens. Not before means you can revoke any tokens issued before the date.",
    notBefore: "Not before",
    notBeforeSuccess: 'Success! "Not before" set for realm',
    notBeforeError: 'Error clearing "Not Before" for realm: {{error}}',
    notBeforeClearedSuccess: 'Success! "Not Before" cleared for realm.',
    signOutAllActiveSessions: "Sign out all active sessions",
    pushError:
      "Error! Failed to push notBefore to: {{adminURIList}}. Verify availability of failed hosts and try again.",
    setToNow: "Set to now",
    clear: "Clear",
    push: "Push",
    none: "None",
  },
};
