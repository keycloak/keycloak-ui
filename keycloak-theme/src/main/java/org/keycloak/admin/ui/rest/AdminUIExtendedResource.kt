package org.keycloak.admin.ui.rest

import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.media.Content
import org.eclipse.microprofile.openapi.annotations.media.Schema
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse
import org.keycloak.admin.ui.rest.model.ClientRoleRepresentation
import org.keycloak.admin.ui.rest.model.RoleMapper
import org.keycloak.models.KeycloakSession
import org.keycloak.models.RealmModel
import org.keycloak.models.RoleModel
import org.keycloak.representations.idm.RoleRepresentation
import org.keycloak.services.resources.admin.permissions.AdminPermissionEvaluator
import org.mapstruct.factory.Mappers
import java.util.*
import java.util.function.Predicate
import java.util.stream.Collectors
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
    @Path("/client-scope/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "List all composite client roles for this client scope",
        description = "This endpoint returns all the client role mapping for a specific client scope"
    )
    @APIResponse(
        responseCode = "200",
        description = "",
        content = [Content(
            schema = Schema(
                implementation = RoleRepresentation::class
            )
        )]
    )
    fun listCompositeClientScopeRoleMappings(
        @PathParam("id") id: String,
        @QueryParam("first") @DefaultValue("0") first: Long,
        @QueryParam("max") @DefaultValue("10") max: Long
    ): List<ClientRoleRepresentation> {
        val scopeContainer = realm.getClientScopeById(id) ?: throw NotFoundException("Could not find client scope")
        auth.clients().requireView(scopeContainer)

        return availableMapping(Predicate<RoleModel?> { r -> scopeContainer.hasDirectScope(r) }.negate(), first, max)
    }

    @GET
    @Path("/client/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "List all composite client roles for this client",
        description = "This endpoint returns all the client role mapping for a specific client"
    )
    @APIResponse(
        responseCode = "200",
        description = "",
        content = [Content(
            schema = Schema(
                implementation = RoleRepresentation::class
            )
        )]
    )
    fun listCompositeClientRoleMappings(
        @PathParam("id") id: String,
        @QueryParam("first") @DefaultValue("0") first: Long,
        @QueryParam("max") @DefaultValue("10") max: Long
    ): List<ClientRoleRepresentation> {
        val scopeContainer = realm.getClientById(id) ?: throw NotFoundException("Could not find client")
        auth.clients().requireView(scopeContainer)

        return availableMapping(Predicate<RoleModel?> { r -> scopeContainer.hasDirectScope(r) }.negate(), first, max)
    }

    @GET
    @Path("/group/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "List all composite client roles for this group",
        description = "This endpoint returns all the client role mapping for a specific group"
    )
    @APIResponse(
        responseCode = "200",
        description = "",
        content = [Content(
            schema = Schema(
                implementation = RoleRepresentation::class
            )
        )]
    )
    fun listCompositeGroupRoleMappings(
        @PathParam("id") id: String,
        @QueryParam("first") @DefaultValue("0") first: Long,
        @QueryParam("max") @DefaultValue("10") max: Long
    ): List<ClientRoleRepresentation> {
        val scopeContainer = realm.getGroupById(id) ?: throw NotFoundException("Could not find group")
        auth.groups().requireView(scopeContainer)

        return availableMapping(Predicate<RoleModel?> { r -> scopeContainer.hasDirectRole(r) }.negate(), first, max)

    }

    @GET
    @Path("/user/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "List all composite client roles for this user",
        description = "This endpoint returns all the client role mapping for a specific user"
    )
    @APIResponse(
        responseCode = "200",
        description = "",
        content = [Content(
            schema = Schema(
                implementation = RoleRepresentation::class
            )
        )]
    )
    fun listCompositeUserRoleMappings(
        @PathParam("id") id: String,
        @QueryParam("first") @DefaultValue("0") first: Long,
        @QueryParam("max") @DefaultValue("10") max: Long
    ): List<ClientRoleRepresentation> {
        val user = session?.users()?.getUserById(realm, id)
            ?: if (auth.users().canQuery()) throw NotFoundException("User not found") else throw ForbiddenException()
        auth.users().requireView(user);

        return availableMapping(Predicate<RoleModel?> { r -> user.hasDirectRole(r) }.negate(), first, max)

    }

    private fun availableMapping(
        predicate: Predicate<RoleModel?>,
        first: Long,
        max: Long
    ): List<ClientRoleRepresentation> {
        val clients = realm.clientsStream
        val mapper = Mappers.getMapper(RoleMapper::class.java)
        return clients
            .flatMap { c -> c.rolesStream }
            .filter(predicate)
            .filter(auth.roles()::canMapClientScope)

            .map { r -> mapper.convertToRepresentation(r, realm.clientsStream) }
            .skip(first)
            .limit(max)
            .collect(Collectors.toList()) ?: Collections.emptyList()
    }
}