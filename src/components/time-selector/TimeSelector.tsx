import {
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem,
  TextInput,
} from "@patternfly/react-core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Unit = "seconds" | "minutes" | "hours" | "days";

export type TimeSelectorProps = {
  value: number;
  units?: Unit[];
  onChange: (time: number) => void;
};

export const TimeSelector = ({
  value,
  units = ["seconds", "minutes", "hours", "days"],
  onChange,
}: TimeSelectorProps) => {
  const { t } = useTranslation("common");
  const [timeValue, setTimeValue] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [open, setOpen] = useState(false);

  const allTimes: { unit: Unit; label: string; multiplier: number }[] = [
    { unit: "seconds", label: t("times.seconds"), multiplier: 1 },
    { unit: "minutes", label: t("times.minutes"), multiplier: 60 },
    { unit: "hours", label: t("times.hours"), multiplier: 3600 },
    { unit: "days", label: t("times.days"), multiplier: 86400 },
  ];

  const times = allTimes.filter((t) => units.includes(t.unit));

  useEffect(() => {
    const x = times.reduce(
      (v, time) =>
        value % time.multiplier === 0 && v < time.multiplier
          ? time.multiplier
          : v,
      1
    );

    if (value) {
      setMultiplier(x);
      setTimeValue(value / x);
    }
  }, [value]);

  const updateTimeout = (
    timeout: number,
    times: number | undefined = multiplier
  ) => {
    onChange(timeout * times);
  };

  return (
    <Split hasGutter>
      <SplitItem>
        <TextInput
          type="number"
          id="kc-time"
          value={timeValue}
          onChange={(value) => {
            const timeOut = parseInt(value);
            setTimeValue(timeOut);
            updateTimeout(timeOut);
          }}
        />
      </SplitItem>
      <SplitItem>
        <Select
          variant={SelectVariant.single}
          aria-label="Select time"
          onSelect={(_, value) => {
            setMultiplier(value as number);
            updateTimeout(timeValue, value as number);
            setOpen(false);
          }}
          selections={[multiplier]}
          onToggle={() => {
            setOpen(!open);
          }}
          isOpen={open}
        >
          {times.map((time) => (
            <SelectOption key={time.label} value={time.multiplier}>
              {time.label}
            </SelectOption>
          ))}
        </Select>
      </SplitItem>
    </Split>
  );
};
