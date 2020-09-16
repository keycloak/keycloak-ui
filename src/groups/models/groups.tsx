export interface GroupRepresentation {
<<<<<<< HEAD
    id?: string;
    name?: string;
    path?: string;
    attributes?: { [index: string]: string[] };
    realmRoles?: string[];
    clientRoles?: { [index: string]: string[] };
    subGroups?: GroupRepresentation[];
    access?: { [index: string]: boolean };
    groupNumber?: number;
=======
  id?: string;
  name?: string;
  path?: string;
  attributes?: { [index: string]: string[] };
  realmRoles?: string[];
  clientRoles?: { [index: string]: string[] };
  subGroups?: GroupRepresentation[];
  access?: { [index: string]: boolean };
>>>>>>> master
}
