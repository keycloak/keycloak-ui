import React, { ReactNode, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import styles from "@patternfly/react-styles/css/components/DataList/data-list";

export type Field<T> = {
  name: string;
  displayKey?: string;
  cellRenderer?: (row: T) => ReactNode;
};

type DraggableTableProps<T> = {
  keyField: string;
  columns: Field<T>[];
  data: T[];
  onDragFinish: (dragged: string, newOrder: string[]) => void;
};

export function DraggableTable<T>({
  keyField,
  columns,
  data,
  onDragFinish,
}: DraggableTableProps<T>) {
  const { t } = useTranslation("authentication");
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const [state, setState] = useState({
    draggedItemId: "",
    draggingToItemIndex: -1,
    dragging: false,
    tempItemOrder: [""],
  });

  const itemOrder: string[] = useMemo(
    () => data.map((d) => _.get(d, keyField)),
    [data]
  );

  const onDragStart = (evt: React.DragEvent) => {
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    const draggedItemId = evt.currentTarget.id;

    evt.currentTarget.classList.add(styles.modifiers.ghostRow);
    evt.currentTarget.setAttribute("aria-pressed", "true");
    setState({ ...state, draggedItemId, dragging: true });
  };

  const moveItem = (arr: string[], i1: string, toIndex: number) => {
    const fromIndex = arr.indexOf(i1);
    if (fromIndex === toIndex) {
      return arr;
    }
    const temp = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, temp[0]);

    return arr;
  };

  const move = (itemOrder: string[]) => {
    if (!bodyRef.current) return;
    const ulNode = bodyRef.current;
    const nodes = Array.from(ulNode.children);
    if (nodes.map((node) => node.id).every((id, i) => id === itemOrder[i])) {
      return;
    }
    while (ulNode.firstChild) {
      ulNode.removeChild(ulNode.lastChild!);
    }

    itemOrder.forEach((id) => {
      ulNode.appendChild(nodes.find((n) => n.id === id)!);
    });
  };

  const onDragCancel = () => {
    Array.from(bodyRef.current?.children || []).forEach((el) => {
      el.classList.remove(styles.modifiers.ghostRow);
      el.setAttribute("aria-pressed", "false");
    });
    setState({
      ...state,
      draggedItemId: "",
      draggingToItemIndex: -1,
      dragging: false,
    });
  };

  const onDragLeave = (evt: React.DragEvent) => {
    if (!isValidDrop(evt)) {
      move(itemOrder);
      setState({ ...state, draggingToItemIndex: -1 });
    }
  };

  const isValidDrop = (evt: React.DragEvent) => {
    const ulRect = bodyRef.current!.getBoundingClientRect();
    return (
      evt.clientX > ulRect.x &&
      evt.clientX < ulRect.x + ulRect.width &&
      evt.clientY > ulRect.y &&
      evt.clientY < ulRect.y + ulRect.height
    );
  };

  const onDrop = (evt: React.DragEvent) => {
    if (isValidDrop(evt)) {
      onDragFinish(state.draggedItemId, state.tempItemOrder);
    } else {
      onDragCancel();
    }
  };

  const onDragOver = (evt: React.DragEvent) => {
    evt.preventDefault();

    const td = evt.target as HTMLTableCellElement;
    const curListItem = td.closest("tr");
    if (
      !curListItem ||
      (bodyRef.current && !bodyRef.current.contains(curListItem)) ||
      curListItem.id === state.draggedItemId
    ) {
      return null;
    } else {
      const dragId = curListItem.id;
      const draggingToItemIndex = Array.from(
        bodyRef.current?.children || []
      ).findIndex((item) => item.id === dragId);
      if (draggingToItemIndex !== state.draggingToItemIndex) {
        const tempItemOrder = moveItem(
          itemOrder,
          state.draggedItemId,
          draggingToItemIndex
        );
        move(tempItemOrder);

        setState({
          ...state,
          draggingToItemIndex,
          tempItemOrder,
        });
      }
    }
  };

  const onDragEnd = (evt: React.DragEvent) => {
    const tr = evt.target as HTMLTableRowElement;
    tr.classList.remove(styles.modifiers.ghostRow);
    tr.setAttribute("aria-pressed", "false");
    setState({
      ...state,
      draggedItemId: "",
      draggingToItemIndex: -1,
      dragging: false,
    });
  };

  return (
    <TableComposable
      aria-label="Draggable table"
      className={state.dragging ? styles.modifiers.dragOver : ""}
    >
      <Thead>
        <Tr>
          <Th />
          {columns.map((column) => (
            <Th key={column.name}>{t(column.displayKey || column.name)}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody
        ref={bodyRef}
        onDragOver={onDragOver}
        onDrop={onDragOver}
        onDragLeave={onDragLeave}
      >
        {data.map((row) => (
          <Tr
            key={_.get(row, keyField)}
            id={_.get(row, keyField)}
            draggable
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          >
            <Td
              draggableRow={{
                id: `draggable-row-${_.get(row, "id")}`,
              }}
            />
            {columns.map((column) => (
              <Td
                key={`${_.get(row, "id")}_${column.name}`}
                dataLabel={column.name}
              >
                {column.cellRenderer
                  ? column.cellRenderer(row)
                  : _.get(row, column.name)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
}
