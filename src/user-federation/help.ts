export default {
  "user-federation-help": {
    addKerberosWizardDescription: "Text needed here",
    addLdapWizardDescription: "Text needed here",

    ldapGeneralOptionsSettingsDescription:
      "This section contains a few basic options common to all user storage providers.",
    consoleDisplayNameHelp:
      "Display name of provider when linked in Admin Console",
    vendorHelp: "LDAP vendor (provider)",

    ldapConnectionAndAuthorizationSettingsDescription:
      "This section contains options related to the configuration of the connection to the LDAP server. It also contains options related to authentication of the LDAP connection to the LDAP server.",
    consoleDisplayConnectionUrlHelp: "Connection URL to your LDAP server",
    enableStartTlsHelp:
      "Encrypts the connection to LDAP using STARTTLS, which will disable connection pooling",
    useTruststoreSpiHelp:
      "Specifies whether LDAP connection will use the Truststore SPI with the truststore configured in standalone.xml/domain.sml. 'Always' means that it will always use it. 'Never' means that it will not use it. 'Only for ldaps' means that it will use it if your connection URL use ldaps. Note that even if standalone.xml/domain.xml is not configured, the default java cacerts or certificate specified by 'javax.net.ssl.trustStore' property will be used.",
    connectionPoolingHelp:
      "Determines if Keycloak should use connection pooling for accessing LDAP server.",
    connectionTimeoutHelp: "LDAP connection timeout in milliseconds",
    bindTypeHelp:
      "Type of the authentication method used during LDAP bind operation. It is used in most of the requests sent to the LDAP server. Currently only 'none' (anonymous LDAP authentication) or 'simple' (bind credential + bind password authentication) mechanisms are available.",
    bindDnHelp:
      "DN of the LDAP admin, which will be used by Keycloak to access LDAP server",
    bindCredentialsHelp:
      "Password of LDAP admin. This field is able to obtain its value from vault, use ${vault.ID} format.",

    ldapSearchingAndUpdatingSettingsDescription:
      "This section contains options related to searching the LDAP server for the available users.",
    editModeLdapHelp:
      "READ_ONLY is a read-only LDAP store. WRITABLE means data will be synced back to LDAP on demand. UNSYNCED means user data will be imported, but not synced back to LDAP.",
    usersDNHelp:
      "Full DN of LDAP tree where your users are. This DN is the parent of LDAP users. It could be for example 'ou=users,dc=example,dc=com' assuming that your typical user will have DN like 'uid='john',ou=users,dc=example,dc=com'.",
    usernameLdapAttributeHelp:
      "Name of the LDAP attribute, which is mapped as Keycloak username. For many LDAP server vendors it can be 'uid'. For Active directory it can be 'sAMAccountName' or 'cn'. The attribute should be filled for all LDAP user records you want to import from LDAP to Keycloak.",
    rdnLdapAttributeHelp:
      "Name of the LDAP attribute, which is used as RDN (top attribute) of typical user DN. Usually it's the same as the Username LDAP attribute, however it is not required. For example for Active directory, it is common to use 'cn' as RDN attribute when username attribute might be 'sAMAccountName'.",
    uuidLdapAttributeHelp:
      "Name of the LDAP attribute, which is used as a unique object identifier (UUID) for objects in LDAP. For many LDAP server vendors, it is 'entryUUID'; however some are different. For example, for Active directory it should be 'objectGUID'. If your LDAP server does not support the notion of UUID, you can use any other attribute that is supposed to be unique among LDAP users in tree. For example 'uid' or 'entryDN'.",
    userObjectClassesHelp:
      "All values of LDAP objectClass attribute for users in LDAP, divided by commas. For example: 'inetOrgPerson, organizationalPerson'. Newly created Keycloak users will be written to LDAP with all those object classes and existing LDAP user records are found just if they contain all those object classes.",
    userLdapFilterHelp:
      "Additional LDAP filter for filtering searched users. Leave this empty if you don't need an additional filter. Make sure that it starts with '(' and ends with ')'.",
    searchScopeHelp:
      "For one level, the search applies only for users in the DNs specified by User DNs. For subtree, the search applies to the whole subtree. See LDAP documentation for more details.",
    readTimeoutHelp:
      "LDAP read timeout in milliseconds. This timeout applies for LDAP read operations.",
    paginationHelp: "Whether the LDAP server supports pagination",

    ldapSynchronizationSettingsDescription:
      "This section contains options related to synchronization of users from LDAP to the Keycloak database.",
    importUsersHelp:
      "If true, LDAP users will be imported into the Keycloak DB and synced by the configured sync policies.",
    batchSizeHelp:
      "Count of LDAP users to be imported from LDAP to Keycloak within a single transaction",
    periodicFullSyncHelp:
      "Whether periodic full synchronization of LDAP users to Keycloak should be enabled or not",
    fullSyncPeriodHelp: "Period for full synchronization in seconds",
    periodicChangedUsersSyncHelp:
      "Whether periodic synchronization of changed or newly created LDAP users to Keycloak should be enabled or not",
    changedUsersSyncHelp:
      "Period for synchronization of changed or newly created LDAP users in seconds",

    ldapKerberosSettingsDescription:
      "This section contains options useful for the Kerberos integration. This is used only when the LDAP server is used together with Kerberos/SPNEGO for user authentication.",
    allowKerberosAuthenticationHelp:
      "Enable/disable HTTP authentication of users with SPNEGO/Kerberos tokens. The data about authenticated users will be provisioned from this LDAP server.",
    useKerberosForPasswordAuthenticationHelp:
      "User Kerberos login module for authenticating username/password against Kerberos server instead of authenticating against LDAP server with Directory Service API",

    cacheSettingsDescription:
      "This section contains options useful for caching users, which were loaded from this user storage provider.",
    cachePolicyHelp:
      "Cache Policy for this storage provider. 'DEFAULT' is whatever the default settings are for the global cache. 'EVICT_DAILY' is a time of day every day that the cache will be invalidated. 'EVICT_WEEKLY' is a day of the week and time the cache will be invalidated. 'MAX_LIFESPAN' is the time in milliseconds that will be the lifespan of a cache entry.",
    evictionDayHelp: "Day of the week the entry will become invalid",
    evictionHourHelp: "Hour of the day the entry will become invalid",
    evictionMinuteHelp: "Minute of the hour the entry will become invalid",
    maxLifespanHelp: "Max lifespan of cache entry in milliseconds",

    ldapAdvancedSettingsDescription:
      "This section contains all the other options for more fine-grained configuration of the LDAP storage provider.",
    enableLdapv3PasswordHelp:
      "Use the LDAPv3 Password Modify Extended Operation (RFC-3062). The password modify extended operation usually requires that LDAP user already has password in the LDAP server. So when this is used with 'Sync Registrations', it can be good to add also 'Hardcoded LDAP attribute mapper' with randomly generated initial password.",
    validatePasswordPolicyHelp:
      "Determines if Keycloak should validate the password with the realm password policy before updating it",
    trustEmailHelp:
      "If enabled, email provided by this provider is not verified even if verification is enabled for the realm.",

    "IDK-periodicChangedUsersSyncHelp":
      "Should newly created users be created within LDAP store? Priority affects which provider is chosen to sync the new user.",

    kerberosWizardDescription: "Text needed here.",

    kerberosRequiredSettingsDescription:
      "This section contains a few basic options common to all user storage providers.",
    kerberosRealmHelp: "Name of kerberos realm. For example, FOO.ORG",
    serverPrincipalHelp:
      "Full name of server principal for HTTP service including server and domain name. For example, HTTP/host.foo.org@FOO.ORG",
    keyTabHelp:
      "Location of Kerberos KeyTab file containing the credentials of server principal. For example, /etc/krb5.keytab",
    debugHelp:
      "Enable/disable debug logging to standard output for Krb5LoginModule.",
    allowPasswordAuthenticationHelp:
      "Enable/disable possibility of username/password authentication against Kerberos database",
    editModeKerberosHelp:
      "READ_ONLY means that password updates are not allowed and user always authenticates with Kerberos password. UNSYNCED means that the user can change the password in the Keycloak database and this one will be used instead of the Kerberos password.",
    updateFirstLoginHelp: "Update profile on first login",

    mapperTypeMsadUserAccountControlManagerHelp:
      "Mapper specific to MSAD. It's able to integrate the MSAD user account state into Keycloak account state (account enabled, password is expired etc). It's using userAccountControl and pwdLastSet MSAD attributes for that. For example if pwdLastSet is 0, the Keycloak user is required to update the password; if userAccountControl is 514 (disabled account) the Keycloak user is disabled as well etc. Mapper is also able to handle the exception code from LDAP user authentication.",
    mapperTypeMsadLdsUserAccountControlMapperHelp:
      "Mapper specific to MSAD LDS. It's able to integrate the MSAD LDS user account state into Keycloak account state (account enabled, password is expired etc). It's using msDS-UserAccountDisabled and pwdLastSet is 0, the Keycloak user is required to update password, if msDS-UserAccountDisabled is 'TRUE' the Keycloak user is disabled as well etc. Mapper is also able to handle exception code from LDAP user authentication.",
    mapperTypeGroupLdapMapperHelp:
      "Used to map group mappings of groups from some LDAP DN to Keycloak group mappings",
    mapperTypeUserAttributeLdapMapperHelp:
      "Used to map single attribute from LDAP user to attribute of UserModel in Keycloak DB",
    mapperTypeRoleLdapMapperHelp:
      "Used to map role mappings of roles from some LDAP DN to Keycloak role mappings of either realm roles or client roles of particular client",
    mapperTypeHardcodedAttributeMapperHelp:
      "This mapper will hardcode any model user attribute and some property (like emailVerified or enabled) when importing user from LDAP.",
    mapperTypeHardcodedLdapRoleMapperHelp:
      "Users imported from LDAP will be automatically added into this configured role.",
    mapperTypeCertificateLdapMapperHelp:
      "Used to map single attribute which contains a certificate from LDAP user to attribute of UserModel in Keycloak DB",
    mapperTypeFullNameLdapMapperHelp:
      "Used to map the full-name of a user from single attribute in LDAP (usually 'cn' attribute) to firstName and lastName attributes of UserModel in Keycloak DB",
    mapperTypeHardcodedLdapGroupMapperHelp:
      "Users imported from LDAP will be automatically added into this configured group.",
    mapperTypeLdapAttributeMapperHelp:
      "This mapper is supported just if syncRegistrations is enabled. New users registered in Keycloak will be written to the LDAP with the hardcoded value of some specified attribute.",

    passwordPolicyHintsEnabledHelp:
      "Applicable just for writable MSAD. If on, then updating password of MSAD user will use LDAP_SERVER_POLICY_HINTS_OID extension, which means that advanced MSAD password policies like 'password history' or 'minimal password age' will be applied. This extension works just for MSAD 2008 R2 or newer.",

    nameHelp: "Name of the mapper",
    mapperTypeHelp:
      "Used to map single attribute from LDAP user to attribute of UserModel in Keycloak DB",

    userModelAttributeHelp:
      "Name of the UserModel property or attribute you want to map the LDAP attribute into. For example 'firstName', 'lastName, 'email', 'street' etc.",
    ldapAttributeHelp:
      "Name of mapped attribute on LDAP object. For example 'cn', 'sn', 'mail', 'street', etc.",
    readOnlyHelp:
      "Read-only attribute is imported from LDAP to UserModel, but it's not saved back to LDAP when user is updated in Keycloak.",
    alwaysReadValueFromLdapHelp:
      "If on, then during reading of the LDAP attribute value will always used instead of the value from Keycloak DB.",
    isMandatoryInLdapHelp:
      "If true, attribute is mandatory in LDAP. Hence if there is no value in Keycloak DB, the empty value will be set to be propagated to LDAP.",
    isBinaryAttributeHelp: "Should be true for binary LDAP attributes.",

    derFormattedHelp:
      "Activate this if the certificate is DER formatted in LDAP and not PEM formatted.",

    ldapFullNameAttributeHelp:
      "Name of LDAP attribute, which contains fullName of user. Usually it will be 'cn',",
    fullNameLdapMapperReadOnlyHelp:
      "For Read-only, data is imported from LDAP to Keycloak DB, but it's not saved back to LDAP when user is updated in Keycloak.",
    fullNameLdapMapperWriteOnlyHelp:
      "For Write-only, is data propagated to LDAP when user is created or updated in Keycloak. But this mapper is not used to propagate data from LDAP back into Keycloak. This setting is useful if you configured separate firstName and lastName attribute mappers and you want to use those to read attribute from LDAP into Keycloak",

    ldapGroupsDnHelp:
      "LDAP DN where groups of this tree are saved. For example 'ou=groups,dc=example,dc=org'",
    groupNameLdapAttributeHelp:
      "Name of LDAP attribute, which is used in group objects for name and RDN of group. Usually it will be 'cn'. In this case typical group/role object may have DN like 'cn=Group1,ouu=groups,dc=example,dc=org'.",
    groupObjectClassesHelp:
      "Object class (or classes) of the group object. It's divided by commas if more classes needed. In typical LDAP deployment it could be 'groupOfNames'. In Active Directory it's usually 'group'.",
    preserveGroupInheritanceHelp:
      "Flag whether group inheritance from LDAP should be propagated to Keycloak. If false, then all LDAP groups will be mapped as flat top-level groups in Keycloak. Otherwise group inheritance is preserved into Keycloak, but the group sync might fail if LDAP structure contains recursions or multiple parent groups per child groups.",
    ignoreMissingGroupsHelp: "Ignore missing groups in the group hierarchy.",
    userGroupsRetrieveStrategyHelp:
      "Specify how to retrieve groups of user. LOAD_GROUPS_BY_MEMBER_ATTRIBUTE means that roles of user will be retrieved by sending LDAP query to retrieve all groups where 'member' is our user. GET_GROUPS_FROM_USER_MEMBEROF_ATTRIBUTE means that groups of user will be retrieved from 'memberOf' attribute of our user or from the other attribute specified by 'Member-Of LDAP Attribute'.",
    mappedGroupAttributesHelp:
      "List of names of attributes divided by commas. This points to the list of attributes on LDAP group, which will be mapped as attributes of Group in Keycloak. Leave this empty if no additional group attributes are required to be mapped in Keycloak.",
    dropNonexistingGroupsDuringSyncHelp:
      "If this flag is true, then during sync of groups from LDAP to Keycloak, we will keep just those Keycloak groups that still exist in LDAP. The rest will be deleted.",
    groupsPathHelp:
      "Keycloak group path the LDAP groups are added to. For example if value '/Applications/App1' is used, then LDAP groups will be available in Keycloak under group 'App1', which is child of top level group 'Applications'. The default value is '/' so LDAP groups will be mapped to the Keycloak groups at the top level. The configured group path must already exist in the Keycloak when creating this mapper.",

    ldapRolesDnHelp:
      "LDAP DN where roles of this tree are saved. For example, 'ou=finance,dc=example,dc=org'",
    roleNameLdapAttributeHelp:
      "Name of LDAP attribute, which is used in role objects for name and RDN of role. Usually it will be 'cn'. In this case typical group/role object may have DN like 'cn=role1,ou=finance,dc=example,dc=org'.",
    roleObjectClassesHelp:
      "Object class (or classes) of the role object. It's divided by commas if more classes are needed. In typical LDAP deployment it could be 'groupOfNames'. In Active Directory it's usually 'group'.",
    userRolesRetrieveStrategyHelp:
      "Specify how to retrieve roles of user. LOAD_ROLES_BY_MEMBER_ATTRIBUTE means that roles fo user will be retrieved by sending LDAP query to retrieve all roles where 'member' is our user. GET_ROLES_FROM_USER_MEMBEROF means that roles of user will be retrieved from 'memberOf' attribute of our user. Or from the other attributes specified by 'Member-Of LDAP Attribute'. LOAD_ROLES_BY_MEMBER_ATTRIBUTE is applicable just in Active Directory and it means that roles of user will be retrieved recursively with usage of LDAP_MATCHING_RULE_IN_CHAIN LDAP extension.",
    useRealmRolesMappingHelp:
      "If true, then LDAP role mappings will be mapped to realm role mappings in Keycloak. Otherwise it will be mapped to client role mappings.",
    clientIdHelp:
      "Client ID of client to which LDAP role mappings will be mapped. Applicable only if 'Use Realm Roles Mapping' is false.",

    membershipLdapAttributeHelp:
      "Name of LDAP attribute on group, which is used for membership mappings. Usually it will be 'member'. However when 'Membership Attribute Type' is 'UID', then 'Membership LDAP Attribute' could be typically 'memberUid'.",
    membershipAttributeTypeHelp:
      "DN means that LDAP group has it's members declared in form of their full DN. For example 'member: uid=john,ou=users,dc=example,dc=com'. UID means that LDAP group has it's members declared in form of pure user uids. For example 'memberUid: john'.",
    membershipUserLdapAttributeHelp:
      "Used just if Membership Attribute Type is UID. It is the name of the LDAP attribute on user, which is used for membership mappings. Usually it will be 'uid'. For example if the value of 'Membership User LDAP Attribute' is 'uid' and  LDAP group has 'memberUid: john', then it is expected that particular LDAP user will have attribute 'uid: john'.",
    ldapFilterHelp:
      "LDAP Filter adds an additional custom filter to the whole query for retrieve LDAP groups. Leave this empty if no additional filtering is needed and you want to retrieve all groups from LDAP. Otherwise make sure that filter starts with '(' and ends with ')'.",
    modeHelp:
      "LDAP_ONLY means that all group mappings of users are retrieved from LDAP and saved into LDAP. READ_ONLY is Read-only LDAP mode where group mappings are retrieved from both LDAP and DB and merged together. New group joins are not saved to LDAP but to DB. IMPORT is Read-only LDAP mode where group mappings are retrieved from LDAP just at the time when user is imported from LDAP and then they are saved to local keycloak DB.",
    memberofLdapAttributeHelp:
      "Used just when 'User Roles Retrieve Strategy' is GET_GROUPS_FROM_USER_MEMBEROF_ATTRIBUTE. It specifies the name of the LDAP attribute on the LDAP user, which contains the groups, which the user is member of. Usually it will be the default 'memberOf'.",

    userModelAttributeNameHelp:
      "Name of the model attribute to be added when importing user from LDAP",
    attributeValueHelp:
      "Value of the model attribute to be added when importing user from LDAP",

    roleHelp:
      "Role to grant to user.  Click 'Select Role' button to browse roles, or just type it in the textbox.  To reference an application role the syntax is appname.approle, i.e. myapp.myrole.",

    groupHelp:
      "Users imported from LDAP will be automatically added into this configured group.",

    ldapAttributeNameHelp:
      "Name of the LDAP attribute, which will be added to the new user during registration",
    ldapAttributeValueHelp:
      "Value of the LDAP attribute, which will be added to the new user during registration. You can either hardcode any value like 'foo' but you can also use some special tokens. Only supported token right now is '${RANDOM}', which will be replaced with some randomly generated string.",
  },
};
