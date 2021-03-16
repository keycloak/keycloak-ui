import React, { FormEvent, Fragment, ReactNode } from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  Divider,
  ChipGroup,
  Chip,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";

type TableToolbarProps = {
  toolbarItem?: ReactNode;
  toolbarItemFooter?: ReactNode;
  children: ReactNode;
  searchTypeComponent?: ReactNode;
  filterChips?: boolean;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnChange?: (
    newInput: string,
    event: FormEvent<HTMLInputElement>
  ) => void;
  inputGroupOnEnter?: (value: string) => void;
};

export const TableToolbar = ({
  toolbarItem,
  toolbarItemFooter,
  children,
  searchTypeComponent,
  filterChips,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnChange,
  inputGroupOnEnter,
}: TableToolbarProps) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [searchFilters, setSearchFilters] = React.useState<string[]>([]);

  const onSearch = () => {
    if (searchValue !== "") {
      setSearchValue(searchValue);
      inputGroupOnEnter && inputGroupOnEnter(searchValue);
    }

    const filterDuplicate = searchFilters.filter(
      (v, i) => searchFilters.indexOf(v) === i
    );

    if (!searchFilters.includes(searchValue!) && searchValue !== "") {
      setSearchFilters([...filterDuplicate, searchValue!]);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleInputChange = (
    value: string,
    event: FormEvent<HTMLInputElement>
  ) => {
    inputGroupOnChange && inputGroupOnChange(value, event);
    setSearchValue(value);
  };

  const handleRemoveItem = (filterName: string) => {
    setSearchFilters(searchFilters!.filter((item) => item !== filterName));
    inputGroupOnEnter && inputGroupOnEnter("");
    setSearchValue(searchValue);
  };

  const clearAllFilters = () => {
    inputGroupOnEnter && inputGroupOnEnter("");
    setSearchValue(searchValue);
    setSearchFilters([]);
  };

  const chips = (
    <>
      <ChipGroup
        className="kc-filter-chip-group__table"
        categoryName={t("roles:roleName")}
      >
        {searchFilters!.map((currentChip) => (
          <Chip key={currentChip} onClick={() => handleRemoveItem(currentChip)}>
            {currentChip}
          </Chip>
        ))}
      </ChipGroup>
      {searchFilters!.length > 0 && (
        <Button variant="link" onClick={() => clearAllFilters()}>
          {t("roles:clearAllFilters")}
        </Button>
      )}
    </>
  );

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <Fragment>
            {inputGroupName && (
              <ToolbarItem>
                <InputGroup>
                  {searchTypeComponent}
                  {inputGroupPlaceholder && (
                    <>
                      <TextInput
                        name={inputGroupName}
                        id={inputGroupName}
                        type="search"
                        aria-label={t("search")}
                        placeholder={inputGroupPlaceholder}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                      />
                      <Button
                        variant={ButtonVariant.control}
                        aria-label={t("search")}
                        onClick={onSearch}
                      >
                        <SearchIcon />
                      </Button>
                    </>
                  )}
                </InputGroup>
              </ToolbarItem>
            )}
          </Fragment>
          {toolbarItem}
        </ToolbarContent>
      </Toolbar>
      {filterChips && chips}
      <Divider />
      {children}
      <Toolbar>{toolbarItemFooter}</Toolbar>
    </>
  );
};
