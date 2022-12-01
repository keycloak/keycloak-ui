# Keycloak Theme (Maven Build)

This directory contains the Maven build for the Keycloak theme. It allows the theme to be built as a JAR which can be included when running the Keycloak server.

## Building

Change the name of the theme before building because it doesn't overload the default keycloak.v2 theme.

- change the name in keycloak-theme/src/main/resources/META-INF/keycloak-themes.json
- change the directory name in keycloak-theme/src/main/resources/theme/
- change the theme name in keycloak-theme/pom.xml

Then we can build

```bash
mvn install
```
## Deployment

First build the this repository with the instructions above, then [build the Keycloak sever](https://github.com/keycloak/keycloak/blob/main/docs/building.md). Start the Keycloak server and navigate to `Realm Settings` ➡️ `Themes` and set admin theme to `keycloak.v2`.
