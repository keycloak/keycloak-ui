import React, { useEffect, useState } from "react";
import { Button, Chip, ChipGroup, PageSection } from "@patternfly/react-core";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import { RolesList } from "./RolesList";
import { useErrorHandler } from "react-error-boundary";
import { useTranslation } from "react-i18next";

export const RealmRolesSection = () => {
  const adminClient = useAdminClient();
  const [listRoles, setListRoles] = useState(false);
  const [searchFilters, setSearchFilters] = useState([] as string[]);
  const handleError = useErrorHandler();
  const { t } = useTranslation("roles");

  useEffect(() => {
    return asyncStateFetch(
      () => {
        return Promise.all([adminClient.roles.find()]);
      },

      (response) => {
        setListRoles(!(response[0] && response[0].length > 0));
      },
      handleError
    );
  }, []);

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max!,
    };

    const searchParam = search || "";

    if (searchParam) {
      const filterDuplicate = searchFilters.filter(
        (v, i) => searchFilters.indexOf(v) === i
      );

      if (!searchFilters.includes(search!)) {
        setSearchFilters([...filterDuplicate, search!]);
      }

      params.search = searchParam;
    }

    if (searchParam === "") {
      setSearchFilters([]);
    }
    if (listRoles) {
      return [];
    }

    return await adminClient.roles.find(params);
  };

  const handleRemoveItem = (filterName: string) => {
    setSearchFilters(searchFilters!.filter((item) => item !== filterName));
  };

  return (
    <>
      <ViewHeader titleKey="roles:title" subKey="roles:roleExplain" />
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <RolesList
          filterChips={
            <>
              <ChipGroup categoryName={t("roles:roleName")}>
                {searchFilters!.map((currentChip) => (
                  <Chip
                    key={currentChip}
                    onClick={() => handleRemoveItem(currentChip)}
                  >
                    {currentChip}
                  </Chip>
                ))}
              </ChipGroup>
              {searchFilters!.length > 0 && (
                <Button variant="link" onClick={() => setSearchFilters([])}>
                  {t("roles:clearAllFilters")}
                </Button>
              )}
            </>
          }
          searchFilters={searchFilters}
          loader={loader}
        />
      </PageSection>
    </>
  );
};
