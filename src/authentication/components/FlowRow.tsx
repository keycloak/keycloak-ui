import React from "react";
import { useTranslation } from "react-i18next";
import {
  DataListItemRow,
  DataListControl,
  DataListDragButton,
  DataListItemCells,
  DataListCell,
  DataListItem,
  DataListToggle,
  Text,
  TextVariants,
} from "@patternfly/react-core";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";
import type { ExpandableExecution } from "../FlowDetails";
import { FlowTitle } from "./FlowTitle";
import { FlowRequirementDropdown } from "./FlowRequirementDropdown";

import "./flow-row.css";

type FlowRowProps = {
  execution: ExpandableExecution;
  onRowClick: (execution: ExpandableExecution) => void;
  onRowChange: (execution: AuthenticationExecutionInfoRepresentation) => void;
};

export const FlowRow = ({
  execution,
  onRowClick,
  onRowChange,
}: FlowRowProps) => {
  const { t } = useTranslation("authentication");
  const hasSubList =
    execution.executionList && execution.executionList.length > 0;
  return (
    <>
      <DataListItem
        className="keycloak__authentication__flow-item"
        id={execution.id}
        isExpanded={!execution.isCollapsed}
      >
        <DataListItemRow
          key={execution.id}
          id={execution.id}
          className="keycloak__authentication__flow-row"
          aria-level={execution.level}
        >
          <DataListControl>
            <DataListDragButton
              aria-label={t("common:reorder")}
              aria-labelledby={execution.displayName}
              aria-describedby={t("common-help:dragHelp")}
            />
          </DataListControl>
          {hasSubList && (
            <DataListToggle
              onClick={() => onRowClick(execution)}
              isExpanded={!execution.isCollapsed}
              id={`toggle1-${execution.id}`}
              aria-controls={`expand-${execution.id}`}
            />
          )}
          <DataListItemCells
            dataListCells={[
              <DataListCell key={`${execution.id}-name`}>
                {!hasSubList && (
                  <FlowTitle
                    key={execution.id}
                    title={execution.displayName!}
                  />
                )}
                {hasSubList && (
                  <>
                    {execution.displayName} <br />{" "}
                    <Text component={TextVariants.small}>
                      {execution.description}
                    </Text>
                  </>
                )}
              </DataListCell>,
              <DataListCell key={`${execution.id}-requirement`}>
                <FlowRequirementDropdown
                  flow={execution}
                  onChange={onRowChange}
                />
              </DataListCell>,
            ]}
          />
        </DataListItemRow>
      </DataListItem>
      {!execution.isCollapsed && hasSubList && (
        <>
          {execution.executionList.map((execution) => (
            <FlowRow
              key={execution.id}
              execution={execution}
              onRowClick={onRowClick}
              onRowChange={onRowChange}
            />
          ))}
        </>
      )}
    </>
  );
};
