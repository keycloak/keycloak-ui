# Keycloak UI

This repository contains the UIs and related libraries of the Keycloak project.

## Repository structure

    ├── apps                    # UI projects
    │   ├── account-ui
    │   ├── admin-ui
    │   └── keycloak-server
    ├── keycloak-theme          # Maven build for the Keycloak theme
    ├── libs                    # Keycloak libraries
    ├── LICENSE
    ├── MAINTAINERS.md
    ├── README.md
    ├── package.json
    ├── tsconfig.eslint.json
    └── tsconfig.json

### UI projects

The source code for each UI project is stored in the `apps` folder. Refer to the individual README.md for details on how to run each application.

### Maven build for the Keycloak theme

The Maven build for the Keycloak theme is stored in the `Keycloak-theme` folder. It allows the theme to be built as a JAR which can be included when running the Keycloak server.

### Keycloak libraries

`keycloak-admin-client`, `keycloak-js` and `keycloak-masthead` libraries are stored in the `libs` folder.

## Data processing

Red Hat may process information including business contact information and code contributions as part of its participation in the project, data is processed in accordance with [Red Hat Privacy Statement](https://www.redhat.com/en/about/privacy-policy).

## License

- [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
