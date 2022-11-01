import {
  AutoComplete,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { classNames } from "../../utils/class-names";
import { useState } from "react";
import { City, useGetCities } from "../../services/cities";
import citiesObject from "../../mocks/fr.json";
import { Skeleton } from "primereact/skeleton";
import FallbackError from "../fallbackError";

type ComboboxProps<TValues extends FieldValues> = {
  name: Path<TValues>;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  label: string;
  srOnly?: boolean;
  placeholder?: string;
  formMethods: UseFormReturn<TValues>;
  required?: boolean;
  defaultValue?: string | null | Array<string>;
  control: Control<TValues>;
};

const getDefaultValue = (query?: string): City | undefined => {
  const defaultValue = citiesObject.data.filter(
    (city) => city.city.toLocaleLowerCase() === query?.toLocaleLowerCase()
  )?.[0];

  if (defaultValue) {
    return defaultValue;
  }

  return undefined;
};

const getDefaultIntermediate = (
  query?: Array<string>
): Array<City> | undefined => {
  const lowerQuery = query?.map((city) => city.toLocaleLowerCase());
  const defaultValue = citiesObject.data.filter((location) =>
    lowerQuery?.includes(location.city.toLocaleLowerCase())
  );

  if (defaultValue.length > 0) {
    return defaultValue;
  }

  return undefined;
};

const Combobox = <TValues extends FieldValues>({
  name,
  errorMessage,
  label,
  placeholder,
  formMethods,
  control,
  srOnly = false,
  required = false,
}: ComboboxProps<TValues>): React.ReactElement => {
  const [filteredCities, setFilteredCities] = useState<Array<City>>([]);

  const cities = useGetCities();

  formMethods.register(
    name,
    required ? { required: `${name} is required.` } : undefined
  );

  if (cities.isError) {
    return <FallbackError />;
  }

  if (cities.isSuccess) {
    const searchCity = (event: AutoCompleteCompleteMethodParams) => {
      setTimeout(() => {
        let _filteredCities;
        if (!event.query.trim().length) {
          _filteredCities = [...cities.data];
        } else {
          _filteredCities = cities.data.filter((city) => {
            return city.city
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }

        setFilteredCities(_filteredCities);
      }, 250);
    };

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
          render={({ field }) => {
            if (field.value === "fail") return <FallbackError />;
            return (
              <AutoComplete
                id={name}
                value={field.value}
                suggestions={filteredCities}
                completeMethod={searchCity}
                field="city"
                forceSelection
                dropdown
                onChange={field.onChange}
                onBlur={() => formMethods.trigger(name)}
                aria-label="Cities"
                inputClassName={classNames(
                  "w-full",
                  errorMessage ? "p-invalid" : ""
                )}
                dropdownAriaLabel="Select City"
                placeholder={placeholder}
              />
            );
          }}
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
  }

  return (
    <div className="my-3">
      <Skeleton className="mb-2 w-4"></Skeleton>
      <div className="h-14">
        <Skeleton className="h-full"></Skeleton>
      </div>
    </div>
  );
};

export default Combobox;
export { getDefaultValue, getDefaultIntermediate };
