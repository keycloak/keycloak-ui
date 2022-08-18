package org.keycloak.admin.ui.rest.model

data class ClientRoleRepresentation(var client: String?, var role: String, var description: String?) {
}