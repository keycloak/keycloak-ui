import React, { useState } from "react";

import { TreeView, TreeViewDataItem } from "@patternfly/react-core";

type CheckableTreeViewProps = {
  data: TreeViewDataItem[];
};

export const CheckableTreeView = ({ data }: CheckableTreeViewProps) => {
  const [state, setState] = useState<{
    options: TreeViewDataItem[];
    checkedItems: TreeViewDataItem[];
  }>({ options: data, checkedItems: [] });

  const filterItems = (
    item: TreeViewDataItem,
    checkedItem: TreeViewDataItem
  ): boolean => {
    if (item.id === checkedItem.id) {
      return true;
    }

    if (item.children) {
      return (
        (item.children = item.children
          .map((opt) => Object.assign({}, opt))
          .filter((child) => filterItems(child, checkedItem))).length > 0
      );
    }
    return false;
  };

  const flattenTree = (tree: TreeViewDataItem[]) => {
    let result: TreeViewDataItem[] = [];
    tree.forEach((item) => {
      result.push(item);
      if (item.children) {
        result = result.concat(flattenTree(item.children));
      }
    });
    return result;
  };

  const onCheck = (evt: React.ChangeEvent, treeViewItem: TreeViewDataItem) => {
    const checked = (evt.target as HTMLInputElement).checked;

    const checkedItemTree = state.options
      .map((opt) => Object.assign({}, opt))
      .filter((item) => filterItems(item, treeViewItem));
    const flatCheckedItems = flattenTree(checkedItemTree);

    setState((prevState) => ({
      options: prevState.options,
      checkedItems: checked
        ? prevState.checkedItems.concat(
            flatCheckedItems.filter(
              (item) => !prevState.checkedItems.some((i) => i.id === item.id)
            )
          )
        : prevState.checkedItems.filter(
            (item) => !flatCheckedItems.some((i) => i.id === item.id)
          ),
    }));
  };

  const isChecked = (item: TreeViewDataItem) =>
    state.checkedItems.some((i) => i.id === item.id);

  const areAllDescendantsChecked = (dataItem: TreeViewDataItem): boolean =>
    dataItem.children
      ? dataItem.children.every((child) => areAllDescendantsChecked(child))
      : isChecked(dataItem);

  const areSomeDescendantsChecked = (dataItem: TreeViewDataItem): boolean =>
    dataItem.children
      ? dataItem.children.some((child) => areSomeDescendantsChecked(child))
      : isChecked(dataItem);

  const mapTree = (item: TreeViewDataItem): TreeViewDataItem => {
    const hasCheck = areAllDescendantsChecked(item);
    // Reset checked properties to be updated
    item.checkProps!.checked = false;

    if (hasCheck) {
      item.checkProps!.checked = true;
    } else {
      const hasPartialCheck = areSomeDescendantsChecked(item);
      if (hasPartialCheck) {
        item.checkProps!.checked = null;
      }
    }

    if (item.children) {
      return {
        ...item,
        children: item.children.map((child) => mapTree(child)),
      };
    }
    return item;
  };

  const mapped = state.options.map((item) => mapTree(item));
  return <TreeView data={mapped} onCheck={onCheck} hasChecks />;
};
