export const keycloakBefore = () => {
  /*
      Prevent unpredictable 401 errors from failing individual tests.
      These are most often occurring during the login process:
         GET /admin/serverinfo/
         GET /admin/master/console/whoami
    */
  cy.on("uncaught:exception", (err, runnable) => {
    return false;
  });
  cy.visit("");
};
