import { InputNumber as Input } from "primereact/inputnumber";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { classNames } from "../../utils/class-names";

type InputNumberProps<TValues extends FieldValues> = {
  name: Path<TValues>;
  control: Control<TValues>;
  rules?: RegisterOptions;
  label: string;
  srOnly?: boolean;
  errorMessage?: string;
};

const InputNumber = <TValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  errorMessage,
  srOnly = false,
}: InputNumberProps<TValues>): React.ReactElement => {
  return (
    <div className="mb-2">
      <label
        htmlFor="number"
        className={classNames(
          "mb-2 block text-sm font-bold text-white",
          srOnly ? "sr-only" : ""
        )}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Input
            inputId="number"
            value={field.value}
            onValueChange={field.onChange}
            mode="decimal"
            inputClassName={classNames(errorMessage ? "p-invalid" : "")}
            showButtons
            min={1}
            max={100}
          />
        )}
      />
      <div className="mt-1 h-5">
        {errorMessage ? (
          <p
            className={classNames(
              "text-xs capitalize italic",
              errorMessage ? "p-error" : ""
            )}
          >
            {errorMessage.toString()}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default InputNumber;
