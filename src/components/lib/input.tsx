import { InputText } from "primereact/inputtext";
import {
  Controller,
  Control,
  RegisterOptions,
  Path,
  FieldValues,
} from "react-hook-form";
import { classNames } from "../../utils/class-names";

type InputProps<TValues extends FieldValues> = {
  name: Path<TValues>;
  control: Control<TValues>;
  rules?: RegisterOptions;
  errorMessage?: string;
  label: string;
  srOnly?: boolean;
  placeholder?: string;
};

const Input = <TValues extends FieldValues>({
  name,
  control,
  rules,
  errorMessage,
  label,
  placeholder,
  srOnly = false,
}: InputProps<TValues>): React.ReactElement => {
  return (
    <div className="mb-2">
      <label
        htmlFor={name}
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
          <InputText
            id={field.name}
            {...field}
            placeholder={placeholder}
            className={classNames("w-full", errorMessage ? "p-invalid" : "")}
          />
        )}
      />
      <div className="mt-1 h-5">
        {errorMessage ? (
          <p
            className={classNames(
              "text-xs italic",
              errorMessage ? "p-error" : ""
            )}
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
