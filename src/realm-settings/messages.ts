export default {
  "realm-settings": {
    partialImport: "Partial import",
    partialExport: "Partial export",
    deleteRealm: "Delete realm",
    deleteConfirmTitle: "Delete realm?",
    dragInstruction: "Click and drag to change priority",
    deleteConfirm:
      "If you delete this realm, all associated data will be removed.",
    deleteProviderTitle: "Delete key provider?",
    deleteProviderConfirm:
      "Are you sure you want to permanently delete the key provider ",
    deleteProviderSuccess: "Success. The provider has been deleted.",
    deleteProviderError: "Error deleting the provider",
    deletedSuccess: "The realm has been deleted",
    deleteError: "Could not delete realm: {{error}}",
    deleteConditionSuccess: "The condition has been deleted",
    disableConfirmTitle: "Disable realm?",
    disableConfirm:
      "User and clients can't access the realm if it's disabled. Are you sure you want to continue?",
    editProvider: "Edit provider",
    saveSuccess: "Realm successfully updated",
    saveProviderSuccess: "The provider has been saved successfully.",
    saveProviderListSuccess:
      "The priority of the provider has been updated successfully.",
    saveProviderError: "Error saving provider: {{error}}",
    saveError: "Realm could not be updated: {{error}}",
    general: "General",
    login: "Login",
    themes: "Themes",
    events: "Events",
    userEventsConfig: "User events configuration",
    userEventsSettings: "User events settings",
    adminEventsConfig: "Admin events configuration",
    adminEventsSettings: "Admin events settings",
    saveEvents: "Save events",
    expiration: "Expiration",
    clearUserEvents: "Clear user events",
    clearAdminEvents: "Clear admin events",
    includeRepresentation: "Include representation",
    email: "Email",
    template: "Template",
    connectionAndAuthentication: "Connection & Authentication",
    from: "From",
    fromDisplayName: "From display name",
    replyTo: "Reply to",
    replyToDisplayName: "Reply to display name",
    envelopeFrom: "Envelope from",
    host: "Host",
    port: "Port",
    encryption: "Encryption",
    authentication: "Authentication",
    enableSSL: "Enable SSL",
    enableStartTLS: "Enable StartTLS",
    username: "Username",
    password: "Password",
    keys: "Keys",
    keysList: "Keys list",
    searchKey: "Search key",
    keystore: "Keystore",
    keystorePassword: "Keystore password",
    keyAlias: "Key alias",
    keyPassword: "Key password",
    providers: "Providers",
    algorithm: "Algorithm",
    aesGenerated: "aes-generated",
    ecdsaGenerated: "ecdsca-generated",
    hmacGenerated: "hmac-generated",
    javaKeystore: "java-keystore",
    rsa: "rsa",
    rsaGenerated: "rsa-generated",
    consoleDisplayName: "Console Display Name",
    AESKeySize: "AES Key Size",
    active: "Active",
    privateRSAKey: "Private RSA Key",
    x509Certificate: "X509 Certificate",
    ellipticCurve: "Elliptic Curve",
    secretSize: "Secret size",
    type: "Type",
    name: "Name",
    providerId: "ID",
    kid: "Kid",
    provider: "Provider",
    providerDescription: "Provider description",
    addProvider: "Add provider",
    publicKeys: "Public keys",
    activeKeys: "Active keys",
    passiveKeys: "Passive keys",
    disabledKeys: "Disabled keys",
    noKeys: "No keys",
    noKeysDescription: "You haven't created any ",
    certificate: "Certificate",
    userRegistration: "User registration",
    userRegistrationHelpText:
      "Enable/disable the registration page. A link for registration will show on login page too.",
    forgotPassword: "Forgot password",
    forgotPasswordHelpText:
      "Show a link on login page for user to click when they have forgotten their credentials.",
    rememberMe: "Remember me",
    rememberMeHelpText:
      "Show checkbox on login page to allow user to remain logged in between browser restarts until session expires.",
    emailAsUsername: "Email as username",
    emailAsUsernameHelpText: "Allow users to set email as username.",
    loginWithEmail: "Login with email",
    loginWithEmailHelpText: "Allow users to log in with their email address.",
    duplicateEmails: "Duplicate emails",
    duplicateEmailsHelpText:
      "Allow multiple users to have the same email address. Changing this setting will also clear the user's cache. It is recommended to manually update email constraints of existing users in the database after switching off support for duplicate email addresses.",
    provideEmailTitle: "Provide your email address",
    provideEmail:
      "To test connection, you should provide your email address first.",
    verifyEmail: "Verify email",
    verifyEmailHelpText:
      "Require user to verify their email address after initial login or after address changes are submitted.",
    testConnection: "Test connection",
    testConnectionSuccess:
      "Success! SMTP connection successful. E-mail was sent!",
    testConnectionError: "Error! Failed to send email.",
    realmId: "Realm ID",
    displayName: "Display name",
    htmlDisplayName: "HTML Display name",
    frontendUrl: "Frontend URL",
    requireSsl: "Require SSL",
    sslType: {
      all: "All requests",
      external: "External requests",
      none: "None",
    },
    selectATheme: "Select a theme",
    allSupportedLocales: {
      ca: "Català",
      cs: "Čeština",
      da: "Dansk",
      de: "Deutsch",
      en: "English",
      es: "Español",
      fr: "Français",
      hu: "Magyar",
      it: "Italiano",
      ja: "日本語",
      lt: "Lietuvių kalba",
      nl: "Nederlands",
      no: "Norsk",
      pl: "Polski",
      "pt-BR": "Português (Brasil)",
      ru: "Русский",
      sk: "Slovenčina",
      sv: "Svenska",
      tr: "Türkçe",
      "zh-CN": "中文",
    },
    placeholderText: "Select one",
    userManagedAccess: "User-managed access",
    endpoints: "Endpoints",
    openIDEndpointConfiguration: "OpenID Endpoint Configuration",
    samlIdentityProviderMetadata: "SAML 2.0 Identity Provider Metadata",
    loginTheme: "Login theme",
    accountTheme: "Account theme",
    adminTheme: "Admin console theme",
    emailTheme: "Email theme",
    internationalization: "Internationalization",
    localization: "Localization",
    sessions: "Sessions",
    SSOSessionSettings: "SSO Session Settings",
    SSOSessionIdle: "SSO Session Idle",
    SSOSessionMax: "SSO Session Max",
    SSOSessionIdleRememberMe: "SSO Session Idle Remember Me",
    SSOSessionMaxRememberMe: "SSO Session Max Remember Me",
    clientSessionSettings: "Client session settings",
    clientSessionIdle: "Client Session Idle",
    clientSessionMax: "Client Session Max",
    offlineSessionSettings: "Offline session settings",
    offlineSessionIdle: "Offline Session Idle",
    offlineSessionMaxLimited: "Offline Session Max Limited",
    offlineSessionMax: "Offline Session Max",
    loginSettings: "Login settings",
    loginTimeout: "Login timeout",
    loginActionTimeout: "Login action timeout",
    refreshTokens: "Refresh tokens",
    accessTokens: "Access tokens",
    actionTokens: "Action tokens",
    overrideActionTokens: "Override Action Tokens",
    defaultSigAlg: "Default Signature Algorithm",
    revokeRefreshToken: "Revoke Refresh Token",
    refreshTokenMaxReuse: "Refresh Token Max Reuse",
    accessTokenLifespan: "Access Token Lifespan",
    accessTokenLifespanImplicitFlow: "Access Token Lifespan For Implicit Flow",
    clientLoginTimeout: "Client Login Timeout",
    userInitiatedActionLifespan: "User-Initiated Action Lifespan",
    defaultAdminInitiated: "Default Admin-Initated Action Lifespan",
    emailVerification: "Email Verification",
    idpAccountEmailVerification: "IdP account email verification",
    executeActions: "Execute actions",
    clientPolicies: "Client policies",
    noClientPolicies: "No client policies",
    noClientPoliciesInstructions:
      "There are no client policies. Select 'Create client policy' to create a new client policy.",
    createPolicy: "Create policy",
    createClientPolicy: "Create client policy",
    createClientPolicySuccess: "New policy created",
    createClientConditionSuccess: "Condition created successfully.",
    createClientConditionError: "Error creating condition: {{error}}",
    deleteClientConditionSuccess: "Condition deleted successfully.",
    deleteClientConditionError: "Error creating condition: {{error}}",
    clientPolicySearch: "Search client policy",
    policiesConfigType: "Configure via:",
    policiesConfigTypes: {
      formView: "Form view",
      jsonEditor: "JSON editor",
    },
    deleteClientPolicy: "Delete client policy",
    deleteClientPolicyConfirmTitle: "Delete policy?",
    deleteClientPolicyConfirm:
      "This action will permanently delete the policy {{policyName}}. This cannot be undone.",
    deleteClientPolicySuccess: "Client policy deleted",
    deleteClientPolicyError: "Could not delete policy: {{error}}",
    profiles: "Profiles",
    policies: "Policies",
    clientPoliciesProfilesHelpText:
      "Client Profile allows to setup set of executors, which are enforced for various actions done with the client. Actions can be admin actions like creating or updating client, or user actions like authentication to the client.",
    clientPoliciesProfiles: "Client Policies Profiles",
    clientPoliciesPoliciesHelpText:
      "Client Policy allows to bind client profiles with various conditions to specify when exactly is enforced behavior specified by executors of the particular client profile.",
    clientPoliciesPolicies: "Client Policies Policies",
    clientPoliciesTab: "Client policies tab",
    clientProfilesSubTab: "Client profiles subtab",
    clientPoliciesSubTab: "Client policies subtab",
    profilesConfigType: "Configure via:",
    profilesConfigTypes: {
      formView: "Form view",
      jsonEditor: "JSON editor",
    },
    clientProfileSearch: "Search",
    searchProfile: "Search profile",
    clientProfileName: "Client profile name",
    clientProfileDescription: "Description",
    emptyClientProfiles: "No profiles",
    emptyClientProfilesInstructions:
      "There are no profiles, select 'Create client profile' to create a new client profile",
    deleteClientProfileConfirmTitle: "Delete profile?",
    deleteClientProfileConfirm:
      "This action will permanently delete the profile {{profileName}}. This cannot be undone.",
    deleteClientSuccess: "Client profile deleted",
    deleteClientError: "Could not delete profile: {{error}}",
    deleteClientPolicyProfileConfirmTitle: "Delete profile?",
    deleteClientPolicyProfileConfirm:
      "This action will permanently delete {{profileName}} from the policy {{policyName}}. This cannot be undone.",
    deleteClientPolicyProfileSuccess:
      "Profile successfully removed from the policy.",
    deleteClientPolicyProfileError:
      "Could not delete profile from the policy: {{error}}",
    createClientProfile: "Create client profile",
    deleteClientProfile: "Delete this client profile",
    createClientProfileSuccess: "New client profile created",
    updateClientProfileSuccess: "Client profile updated successfully",
    createClientProfileError: "Could not create client profile: '{{error}}'",
    addClientProfileSuccess: "New client profile added",
    addClientProfileError: "Could not create client profile: '{{error}}'",
    createClientProfileNameHelperText:
      "The name must be unique within the realm",
    allClientPolicies: "Client policies",
    newClientProfile: "Create client profile",
    newClientProfileName: "Client profile name",
    clientProfile: "Client profile details",
    executorDetails: "Executor details",
    back: "Back",
    delete: "delete",
    save: "Save",
    reload: "Reload",
    global: "Global",
    description: "description",
    executors: "Executors",
    executorsHelpText:
      "Executors, which will be applied for this client profile",
    executorsHelpItem: "Executors help item",
    addExecutor: "Add executor",
    executorType: "Executor type",
    executorTypeSwitchHelpText: "Executor Type Switch Help Text",
    executorTypeSelectHelpText: "Executor Type Select Help Text",
    executorTypeSelectAlgorithm: "Executor Type Select Algorithm",
    executorTypeTextHelpText: "Executor Type Text Help Text",
    executorAuthenticatorMultiSelectHelpText:
      "Executor Authenticator MultiSelect Help Text",
    executorClientAuthenticator: "Executor Client Authenticator",
    executorsTable: "Executors table",
    executorName: "Name",
    emptyExecutors: "No executors configured",
    addExecutorSuccess: "Success! Executor created successfully",
    addExecutorError: "Executor not created",
    updateExecutorSuccess: "Executor updated successfully",
    updateExecutorError: "Executor not updated",
    deleteExecutorProfileConfirmTitle: "Delete executor?",
    deleteExecutorProfileConfirm:
      "The action will permanently delete {{executorName}}. This cannot be undone.",
    deleteExecutorSuccess: "Success! The executor was deleted.",
    deleteExecutorError: "Could not delete executor: {{error}}",
    updateClientProfilesSuccess:
      "The client profiles configuration was updated",
    updateClientProfilesError:
      "Provided JSON is incorrect: Unexpected token { in JSON",
    deleteClientPolicyConditionConfirmTitle: "Delete condition?",
    deleteClientPolicyConditionConfirm:
      "This action will permanently delete {{condition}}. This cannot be undone.",
    selectACondition: "Select a condition",
    conditions: "Conditions",
    conditionType: "Condition type",
    policyDetails: "Policy details",
    anyClient: "The condition is satisfied by any client on any event.",
    clientAccesstype: "Client Access Type",
    clientRoles: "Client Roles",
    clientScopesCondition: "Expected Scopes",
    updateClientContext: "Update Client Context",
    clientUpdaterSourceGroups: "Groups",
    clientUpdaterTrustedHosts: "Trusted Hosts",
    clientUpdaterSourceRoles: "Updating entity role",
    conditionsHelpItem: "Conditions help item",
    addCondition: "Add condition",
    emptyConditions: "No conditions configured",
    updateClientPoliciesSuccess:
      "The client policies configuration was updated",
    updateClientPoliciesError:
      "Provided JSON is incorrect: Unexpected token { in JSON",

    clientProfiles: "Client profiles",
    clientProfilesHelpItem: "Client profiles help item",
    addClientProfile: "Add client profile",
    emptyProfiles: "No client profiles configured",
    addMultivaluedLabel: "Add {{fieldLabel}}",
    tokens: "Tokens",
    key: "Key",
    value: "Value",
    status: "Status",
    convertedToYearsValue: "{{convertedToYears}}",
    convertedToDaysValue: "{{convertedToDays}}",
    convertedToHoursValue: "{{convertedToHours}}",
    convertedToMinutesValue: "{{convertedToMinutes}}",
    convertedToSecondsValue: "{{convertedToSeconds}}",
    pairCreatedSuccess: "Success! The localization text has been created.",
    pairCreatedError: "Error creating localization text.",
    supportedLocales: "Supported locales",
    defaultLocale: "Default locale",
    selectLocales: "Select locales",
    addMessageBundle: "Add message bundle",
    eventType: "Event saved type",
    searchEventType: "Search saved event type",
    addSavedTypes: "Add saved types",
    addTypes: "Add types",
    eventTypes: {
      SEND_RESET_PASSWORD: {
        name: "Send reset password",
        description: "Send reset password",
      },
      UPDATE_CONSENT_ERROR: {
        name: "Update consent error",
        description: "Update consent error",
      },
      GRANT_CONSENT: {
        name: "Grant consent",
        description: "Grant consent",
      },
      REMOVE_TOTP: { name: "Remove totp", description: "Remove totp" },
      REVOKE_GRANT: { name: "Revoke grant", description: "Revoke grant" },
      UPDATE_TOTP: { name: "Update totp", description: "Update totp" },
      LOGIN_ERROR: { name: "Login error", description: "Login error" },
      CLIENT_LOGIN: { name: "Client login", description: "Client login" },
      RESET_PASSWORD_ERROR: {
        name: "Reset password error",
        description: "Reset password error",
      },
      IMPERSONATE_ERROR: {
        name: "Impersonate error",
        description: "Impersonate error",
      },
      CODE_TO_TOKEN_ERROR: {
        name: "Code to token error",
        description: "Code to token error",
      },
      CUSTOM_REQUIRED_ACTION: {
        name: "Custom required action",
        description: "Custom required action",
      },
      RESTART_AUTHENTICATION: {
        name: "Restart authentication",
        description: "Restart authentication",
      },
      IMPERSONATE: { name: "Impersonate", description: "Impersonate" },
      UPDATE_PROFILE_ERROR: {
        name: "Update profile error",
        description: "Update profile error",
      },
      LOGIN: { name: "Login", description: "Login" },
      UPDATE_PASSWORD_ERROR: {
        name: "Update password error",
        description: "Update password error",
      },
      CLIENT_INITIATED_ACCOUNT_LINKING: {
        name: "Client initiated account linking",
        description: "Client initiated account linking",
      },
      TOKEN_EXCHANGE: {
        name: "Token exchange",
        description: "Token exchange",
      },
      LOGOUT: { name: "Logout", description: "Logout" },
      REGISTER: { name: "Register", description: "Register" },
      DELETE_ACCOUNT_ERROR: {
        name: "Delete account error",
        description: "Delete account error",
      },
      CLIENT_REGISTER: {
        name: "Client register",
        description: "Client register",
      },
      IDENTITY_PROVIDER_LINK_ACCOUNT: {
        name: "Identity provider link account",
        description: "Identity provider link account",
      },
      DELETE_ACCOUNT: {
        name: "Delete account",
        description: "Delete account",
      },
      UPDATE_PASSWORD: {
        name: "Update password",
        description: "Update password",
      },
      CLIENT_DELETE: {
        name: "Client delete",
        description: "Client delete",
      },
      FEDERATED_IDENTITY_LINK_ERROR: {
        name: "Federated identity link error",
        description: "Federated identity link error",
      },
      IDENTITY_PROVIDER_FIRST_LOGIN: {
        name: "Identity provider first login",
        description: "Identity provider first login",
      },
      CLIENT_DELETE_ERROR: {
        name: "Client delete error",
        description: "Client delete error",
      },
      VERIFY_EMAIL: { name: "Verify email", description: "Verify email" },
      CLIENT_LOGIN_ERROR: {
        name: "Client login error",
        description: "Client login error",
      },
      RESTART_AUTHENTICATION_ERROR: {
        name: "Restart authentication error",
        description: "Restart authentication error",
      },
      EXECUTE_ACTIONS: {
        name: "Execute actions",
        description: "Execute actions",
      },
      REMOVE_FEDERATED_IDENTITY_ERROR: {
        name: "Remove federated identity error",
        description: "Remove federated identity error",
      },
      TOKEN_EXCHANGE_ERROR: {
        name: "Token exchange error",
        description: "Token exchange error",
      },
      PERMISSION_TOKEN: {
        name: "Permission token",
        description: "Permission token",
      },
      SEND_IDENTITY_PROVIDER_LINK_ERROR: {
        name: "Send identity provider link error",
        description: "Send identity provider link error",
      },
      EXECUTE_ACTION_TOKEN_ERROR: {
        name: "Execute action token error",
        description: "Execute action token error",
      },
      SEND_VERIFY_EMAIL: {
        name: "Send verify email",
        description: "Send verify email",
      },
      EXECUTE_ACTIONS_ERROR: {
        name: "Execute actions error",
        description: "Execute actions error",
      },
      REMOVE_FEDERATED_IDENTITY: {
        name: "Remove federated identity",
        description: "Remove federated identity",
      },
      IDENTITY_PROVIDER_POST_LOGIN: {
        name: "Identity provider post login",
        description: "Identity provider post login",
      },
      IDENTITY_PROVIDER_LINK_ACCOUNT_ERROR: {
        name: "Identity provider link account error",
        description: "Identity provider link account error",
      },
      UPDATE_EMAIL: { name: "Update email", description: "Update email" },
      REGISTER_ERROR: {
        name: "Register error",
        description: "Register error",
      },
      REVOKE_GRANT_ERROR: {
        name: "Revoke grant error",
        description: "Revoke grant error",
      },
      EXECUTE_ACTION_TOKEN: {
        name: "Execute action token",
        description: "Execute action token",
      },
      LOGOUT_ERROR: { name: "Logout error", description: "Logout error" },
      UPDATE_EMAIL_ERROR: {
        name: "Update email error",
        description: "Update email error",
      },
      CLIENT_UPDATE_ERROR: {
        name: "Client update error",
        description: "Client update error",
      },
      UPDATE_PROFILE: {
        name: "Update profile",
        description: "Update profile",
      },
      CLIENT_REGISTER_ERROR: {
        name: "Client register error",
        description: "Client register error",
      },
      FEDERATED_IDENTITY_LINK: {
        name: "Federated identity link",
        description: "Federated identity link",
      },
      SEND_IDENTITY_PROVIDER_LINK: {
        name: "Send identity provider link",
        description: "Send identity provider link",
      },
      SEND_VERIFY_EMAIL_ERROR: {
        name: "Send verify email error",
        description: "Send verify email error",
      },
      RESET_PASSWORD: {
        name: "Reset password",
        description: "Reset password",
      },
      CLIENT_INITIATED_ACCOUNT_LINKING_ERROR: {
        name: "Client initiated account linking error",
        description: "Client initiated account linking error",
      },
      UPDATE_CONSENT: {
        name: "Update consent",
        description: "Update consent",
      },
      REMOVE_TOTP_ERROR: {
        name: "Remove totp error",
        description: "Remove totp error",
      },
      VERIFY_EMAIL_ERROR: {
        name: "Verify email error",
        description: "Verify email error",
      },
      SEND_RESET_PASSWORD_ERROR: {
        name: "Send reset password error",
        description: "Send reset password error",
      },
      CLIENT_UPDATE: {
        name: "Client update",
        description: "Client update",
      },
      CUSTOM_REQUIRED_ACTION_ERROR: {
        name: "Custom required action error",
        description: "Custom required action error",
      },
      IDENTITY_PROVIDER_POST_LOGIN_ERROR: {
        name: "Identity provider post login error",
        description: "Identity provider post login error",
      },
      UPDATE_TOTP_ERROR: {
        name: "Update totp error",
        description: "Update totp error",
      },
      CODE_TO_TOKEN: {
        name: "Code to token",
        description: "Code to token",
      },
      GRANT_CONSENT_ERROR: {
        name: "Grant consent error",
        description: "Grant consent error",
      },
      IDENTITY_PROVIDER_FIRST_LOGIN_ERROR: {
        name: "Identity provider first login error",
        description: "Identity provider first login error",
      },
      REGISTER_NODE_ERROR: {
        name: "Register node error",
        description: "Register node error",
      },
      PERMISSION_TOKEN_ERROR: {
        name: "Permission token error",
        description: "Permission token error",
      },
      IDENTITY_PROVIDER_RETRIEVE_TOKEN_ERROR: {
        name: "Identity provider retrieve token error",
        description: "Identity provider retrieve token error",
      },
      CLIENT_INFO: {
        name: "Client info",
        description: "Client info",
      },
      VALIDATE_ACCESS_TOKEN: {
        name: "Validate access token",
        description: "Validate access token",
      },
      IDENTITY_PROVIDER_LOGIN: {
        name: "Identity provider login",
        description: "Identity provider login",
      },
      CLIENT_INFO_ERROR: {
        name: "Client info error",
        description: "Client info error",
      },
      INTROSPECT_TOKEN_ERROR: {
        name: "Introspect token error",
        description: "Introspect token error",
      },
      INTROSPECT_TOKEN: {
        name: "Introspect token",
        description: "Introspect token",
      },
      UNREGISTER_NODE: {
        name: "Unregister node",
        description: "Unregister node",
      },
      REGISTER_NODE: {
        name: "Register node",
        description: "Register node",
      },
      INVALID_SIGNATURE: {
        name: "Invalid signature",
        description: "Invalid signature",
      },
      USER_INFO_REQUEST_ERROR: {
        name: "User info request error",
        description: "User info request error",
      },
      REFRESH_TOKEN: {
        name: "Refresh token",
        description: "Refresh token",
      },
      IDENTITY_PROVIDER_RESPONSE: {
        name: "Identity provider response",
        description: "Identity provider response",
      },
      IDENTITY_PROVIDER_RETRIEVE_TOKEN: {
        name: "Identity provider retrieve token",
        description: "Identity provider retrieve token",
      },
      UNREGISTER_NODE_ERROR: {
        name: "Unregister node error",
        description: "Unregister node error",
      },
      VALIDATE_ACCESS_TOKEN_ERROR: {
        name: "Validate access token error",
        description: "Validate access token error",
      },
      INVALID_SIGNATURE_ERROR: {
        name: "Invalid signature error",
        description: "Invalid signature error",
      },
      USER_INFO_REQUEST: {
        name: "User info request",
        description: "User info request",
      },
      IDENTITY_PROVIDER_RESPONSE_ERROR: {
        name: "Identity provider response error",
        description: "Identity provider response error",
      },
      IDENTITY_PROVIDER_LOGIN_ERROR: {
        name: "Identity provider login error",
        description: "Identity provider login error",
      },
      REFRESH_TOKEN_ERROR: {
        name: "Refresh token error",
        description: "Refresh token error",
      },
    },
    emptyEvents: "Nothing to add",
    emptyEventsInstructions: "There are no more events types left to add",
    eventConfigSuccessfully: "Successfully saved configuration",
    eventConfigError: "Could not save event configuration {{error}}",
    deleteEvents: "Clear events",
    deleteEventsConfirm:
      "If you clear all events of this realm, all records will be permanently cleared in the database",
    "admin-events-cleared": "The admin events have been cleared",
    "admin-events-cleared-error": "Could not clear the admin events {{error}}",
    "user-events-cleared": "The user events have been cleared",
    "user-events-cleared-error": "Could not clear the user events {{error}}",
    "events-disable-title": "Unsave events?",
    "events-disable-confirm":
      'If "Save events" is disabled, subsequent events will not be displayed in the "Events" menu',
    confirm: "Confirm",
    noMessageBundles: "No message bundles",
    noMessageBundlesInstructions: "Add a message bundle to get started.",
    messageBundleDescription:
      "You can edit the supported locales. If you haven't selected supported locales yet, you can only edit the English locale.",
    defaultRoles: "Default roles",
    defaultGroups: "Default groups",
    securityDefences: "Security defenses",
    headers: "Headers",
    bruteForceDetection: "Brute force detection",
    xFrameOptions: "X-Frame-Options",
    contentSecurityPolicy: "Content-Security-Policy",
    contentSecurityPolicyReportOnly: "Content-Security-Policy-Report-Only",
    xContentTypeOptions: "X-Content-Type-Options",
    xRobotsTag: "X-Robots-Tag",
    xXSSProtection: "X-XSS-Protection",
    strictTransportSecurity: "HTTP Strict Transport Security (HSTS)",
    failureFactor: "Max login failures",
    permanentLockout: "Permanent lockout",
    waitIncrementSeconds: "Wait increment",
    maxFailureWaitSeconds: "Max wait",
    maxDeltaTimeSeconds: "Failure reset time",
    quickLoginCheckMilliSeconds: "Quick login check milliseconds",
    minimumQuickLoginWaitSeconds: "Minimum quick login wait",
  },
  "partial-import": {
    partialImportHeaderText:
      "Partial import allows you to import users, clients, and other resources from a previously exported json file.",
    selectRealm: "Select realm",
    chooseResources: "Choose the resources you want to import",
    selectIfResourceExists:
      "If a resource already exists, specify what should be done",
    import: "Import",
    FAIL: "Fail import",
    SKIP: "Skip",
    OVERWRITE: "Overwrite",
  },
  "partial-export": {
    partialExportHeaderText:
      "Partial export allows you to export realm configuration, and other associated resources into a json file.",
    includeGroupsAndRoles: "Include groups and roles",
    includeClients: "Include clients",
    exportWarningTitle: "Export with caution",
    exportWarningDescription:
      "If there is a great number of groups, roles or clients in your realm, the operation may make server unresponsive for a while.",
    exportSuccess: "Realm successfully exported.",
    exportFail: "Could not export realm: '{{error}}'",
  },
};
