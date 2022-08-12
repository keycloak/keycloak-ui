package org.keycloak.admin.ui.rest

import org.keycloak.models.ClientModel
import org.keycloak.models.KeycloakSession
import org.keycloak.models.RealmModel
import org.keycloak.models.utils.ModelToRepresentation
import org.keycloak.representations.idm.ClientMappingsRepresentation
import org.keycloak.representations.idm.MappingsRepresentation
import org.keycloak.representations.idm.RoleRepresentation
import org.keycloak.services.resources.admin.permissions.AdminPermissionEvaluator
import org.keycloak.services.util.ScopeMappedUtil
import java.util.*
import java.util.function.Function
import java.util.stream.Collectors
import java.util.stream.Stream
import javax.ws.rs.*
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType


open class AdminUIExtendedResource(
    private var realm: RealmModel,
    private var auth: AdminPermissionEvaluator,
) {
    @Context
    protected var session: KeycloakSession? = null

    @GET
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun scopeMapping(@PathParam("id") id: String): MappingsRepresentation {
        val all = MappingsRepresentation()
        val scopeContainer = realm.getClientScopeById(id)
        val realmRep: List<RoleRepresentation> = scopeContainer.realmScopeMappingsStream
            .map(ModelToRepresentation::toBriefRepresentation)
            .collect(Collectors.toList())
        if (realmRep.isNotEmpty()) {
            all.realmMappings = realmRep
        }

        val clients: Stream<ClientModel> = realm.clientsStream
        val clientMappings: Map<String, ClientMappingsRepresentation> = clients
            .map { c -> ScopeMappedUtil.toClientMappingsRepresentation(c, scopeContainer) }
            .filter(Objects::nonNull)
            .collect(Collectors.toMap(ClientMappingsRepresentation::getClient, Function.identity()));

        if (clientMappings.isNotEmpty()) {
            all.clientMappings = clientMappings
        }
        return all
    }
}