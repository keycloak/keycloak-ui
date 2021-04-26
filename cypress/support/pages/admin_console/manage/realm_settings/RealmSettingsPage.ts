export default class RealmSettingsPage {
  // generalSaveBtn: string;
  // saveBtnThemes: string;
  // loginTab: string;
  // selectLoginTheme: string;
  // loginThemeList: string;
  // selectAccountTheme: string;
  // accountThemeList: string;
  // selectAdminTheme: string;
  // adminThemeList: string;
  // selectEmailTheme: string;
  // emailThemeList: string;
  // selectDefaultLocale: string;
  // defaultLocaleList: string;
  // emailSaveBtn: string;
  // managedAccessSwitch: string;
  // userRegSwitch: string;
  // forgotPwdSwitch: string;
  // rememberMeSwitch: string;
  // emailAsUsernameSwitch: string;
  // loginWithEmailSwitch: string;
  // duplicateEmailsSwitch: string;
  // verifyEmailSwitch: string;
  // authSwitch: string;
  // fromInput: string;
  // enableSslCheck: string;
  // enableStartTlsCheck: string;
  generalSaveBtn = "general-tab-save";
  themesSaveBtn = "themes-tab-save";
  loginTab = "rs-login-tab";
  selectLoginTheme = "#kc-login-theme";
  loginThemeList = "#kc-login-theme + ul";
  selectAccountTheme = "#kc-account-theme";
  accountThemeList = "#kc-account-theme + ul";
  selectAdminTheme = "#kc-admin-console-theme";
  adminThemeList = "#kc-admin-console-theme + ul";
  selectEmailTheme = "#kc-email-theme";
  emailThemeList = "#kc-email-theme + ul";
  selectDefaultLocale = "select-default-locale";
  defaultLocaleList = "select-default-locale + ul";
  emailSaveBtn = "email-tab-save";
  managedAccessSwitch = "user-managed-access-switch";
  userRegSwitch = "user-reg-switch";
  forgotPwdSwitch = "forgot-pw-switch";
  rememberMeSwitch = "remember-me-switch";
  emailAsUsernameSwitch = "email-as-username-switch";
  loginWithEmailSwitch = "login-with-email-switch";
  duplicateEmailsSwitch = "duplicate-emails-switch";
  verifyEmailSwitch = "verify-email-switch";
  authSwitch = "email-authentication-switch";
  fromInput = "sender-email-address";
  enableSslCheck = "enable-ssl";
  enableStartTlsCheck = "enable-start-tls";

  // constructor() {
  //   this.generalSaveBtn = "general-tab-save";
  //   this.saveBtnThemes = "themes-tab-save";
  //   this.loginTab = "rs-login-tab";
  //   this.selectLoginTheme = "#kc-login-theme";
  //   this.loginThemeList = "#kc-login-theme + ul";
  //   this.selectAccountTheme = "#kc-account-theme";
  //   this.accountThemeList = "#kc-account-theme + ul";
  //   this.selectAdminTheme = "#kc-admin-console-theme";
  //   this.adminThemeList = "#kc-admin-console-theme + ul";
  //   this.selectEmailTheme = "#kc-email-theme";
  //   this.emailThemeList = "#kc-email-theme + ul";
  //   this.selectDefaultLocale = "select-default-locale";
  //   this.defaultLocaleList = "select-default-locale + ul";
  //   this.generalSaveBtn = "general-tab-save";
  //   this.emailSaveBtn = "email-tab-save";
  //   this.loginTab = "rs-login-tab";
  //   this.managedAccessSwitch = "user-managed-access-switch";
  //   this.userRegSwitch = "user-reg-switch";
  //   this.forgotPwdSwitch = "forgot-pw-switch";
  //   this.rememberMeSwitch = "remember-me-switch";
  //   this.emailAsUsernameSwitch = "email-as-username-switch";
  //   this.loginWithEmailSwitch = "login-with-email-switch";
  //   this.duplicateEmailsSwitch = "duplicate-emails-switch";
  //   this.verifyEmailSwitch = "verify-email-switch";
  //   this.authSwitch = "email-authentication-switch";
  //   this.fromInput = "sender-email-address";
  //   this.enableSslCheck = "enable-ssl";
  //   this.enableStartTlsCheck = "enable-start-tls";
  // }

  selectLoginThemeType(themeType: string) {
    cy.get(this.selectLoginTheme).click();
    cy.get(this.loginThemeList).contains(themeType).click();
    return this;
  }

  selectAccountThemeType(themeType: string) {
    cy.get(this.selectAccountTheme).click();
    cy.get(this.accountThemeList).contains(themeType).click();
    return this;
  }

  selectAdminThemeType(themeType: string) {
    cy.get(this.selectAdminTheme).click();
    cy.get(this.adminThemeList).contains(themeType).click();
    return this;
  }

  selectEmailThemeType(themeType: string) {
    cy.get(this.selectEmailTheme).click();
    cy.get(this.emailThemeList).contains(themeType).click();
    return this;
  }

  setDefaultLocale(locale: string) {
    cy.get(this.selectDefaultLocale).click();
    cy.get(this.defaultLocaleList).contains(locale).click();
    return this;
  }

  saveGeneral() {
    cy.getId(this.generalSaveBtn).click();

    return this;
  }

  saveThemes() {
    cy.getId(this.themesSaveBtn).click();

    return this;
  }

  addSenderEmail(senderEmail: string) {
    cy.getId(this.fromInput).clear();

    if (senderEmail) {
      cy.getId(this.fromInput).type(senderEmail);
    }

    return this;
  }

  toggleSwitch(switchName: string) {
    cy.getId(switchName).next().click();

    return this;
  }

  toggleCheck(switchName: string) {
    cy.getId(switchName).click();

    return this;
  }

  save(saveBtn: string) {
    cy.getId(saveBtn).click();

    return this;
  }
}
