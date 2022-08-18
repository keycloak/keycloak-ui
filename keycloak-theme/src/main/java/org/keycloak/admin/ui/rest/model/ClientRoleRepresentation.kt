package org.keycloak.admin.ui.rest.model

data class ClientRoleRepresentation(var id: String, var role: String, var description: String?, var client: String?) {
}