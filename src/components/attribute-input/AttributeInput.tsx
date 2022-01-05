import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Button,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";

import "../attribute-form/attribute-form.css";
import type { AttributeType } from "../../clients/authorization/AuthorizationEvaluate";
import { defaultContextAttributes } from "../../clients/utils";

type AttributeInputProps = {
  name: string;
  isKeySelectable?: boolean;
  isValueSelectable?: boolean;
};

export const AttributeInput = ({
  name,
  isKeySelectable,
}: // isValueSelectable,
AttributeInputProps) => {
  const { t } = useTranslation("common");
  const { control, register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name,
  });

  useEffect(() => {
    if (!fields.length) {
      append({ key: "", value: "" });
    }
  }, []);

  const onClear = () => {
    setSelectedAttributes([]);
  };

  // const watchLast = watch(`${name}[${fields.length - 1}].key`, "");
  const watchLast2 = watch(`${name}[${fields.length - 1}].value`, "");

  console.log("hey", watchLast2);

  // const [isExpanded, setIsExpanded] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  // const [valueOpen, setValueOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeType[]>(
    []
  );
  // const [authenticationMethod, setAuthenticationMethod] = useState("");

  return (
    <TableComposable
      className="kc-attributes__table"
      aria-label="Role attribute keys and values"
      variant="compact"
      borders={false}
    >
      <Thead>
        <Tr>
          <Th id="key" width={40}>
            {t("key")}
          </Th>
          <Th id="value" width={40}>
            {t("value")}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {fields.map((attribute, rowIndex) => (
          <Tr key={attribute.id} data-testid="attribute-row">
            <Td>
              {isKeySelectable ? (
                <Select
                  id={`${attribute.id}-key`}
                  name={`${name}[${rowIndex}].key`}
                  toggleId={`group-${name}`}
                  onToggle={() => setKeyOpen(!keyOpen)}
                  isOpen={keyOpen}
                  variant={SelectVariant.typeahead}
                  typeAheadAriaLabel={t("selectOrTypeAKey")}
                  placeholderText={t("selectOrTypeAKey")}
                  isGrouped
                  selections={selectedAttributes}
                  onClear={() => onClear()}
                  onSelect={(_, value) => {
                    // onClear(onChange);
                    setSelectedAttributes([value as AttributeType]);
                    console.log(selectedAttributes);
                    setKeyOpen(false);
                  }}
                >
                  {defaultContextAttributes.map((attribute) => (
                    <SelectOption
                      selected={attribute.name === selectedAttributes[0]?.name}
                      key={attribute.name}
                      value={attribute.name}
                    />
                  ))}
                </Select>
              ) : (
                <TextInput
                  id={`${attribute.id}-key`}
                  name={`${name}[${rowIndex}].key`}
                  ref={register()}
                  defaultValue={attribute.key}
                  data-testid="attribute-key-input"
                />
              )}
            </Td>
            <Td>
              <TextInput
                id={`${attribute.id}-value`}
                name={`${name}[${rowIndex}].value`}
                ref={register()}
                defaultValue={attribute.value}
                data-testid="attribute-value-input"
              />
            </Td>
            <Td key="minus-button" id={`kc-minus-button-${rowIndex}`}>
              <Button
                id={`minus-button-${rowIndex}`}
                variant="link"
                className="kc-attributes__minus-icon"
                onClick={() => remove(rowIndex)}
              >
                <MinusCircleIcon />
              </Button>
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td>
            <Button
              aria-label={t("roles:addAttributeText")}
              id="plus-icon"
              variant="link"
              className="kc-attributes__plus-icon"
              onClick={() => append({ key: "", value: "" })}
              icon={<PlusCircleIcon />}
              isDisabled={!watchLast2}
              data-testid="attribute-add-row"
            >
              {t("roles:addAttributeText")}
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </TableComposable>
  );
};
