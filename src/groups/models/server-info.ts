export interface ServerInfoRepresentation {
  id?: number,
  name?: string,
  path?: string,
  subGroups?: []
}

export interface ServerGroupsRepresentation {
  groups: { [index: string]: ServerInfoRepresentation[] };
}

