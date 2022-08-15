package org.keycloak.admin.ui.rest

import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.media.Content
import org.eclipse.microprofile.openapi.annotations.media.Schema
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse
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

@Path("/")
open class AdminUIExtendedResource(
    private var realm: RealmModel,
    private var auth: AdminPermissionEvaluator,
) {
    @Context
    var session: KeycloakSession? = null

    @GET
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "Endpoint gives all mappings of a client scope",
        description = "This endpoint returns all the client and realm mapping for a specific client scope"
    )
    @APIResponse(
        responseCode = "200",
        description = "The mapping representation that has a field for client and one for realm mapping",
        content = [Content(
            schema = Schema(
                implementation = MappingsRepresentation::class
            )
        )]
    )
    fun scopeMapping(@PathParam("id") id: String): MappingsRepresentation {
        val all = MappingsRepresentation()
        val scopeContainer = realm.getClientScopeById(id) ?: throw NotFoundException("Could not find client scope")

        auth.clients().requireView(scopeContainer)

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