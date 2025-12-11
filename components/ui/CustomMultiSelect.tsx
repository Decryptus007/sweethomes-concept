"use client";

import React from "react";
import Select, { components } from "react-select";

const MAX_DISPLAYED_VALUES = 2;

// Custom MultiValue component that limits display
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LimitedMultiValue = (props: any) => {
  const { getValue } = props;
  const values = getValue();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const index = values.findIndex((val: any) => val.value === props.data.value);

  // Only show first MAX_DISPLAYED_VALUES items
  if (index >= MAX_DISPLAYED_VALUES) {
    return null;
  }

  return <components.MultiValue {...props} />;
};

// Custom component to show "+X more"
const MoreSelectedBadge = ({
  items,
}: {
  items: { value: number; label: string }[];
}) => {
  const overflowCount = items.length - MAX_DISPLAYED_VALUES;
  if (overflowCount <= 0) return null;

  return (
    <div
      style={{
        backgroundColor: "#d4c4b0",
        color: "#3d2f28",
        borderRadius: "4px",
        padding: "2px 6px",
        fontSize: "0.75rem",
        fontWeight: "500",
        display: "inline-flex",
        alignItems: "center",
        margin: "2px",
      }}
    >
      +{overflowCount} more
    </div>
  );
};

interface Option {
  value: number;
  label: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  label: string;
}

export function CustomMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isLoading = false,
  label,
}: CustomMultiSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-foreground block text-sm font-medium">
        {label}
      </label>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={(selected) => onChange(selected as Option[])}
        placeholder={placeholder}
        isLoading={isLoading}
        className="react-select-container"
        classNamePrefix="react-select"
        components={{
          MultiValue: LimitedMultiValue,
        }}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#e0d3c7",
            backgroundColor: "#efe5dc",
            "&:hover": {
              borderColor: "#a0906e",
            },
            "&:focus-within": {
              borderColor: "#a0906e",
              boxShadow: "0 0 0 2px rgba(160, 144, 110, 0.2)",
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#f7f2ed",
            border: "1px solid #e0d3c7",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#d4c4b0"
              : state.isFocused
                ? "rgba(212, 196, 176, 0.5)"
                : "#f7f2ed",
            color: "#3d2f28",
            "&:hover": {
              backgroundColor: state.isSelected
                ? "#d4c4b0"
                : "rgba(212, 196, 176, 0.5)",
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#d4c4b0",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#3d2f28",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#3d2f28",
            "&:hover": {
              backgroundColor: "#c4634f",
              color: "#ffffff",
            },
          }),
          input: (base) => ({
            ...base,
            color: "#3d2f28",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#8d7a6b",
          }),
          valueContainer: (base) => ({
            ...base,
            display: "flex",
            flexWrap: "nowrap",
            overflow: "hidden",
          }),
        }}
      />
      {value.length > MAX_DISPLAYED_VALUES && (
        <MoreSelectedBadge items={value} />
      )}
    </div>
  );
}
