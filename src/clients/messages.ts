export default {
  clients: {
    protocolTypes: {
      openIdConnect: "OpenID Connect",
      saml: "SAML",
      all: "All",
    },
    protocol: "Protocol",
    copy: "Copy",
    copied: "Authorization details copied.",
    copyError: "Error copying authorization details: {{error}}",
    exportAuthDetailsSuccess: "Successfully exported authorization details.",
    exportAuthDetailsError: "Error exporting authorization details: {{error}}",
    clientType: "Client type",
    clientAuthorization: "Authorization",
    implicitFlow: "Implicit flow",
    createClient: "Create client",
    importClient: "Import client",
    homeURL: "Home URL",
    webOrigins: "Web origins",
    addWebOrigins: "Add web origins",
    adminURL: "Admin URL",
    formatOption: "Format option",
    encryptAssertions: "Encrypt assertions",
    clientSignature: "Client signature required",
    downloadAdaptorTitle: "Download adaptor configs",
    privateKeyMask: "PRIVATE KEY NOT SET UP OR KNOWN",
    keys: "Keys",
    credentials: "Credentials",
    roles: "Roles",
    createRole: "Create role",
    noRoles: "No roles for this client",
    noRolesInstructions:
      "You haven't created any roles for this client. Create a role to get started.",
    clientScopes: "Client scopes",
    addClientScope: "Add client scope",
    dedicatedScopeName: "{{clientName}}-dedicated",
    dedicatedScopeDescription: "Dedicated scope and mappers for this client",
    dedicatedScopes: "Dedicated scopes",
    fullScopeAllowed: "Full scope allowed",
    addClientScopesTo: "Add client scopes to {{clientName}}",
    clientScopeRemoveSuccess: "Scope mapping successfully removed",
    clientScopeRemoveError: "Could not remove the scope mapping {{error}}",
    clientScopeSuccess: "Scope mapping successfully updated",
    clientScopeError: "Could not update the scope mapping {{error}}",
    searchByName: "Search by name",
    setup: "Setup",
    selectAUser: "Select a user",
    client: "Client",
    evaluate: "Evaluate",
    reevaluate: "Re-evaluate",
    showAuthData: "Show authorization data",
    results: "Results",
    allResults: "All results",
    resultPermit: "Result-Permit",
    resultDeny: "Result-Deny",
    permit: "Permit",
    deny: "Deny",
    unanimous: "Unanimous",
    affirmative: "Affirmative",
    consensus: "Consensus",
    votedToStatus: " voted to {{status}}",
    overallResults: "Overall Results",
    grantedScopes: "Granted scopes",
    deniedScopes: "Denied scopes",
    permission: "Permission",
    lastEvaluation: "Last Evaluation",
    resourcesAndAuthScopes: "Resources and Authentication Scopes",
    authScopes: "Authorization scopes",
    authDetails: "Authorization details",
    anyResource: "Any resource",
    anyScope: "Any scope",
    selectScope: "Select a scope",
    applyToResourceType: "Apply to Resource Type",
    contextualInfo: "Contextual Information",
    contextualAttributes: "Contextual Attributes",
    selectOrTypeAKey: "Select or type a key",
    custom: "Custom Attribute...",
    kc: {
      identity: {
        authc: {
          method: "Authentication Method",
        },
      },
      realm: {
        name: "Realm",
      },
      time: {
        date_time: "Date/Time (MM/dd/yyyy hh:mm:ss)",
      },
      client: {
        network: {
          ip_address: "Client IPv4 Address",
          host: "Client Host",
        },
        user_agent: "Client/User Agent",
      },
    },
    password: "Password",
    oneTimePassword: "One-Time Password",
    kerberos: "Kerberos",
    assignRole: "Assign role",
    unAssignRole: "Unassign",
    removeMappingTitle: "Remove mapping?",
    removeMappingConfirm_one: "Are you sure you want to remove this mapping?",
    removeMappingConfirm_other:
      "Are you sure you want to remove {{count}} mappings",
    clientScopeSearch: {
      name: "Name",
      type: "Assigned type",
      protocol: "Protocol",
    },
    authorization: "Authorization",
    settings: "Settings",
    policyEnforcementMode: "Policy enforcement mode",
    policyEnforcementModes: {
      ENFORCING: "Enforcing",
      PERMISSIVE: "Permissive",
      DISABLED: "Disabled",
    },
    decisionStrategy: "Decision strategy",
    decisionStrategies: {
      UNANIMOUS: "Unanimous",
      AFFIRMATIVE: "Affirmative",
      CONSENSUS: "Consensus",
    },
    importResources: "The following settings and data will be imported:",
    importWarning:
      "The data and settings imported above may overwrite the data and settings that already exist.",
    importResourceSuccess: "The resource was successfully imported",
    importResourceError: "Could not import the resource due to {{error}}",
    createResource: "Create resource",
    emptyPermissions: "No permissions",
    emptyPermissionInstructions:
      "If you want to create a permission, please click the button below to create a resource-based or scope-based permission.",
    noScopeCreateHint:
      "There is no authorization scope you can't create scope-based permission",
    noResourceCreateHint:
      "There are no resources you can't create resource-based permission",
    createResourceBasedPermission: "Create resource-based permission",
    createScopeBasedPermission: "Create scope-based permission",
    displayName: "Display name",
    type: "Type",
    addUri: "Add URI",
    authorizationScopes: "Authorization scopes",
    iconUri: "Icon URI",
    ownerManagedAccess: "User-Managed access enabled",
    resourceAttribute: "Resource attribute",
    createResourceSuccess: "Resource created successfully",
    updateResourceSuccess: "Resource successfully updated",
    resourceSaveError: "Could not persist resource due to {{error}}",
    associatedPermissions: "Associated permission",
    allowRemoteResourceManagement: "Remote resource management",
    resources: "Resources",
    resource: "Resource",
    allTypes: "All types",
    scope: "Scope",
    owner: "Owner",
    uris: "URIs",
    scopes: "Scopes",
    policies: "Policies",
    createPermission: "Create permission",
    permissionDetails: "Permission details",
    deleteResource: "Permanently delete resource?",
    deleteResourceConfirm:
      "If you delete this resource, some permissions will be affected.",
    deleteResourceWarning:
      "The permissions below will be removed when they are no longer used by other resources:",
    resourceDeletedSuccess: "The resource successfully deleted",
    resourceDeletedError: "Could not remove the resource {{error}}",
    identityInformation: "Identity Information",
    permissions: "Permissions",
    searchForPermission: "Search for permission",
    deleteScope: "Permanently delete authorization scope?",
    deleteScopeConfirm:
      "If you delete this authorization scope, some permissions will be affected.",
    deleteScopeWarning:
      "The permissions below will be removed when they are no longer used by other authorization scopes:",
    resourceScopeSuccess: "The authorization scope successfully deleted",
    resourceScopeError:
      "Could not remove the authorization scope due to {{error}}",
    associatedPolicy: "Associated policy",
    deletePermission: "Permanently delete permission?",
    deletePermissionConfirm:
      "Are you sure you want to delete the permission {{permission}}",
    permissionDeletedSuccess: "Successfully deleted permission",
    permissionDeletedError: "Could not delete permission due to {{error}}",
    applyToResourceTypeFlag: "Apply to resource type",
    resourceType: "Resource type",
    createPermissionSuccess: "Successfully created the permission",
    updatePermissionSuccess: "Successfully updated the permission",
    permissionSaveError: "Could not update the permission due to {{error}}",
    createAuthorizationScope: "Create authorization scope",
    emptyAuthorizationScopes: "No authorization scopes",
    emptyAuthorizationInstructions:
      "If you want to create authorization scopes, please click the button below to create the authorization scope",
    createScopeSuccess: "Authorization scope created successfully",
    updateScopeSuccess: "Authorization scope successfully updated",
    scopeSaveError: "Could not persist authorization scope due to {{error}}",
    createPolicy: "Create policy",
    dependentPermission: "Dependent permission",
    deletePolicy: "Permanently delete policy?",
    deletePolicyConfirm:
      "If you delete this policy, some permissions or aggregated policies will be affected.",
    deletePolicyWarning:
      "The aggregated polices below will be removed automatically:",
    policyDeletedSuccess: "The Policy successfully deleted",
    policyDeletedError: "Could not remove the resource {{error}}",
    emptyPolicies: "No policies",
    emptyPoliciesInstructions:
      "If you want to create a policy, please click the button below to create the policy.",
    chooseAPolicyType: "Choose a policy type",
    chooseAPolicyTypeInstructions:
      "Choose one policy type from the list below and then you can configure a new policy for authorization. There are some types and description.",
    policyProvider: {
      regex: "Define regex conditions for your permissions.",
      role: "Define conditions for your permissions where a set of one or more roles is permitted to access an object.",
      js: "Define conditions for your permissions using JavaScript. It is one of the rule-based policy types supported by Keycloak, and provides flexibility to write any policy based on the Evaluation API.",
      client:
        "Define conditions for your permissions where a set of one or more clients is permitted to access an object.",
      time: "Define time conditions for your permissions.",
      user: "Define conditions for your permissions where a set of one or more users is permitted to access an object.",
      "client-scope":
        "Define conditions for your permissions where a set of one or more client scopes is permitted to access an object.",
      aggregate:
        "Reuse existing policies to build more complex ones and keep your permissions even more decoupled from the policies that are evaluated during the processing of authorization requests.",
      group:
        "Define conditions for your permissions where a set of one or more groups (and their hierarchies) is permitted to access an object.",
    },
    applyPolicy: "Apply policy",
    addClientScopes: "Add client scopes",
    emptyAddClientScopes: "No more scopes",
    emptyAddClientScopesInstructions: "There are no client scopes left to add",
    clientScope: "Client scope",
    groupsClaim: "Groups claim",
    addGroups: "Add groups",
    groups: "Groups",
    users: "Users",
    requiredClient: "Please add at least one client.",
    requiredClientScope: "Please add at least one client scope.",
    requiredGroups: "Please add at least one group.",
    requiredRoles: "Please add at least one role.",
    addGroupsToGroupPolicy: "Add groups to group policy",
    extendToChildren: "Extend to children",
    targetClaim: "Target claim",
    regexPattern: "Regex pattern",
    addRoles: "Add roles",
    required: "Required",
    startTime: "Start time",
    repeat: "Repeat",
    notRepeat: "Not repeat",
    month: "Month",
    dayMonth: "Day",
    hour: "Hour",
    minute: "Minute",
    code: "Code",
    expireTime: "Expire time",
    logic: "Logic",
    logicType: {
      positive: "Positive",
      negative: "Negative",
    },
    createPolicySuccess: "Successfully created the policy",
    updatePolicySuccess: "Successfully updated the policy",
    policySaveError: "Could not update the policy due to {{error}}",
    assignedClientScope: "Assigned client scope",
    assignedType: "Assigned type",
    hideInheritedRoles: "Hide inherited roles",
    inherentFrom: "Inherited from",
    emptyClientScopes: "This client doesn't have any added client scopes",
    emptyClientScopesInstructions:
      "There are currently no client scopes linked to this client. You can add existing client scopes to this client to share protocol mappers and roles.",
    emptyClientScopesPrimaryAction: "Add client scopes",
    scopeParameter: "Scope parameter",
    scopeParameterPlaceholder: "Select scope parameters",
    effectiveProtocolMappers: "Effective protocol mappers",
    effectiveRoleScopeMappings: "Effective role scope mappings",
    generatedAccessToken: "Generated access token",
    generatedIdToken: "Generated ID token",
    generatedIdTokenNo: "No generated id token",
    generatedIdTokenIsDisabled:
      "Generated id token is disabled when no user is selected",
    generatedUserInfo: "Generated user info",
    generatedUserInfoNo: "No generated user info",
    generatedUserInfoIsDisabled:
      "Generated user info is disabled when no user is selected",
    searchForProtocol: "Search protocol mapper",
    parentClientScope: "Parent client scope",
    searchForRole: "Search role",
    origin: "Origin",
    user: "User",
    generatedAccessTokenNo: "No generated access token",
    generatedAccessTokenIsDisabled:
      "Generated access token is disabled when no user is selected",
    clientList: "Clients",
    clientsList: "Clients list",
    initialAccessToken: "Initial access token",
    expirationValueNotValid: "Value should should be greater or equal to 1",
    clientSettings: "Client details",
    selectEncryptionType: "Select Encryption type",
    generalSettings: "General Settings",
    alwaysDisplayInConsole: "Always display in console",
    capabilityConfig: "Capability config",
    clientsExplain:
      "Clients are applications and services that can request authentication of a user.",
    explainBearerOnly:
      "This is a special OIDC type. This client only allows bearer token requests and cannot participate in browser logins.",
    createSuccess: "Client created successfully",
    createError: "Could not create client: '{{error}}'",
    clientImportError: "Could not import client: {{error}}",
    clientSaveSuccess: "Client successfully updated",
    clientSaveError: "Client could not be updated: {{error}}",
    clientImportSuccess: "Client imported successfully",
    clientDelete: "Delete {{clientId}} ?",
    clientDeletedSuccess: "The client has been deleted",
    clientDeleteError: "Could not delete client: {{error}}",
    clientDeleteConfirmTitle: "Delete client?",
    disableConfirmTitle: "Disable client?",
    downloadAdapterConfig: "Download adapter config",
    disableConfirm:
      "If you disable this client, you cannot initiate a login or obtain access tokens.",
    clientDeleteConfirm:
      "If you delete this client, all associated data will be removed.",
    searchInitialAccessToken: "Search token",
    createToken: "Create initial access token",
    tokenDeleteConfirm:
      "Are you sure you want to permanently delete the initial access token {{id}}",
    tokenDeleteConfirmTitle: "Delete initial access token?",
    tokenDeleteSuccess: "Initial access token deleted successfully",
    tokenDeleteError: "Could not delete initial access token: '{{error}}'",
    timestamp: "Created date",
    created: "Created",
    lastUpdated: "Last updated",
    expires: "Expires",
    count: "Count",
    remainingCount: "Remaining count",
    expiration: "Expiration",
    noTokens: "No initial access tokens",
    noTokensInstructions:
      'You haven\'t created any initial access tokens. Create an initial access token by clicking "Create".',
    tokenSaveSuccess: "New initial access token has been created",
    tokenSaveError: "Could not create initial access token {{error}}",
    initialAccessTokenDetails: "Initial access token details",
    copyInitialAccessToken:
      "Please copy and paste the initial access token before closing as it can not be retrieved later.",
    copySuccess: "Successfully copied to clipboard!",
    clipboardCopyError: "Error copying to clipboard.",
    copyToClipboard: "Copy to clipboard",
    clientAuthentication: "Client authentication",
    authentication: "Authentication",
    authenticationFlow: "Authentication flow",
    standardFlow: "Standard flow",
    directAccess: "Direct access grants",
    serviceAccount: "Service accounts roles",
    oauthDeviceAuthorizationGrant: "OAuth 2.0 Device Authorization Grant",
    oidcCibaGrant: "OIDC CIBA Grant",
    enableServiceAccount: "Enable service account roles",
    assignRolesTo: "Assign roles to {{client}} account",
    searchByRoleName: "Search by role name",
    filterByOrigin: "Filter by Origin",
    realmRoles: "Realm roles",
    clients: "Clients",
    assign: "Assign",
    roleMappingUpdatedSuccess: "Role mapping updated",
    roleMappingUpdatedError: "Could not update role mapping {{error}}",
    displayOnClient: "Display client on screen",
    consentScreenText: "Client consent screen text",
    loginSettings: "Login settings",
    logoutSettings: "Logout settings",
    backchannelLogoutUrl: "Backchannel logout URL",
    backchannelUrlInvalid: "Backchannel logout URL is not a valid URL",
    backchannelLogoutSessionRequired: "Backchannel logout session required",
    backchannelLogoutRevokeOfflineSessions:
      "Backchannel logout revoke offline sessions",
    frontchannelLogout: "Front channel logout",
    frontchannelLogoutUrl: "Front-channel logout URL",
    frontchannelUrlInvalid: "Front-channel logout URL is not a valid URL",
    accessSettings: "Access settings",
    rootUrl: "Root URL",
    validRedirectUri: "Valid redirect URIs",
    idpInitiatedSsoUrlName: "IDP-Initiated SSO URL name",
    idpInitiatedSsoUrlNameHelp: "Target IDP initiated SSO URL: {{url}}",
    idpInitiatedSsoRelayState: "IDP Initiated SSO Relay State",
    masterSamlProcessingUrl: "Master SAML Processing URL",
    samlCapabilityConfig: "SAML capabilities",
    signatureAndEncryption: "Signature and Encryption",
    nameIdFormat: "Name ID format",
    forceNameIdFormat: "Force name ID format",
    forcePostBinding: "Force POST binding",
    forceArtifactBinding: "Force artifact binding",
    includeAuthnStatement: "Include AuthnStatement",
    includeOneTimeUseCondition: "Include OneTimeUse Condition",
    optimizeLookup: "Optimize REDIRECT signing key lookup",
    signDocuments: "Sign documents",
    signAssertions: "Sign assertions",
    signatureKeyName: "SAML signature key name",
    canonicalization: "Canonicalization method",
    addRedirectUri: "Add valid redirect URIs",
    loginTheme: "Login theme",
    consentRequired: "Consent required",
    clientAuthenticator: "Client Authenticator",
    changeAuthenticatorConfirmTitle: "Change to {{clientAuthenticatorType}}",
    changeAuthenticatorConfirm:
      "If you change authenticator to {{clientAuthenticatorType}}, the keycloak database will be updated and you may need to download a new adapter configuration for this client",
    signedJWTConfirm:
      'You should configure JWKS URL or keys in the "Keys" tab to change the parameters of Signed JWT authenticator.',
    anyAlgorithm: "Any algorithm",
    clientSecret: "Client secret",
    regenerate: "Regenerate",
    confirmClientSecretTitle: "Regenerate secret for this client?",
    confirmClientSecretBody:
      "If you regenerate secret, the Keycloak database will be updated and you will need to download a new adapter for this client.",
    confirmAccessTokenTitle: "Regenerate registration access token?",
    confirmAccessTokenBody:
      "If you regenerate registration access token, the access data regarding the client registration service will be updated.",
    clientSecretSuccess: "Client secret regenerated",
    clientSecretError: "Could not regenerate client secret due to: {{error}}",
    signingKeysConfig: "Signing keys config",
    signingKeysConfigExplain:
      'If you enable the "Client signature required" below, you must configure the signing keys by generating or importing keys, and the client will sign their saml requests and responses. The signature will be validated.',
    encryptionKeysConfig: "Encryption keys config",
    encryptionKeysConfigExplain:
      'If you enable the "Encryption assertions" below, you must configure the encryption keys by generating or importing keys, and the SAML assertions will be encrypted with the client\'s public key using AES.',
    enableClientSignatureRequired: 'Enable "Client signature required"?',
    enableClientSignatureRequiredExplain:
      'If you enable "Client signature required", the adapter of this client will be updated. You may need to download a new adapter for this client. You need to generate or import keys for this client otherwise the authentication will not work.',
    selectMethod: "Select method",
    selectMethodType: {
      generate: "Generate",
      import: "Import",
    },
    confirm: "Confirm",
    browse: "Browse",
    importKey: "Import key",
    disableSigning: 'Disable "{{key}}"',
    disableSigningExplain:
      'If you disable "{{key}}", the Keycloak database will be updated and you may need to download a new adapter for this client.',
    reGenerateSigning: "Regenerate signing key for this client",
    reGenerateSigningExplain:
      "If you regenerate signing key for client, the Keycloak database will be updated and you may need to download a new adapter for this client.",
    registrationAccessToken: "Registration access token",
    accessTokenSuccess: "Access token regenerated",
    accessTokenError: "Could not regenerate access token due to: {{error}}",
    signatureAlgorithm: "Signature algorithm",
    subject: "Subject DN",
    searchForClient: "Search for client",
    advanced: "Advanced",
    revocation: "Revocation",
    clustering: "Clustering",
    notBefore: "Not before",
    setToNow: "Set to now",
    noAdminUrlSet:
      "No push sent. No admin URI configured or no registered cluster nodes available",
    notBeforeSetToNow: "Not Before set for client",
    notBeforeNowClear: "Not Before cleared for client",
    notBeforePushFail: 'Failed to push "not before" to: {{failedNodes}}',
    notBeforePushSuccess: 'Successfully push "not before" to: {{successNodes}}',
    testClusterFail:
      "Failed verified availability for: {{failedNodes}}. Fix or unregister failed cluster nodes and try again",
    testClusterSuccess:
      "Successfully verified availability for: {{successNodes}}",
    deleteNode: "Delete node?",
    deleteNodeBody:
      'Are you sure you want to permanently delete the node "{{node}}"',
    deleteNodeSuccess: "Node successfully removed",
    deleteNodeFail: "Could not delete node: '{{error}}'",
    addedNodeSuccess: "Node successfully added",
    addedNodeFail: "Could not add node: '{{error}}'",
    addNode: "Add node",
    push: "Push",
    clear: "Clear",
    nodeReRegistrationTimeout: "Node Re-registration timeout",
    registeredClusterNodes: "Registered cluster nodes",
    nodeHost: "Node host",
    noNodes: "No nodes registered",
    noNodesInstructions:
      "There are no nodes registered, you can add one manually.",
    lastRegistration: "Last registration",
    testClusterAvailability: "Test cluster availability",
    registerNodeManually: "Register node manually",
    fineGrainOpenIdConnectConfiguration:
      "Fine grain OpenID Connect configuration",
    fineGrainSamlEndpointConfig: "Fine Grain SAML Endpoint Configuration",
    logoUrl: "Logo URL",
    policyUrl: "Policy URL",
    termsOfServiceUrl: "Terms of service URL",
    accessTokenSignatureAlgorithm: "Access token signature algorithm",
    idTokenSignatureAlgorithm: "ID token signature algorithm",
    idTokenEncryptionKeyManagementAlgorithm:
      "ID token encryption key management algorithm",
    idTokenEncryptionContentEncryptionAlgorithm:
      "ID token encryption content encryption algorithm",
    userInfoSignedResponseAlgorithm: "User info signed response algorithm",
    requestObjectSignatureAlgorithm: "Request object signature algorithm",
    requestObjectRequired: "Request object required",
    requestObject: {
      "not required": "Not required",
      "request or request_uri": "Request or Request URI",
      "request only": "Request only",
      "request_uri only": "Request URI only",
    },
    requestObjectEncryption: "Request object encryption algorithm",
    requestObjectEncoding: "Request object content encryption algorithm",
    validRequestURIs: "Valid request URIs",
    addRequestUri: "Add valid request URIs",
    authorizationSignedResponseAlg:
      "Authorization response signature algorithm",
    authorizationEncryptedResponseAlg:
      "Authorization response encryption key management algorithm",
    authorizationEncryptedResponseEnc:
      "Authorization response encryption content encryption algorithm",
    openIdConnectCompatibilityModes: "Open ID Connect Compatibly Modes",
    excludeSessionStateFromAuthenticationResponse:
      "Exclude Session State From Authentication Response",
    useRefreshTokens: "Use refresh tokens",
    useRefreshTokenForClientCredentialsGrant:
      "Use refresh tokens for client credentials grant",
    assertionConsumerServicePostBindingURL:
      "Assertion Consumer Service POST Binding URL",
    assertionConsumerServiceRedirectBindingURL:
      "Assertion Consumer Service Redirect Binding URL",
    logoutServicePostBindingURL: "Logout Service POST Binding URL",
    logoutServiceRedirectBindingURL: "Logout Service Redirect Binding URL",
    logoutServiceArtifactBindingUrl: "Logout Service ARTIFACT Binding URL",
    artifactBindingUrl: "Artifact Binding URL",
    artifactResolutionService: "Artifact Resolution Service",
    advancedSettings: "Advanced Settings",
    assertionLifespan: "Assertion Lifespan",
    accessTokenLifespan: "Access Token Lifespan",
    oAuthMutual: "OAuth 2.0 Mutual TLS Certificate Bound Access Tokens Enabled",
    keyForCodeExchange: "Proof Key for Code Exchange Code Challenge Method",
    authenticationOverrides: "Authentication flow overrides",
    browserFlow: "Browser Flow",
    directGrant: "Direct Grant Flow",
    jwksUrlConfig: "JWKS URL configs",
    keysIntro:
      'If "Use JWKS URL switch" is on, you need to fill a valid JWKS URL. After saving, admin can download keys from the JWKS URL or keys will be downloaded automatically by Keycloak server when see the stuff signed by the unknown KID',
    useJwksUrl: "Use JWKS URL",
    certificate: "Certificate",
    jwksUrl: "JWKS URL",
    generateNewKeys: "Generate new keys",
    generateKeys: "Generate keys?",
    generate: "Generate",
    archiveFormat: "Archive format",
    keyAlias: "Key alias",
    keyPassword: "Key password",
    storePassword: "Store password",
    generateSuccess: "New key pair and certificate generated successfully",
    generateError: "Could not generate new key pair and certificate {{error}}",
    import: "Import",
    importFile: "Import file",
    importSuccess: "New certificate imported",
    importError: "Could not import certificate {{error}}",
    tokenLifespan: {
      expires: "Expires in",
      never: "Never expires",
    },
    mappers: "Mappers",
  },
};
