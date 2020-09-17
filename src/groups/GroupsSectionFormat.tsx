import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { GroupsSection } from "./GroupsSection";
import { DataLoader } from "../components/data-loader/DataLoader";
import { GroupRepresentation } from "./models/groups";
import { TableToolbar } from "../components/table-toolbar/TableToolbar";
import {
  Button,
} from '@patternfly/react-core';
import { UsersIcon } from '@patternfly/react-icons';
import './GroupsSection.css';
import groupMock from "./__tests__/mock-groups.json";

export const GroupsSectionFormat = () => {

  const data = groupMock.map((c) => {
    var groupName = c["name"];
    var groupNumber = c["groupNumber"];
    return { cells: [
      <Button variant="link" isInline>
        {groupName}
      </Button>,
        <div className="pf-icon-group-members">
          <UsersIcon />
          {groupNumber}
        </div>
    ], selected: false};
  });


  return (
    <GroupsSection formattedData={data}/>
  );
};
