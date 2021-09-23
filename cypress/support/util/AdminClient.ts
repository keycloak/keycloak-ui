import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { TEST_REALM } from "./keycloak_hooks";

export default class AdminClient {
  private client: KeycloakAdminClient;
  constructor() {
    this.client = new KeycloakAdminClient({
      baseUrl: `${Cypress.env("KEYCLOAK_SERVER")}/auth`,
      realmName: "master",
    });
  }

  private async login() {
    await this.client.auth({
      username: "admin",
      password: "admin",
      grantType: "password",
      clientId: "admin-cli",
    });
  }

  async createRealm(realm: string) {
    await this.login();
    const theRealm = (await this.client.realms.findOne({ realm })) as
      | RealmRepresentation
      | undefined;
    if (theRealm) {
      await this.deleteRealm(realm);
    }
    await this.client.realms.create({ realm });
  }

  async deleteRealm(realm: string) {
    await this.login();
    await this.client.realms.del({ realm });
  }

  async createClient(client: ClientRepresentation) {
    await this.login();
    await this.client.clients.create({ realm: TEST_REALM, ...client });
  }

  async deleteClient(clientName: string) {
    await this.login();
    const client = (
      await this.client.clients.find({
        realm: TEST_REALM,
        clientId: clientName,
      })
    )[0];
    await this.client.clients.del({ realm: TEST_REALM, id: client.id! });
  }

  async createSubGroups(groups: string[]) {
    await this.login();
    let parentGroup = undefined;
    const createdGroups = [];
    for (const group of groups) {
      if (!parentGroup) {
        parentGroup = await this.client.groups.create({
          realm: TEST_REALM,
          name: group,
        });
      } else {
        parentGroup = await this.client.groups.setOrCreateChild(
          { realm: TEST_REALM, id: parentGroup.id },
          { name: group }
        );
      }
      createdGroups.push(parentGroup);
    }
    return createdGroups;
  }

  async deleteGroups() {
    await this.login();
    const groups = await this.client.groups.find({ realm: TEST_REALM });
    for (const group of groups) {
      await this.client.groups.del({ realm: TEST_REALM, id: group.id! });
    }
  }

  async createUser(user: UserRepresentation) {
    await this.login();
    return await this.client.users.create({ realm: TEST_REALM, ...user });
  }

  async createUserInGroup(username: string, groupId: string) {
    await this.login();
    const user = await this.createUser({ username, enabled: true });
    await this.client.users.addToGroup({
      realm: TEST_REALM,
      id: user.id!,
      groupId,
    });
  }

  async deleteUser(username: string) {
    await this.login();
    const user = await this.client.users.find({ realm: TEST_REALM, username });
    await this.client.users.del({ realm: TEST_REALM, id: user[0].id! });
  }
}
