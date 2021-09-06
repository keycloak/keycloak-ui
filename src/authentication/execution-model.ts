import type AuthenticationExecutionInfoRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationExecutionInfoRepresentation";

export type ExpandableExecution = AuthenticationExecutionInfoRepresentation & {
  executionList: ExpandableExecution[];
  isCollapsed: boolean;
};

export class IndexChange {
  oldIndex: number;
  newIndex: number;

  constructor(oldIndex: number, newIndex: number) {
    this.oldIndex = oldIndex;
    this.newIndex = newIndex;
  }
}

export class LevelChange extends IndexChange {
  parent?: ExpandableExecution;

  constructor(
    oldIndex: number,
    newIndex: number,
    parent?: ExpandableExecution
  ) {
    super(oldIndex, newIndex);
    this.parent = parent;
  }
}

export class ExecutionList {
  private list: ExpandableExecution[];
  expandableList: ExpandableExecution[];

  constructor(list: AuthenticationExecutionInfoRepresentation[]) {
    this.list = list as ExpandableExecution[];
    this.expandableList = this.transformToExpandableList(0, 0, {
      executionList: [],
      isCollapsed: false,
    }).executionList;
  }

  private transformToExpandableList(
    level: number,
    currIndex: number,
    execution: ExpandableExecution
  ) {
    for (let index = currIndex; index < this.list.length; index++) {
      const ex = this.list[index];
      const nextRowLevel = this.list[index + 1]?.level || 0;

      if (ex.level === level && nextRowLevel <= level) {
        execution.executionList.push(ex);
      } else if (ex.level === level && nextRowLevel > level) {
        const expandable = this.transformToExpandableList(
          nextRowLevel,
          index + 1,
          {
            ...ex,
            executionList: [],
            isCollapsed: false,
          }
        );
        execution.executionList.push(expandable);
      }
    }
    return execution;
  }

  order(list?: ExpandableExecution[]) {
    let result: ExpandableExecution[] = [];
    for (const row of list || this.expandableList) {
      result.push(row);
      if (row.executionList && !row.isCollapsed) {
        result = result.concat(this.order(row.executionList));
      }
    }
    return result;
  }

  findExecution(
    id: string,
    list?: ExpandableExecution[]
  ): ExpandableExecution | undefined {
    let found = (list || this.expandableList).find((ex) => ex.id === id);
    if (!found) {
      for (const ex of list || this.expandableList) {
        if (ex.executionList) {
          found = this.findExecution(id, ex.executionList);
          if (found) {
            return found;
          }
        }
      }
    }
    return found;
  }

  private getParentNodes(level?: number) {
    for (let index = 0; index < this.list.length; index++) {
      const ex = this.list[index];
      if (
        index + 1 < this.list.length &&
        this.list[index + 1].level! > ex.level! &&
        ex.level! + 1 === level
      ) {
        return ex;
      }
    }
  }

  getChange(
    changed: AuthenticationExecutionInfoRepresentation,
    order: string[]
  ) {
    const currentOrder = this.order();
    const newLocIndex = order.findIndex((id) => id === changed.id);
    const oldLocation =
      currentOrder[currentOrder.findIndex((ex) => ex.id === changed.id)];
    const newLocation = currentOrder[newLocIndex];

    if (newLocation.level !== oldLocation.level) {
      if (newLocation.level! > 0) {
        const parent = this.getParentNodes(newLocation.level);
        return new LevelChange(
          parent?.executionList.length || 0,
          newLocation.index!,
          parent
        );
      }
      return new LevelChange(this.expandableList.length, newLocation.index!);
    }

    return new IndexChange(oldLocation.index!, newLocation.index!);
  }

  clone() {
    const newList = new ExecutionList([]);
    newList.list = this.list;
    newList.expandableList = this.expandableList;
    return newList;
  }
}
