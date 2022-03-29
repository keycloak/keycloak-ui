import React, { Fragment, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  TextInput,
  Button,
  ButtonVariant,
  TextInputProps,
  InputGroup,
} from "@patternfly/react-core";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";

export type MultiLineInputProps = Omit<TextInputProps, "form"> & {
  name: string;
  addButtonLabel?: string;
  isDisabled?: boolean;
  defaultValue?: string[];
};

export const MultiLineInput = ({
  name,
  addButtonLabel,
  isDisabled = false,
  defaultValue,
  ...rest
}: MultiLineInputProps) => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext();

  const value = watch(name, defaultValue);
  const [indexes, setIndexes] = useState(
    Array.isArray(value) ? value.map((_, index) => index) : [0]
  );
  const [counter, setCounter] = useState(0);

  const remove = (index: number) => {
    setIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    setCounter((prevCounter) => prevCounter - 1);
  };

  const append = () => {
    setIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <>
      {indexes.map((index) => (
        <Fragment key={index}>
          <InputGroup>
            <TextInput
              id={name + index}
              ref={register}
              name={`${name}[${index}]`}
              value={value}
              isDisabled={isDisabled}
              {...rest}
            />
            <Button
              variant={ButtonVariant.link}
              onClick={() => remove(index)}
              tabIndex={-1}
              aria-label={t("common:remove")}
              isDisabled={index === indexes.length - 1}
            >
              <MinusCircleIcon />
            </Button>
          </InputGroup>
          {index === indexes.length - 1 && (
            <Button
              variant={ButtonVariant.link}
              onClick={append}
              tabIndex={-1}
              aria-label={t("common:add")}
              data-testid="addValue"
              isDisabled={!value}
            >
              <PlusCircleIcon /> {t(addButtonLabel || "common:add")}
            </Button>
          )}
        </Fragment>
      ))}
    </>
  );
};
