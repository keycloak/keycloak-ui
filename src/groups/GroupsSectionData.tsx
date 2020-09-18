import React from "react";
import { GroupsSection } from "./GroupsSection";
import './GroupsSection.css';
import groupMock from "./__tests__/mock-groups.json";

export const GroupsSectionData = () => {

  return (
    <GroupsSection data={groupMock}/>
  );
};
