import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import Combobox, {
  getDefaultIntermediate,
  getDefaultValue,
} from "./components/lib/combobox";
import { City, getDistance } from "./services/cities";
import { useNavigate } from "react-router-dom";
import InputNumber from "./components/lib/input-number";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { useDispatchDistance } from "./contexts/distance";
import { isErrorResponse } from "./utils/type-guards";
import Swal from "sweetalert2";
import { formatDate } from "./utils/formatter";

type FormValues = {
  origin: City;
  destination: City;
  intermediate?: Array<City>;
  passengers: number;
  tripDate: Date;
};

function App() {
  const dispatch = useDispatchDistance();
  const [searchParams] = useSearchParams();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const intermediate = searchParams.getAll("intermediate");

  const formMethods = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      origin: origin ? getDefaultValue(origin) : undefined,
      destination: destination ? getDefaultValue(destination) : undefined,
      intermediate: intermediate ? getDefaultIntermediate(intermediate) : [],
      passengers: undefined,
      tripDate: undefined,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    name: "intermediate",
    control,
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const destinations = data.intermediate
      ? [data.origin, ...data.intermediate, data.destination]
      : [data.origin, data.destination];

    try {
      const distance = await getDistance(destinations);

      if (distance && !isErrorResponse(distance)) {
        dispatch({
          cities: destinations,
          distances: distance.data,
          tripDate: formatDate(data.tripDate),
          passengers: data.passengers,
        });
      }

      const intermediateCities = data?.intermediate
        ?.map((city) => `&intermediate=${city?.city.toLocaleLowerCase()}`)
        .join("");

      navigate({
        pathname: "result",
        search: `origin=${data.origin.city.toLocaleLowerCase()}&destination=${data.destination.city.toLocaleLowerCase()}${intermediateCities}`,
      });
    } catch (error) {
      Swal.fire({
        title: "Opps!",
        text: "This is awkward. Try again later.",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center py-5">
      <div className="w-screen max-w-md rounded-md bg-dark-blue p-4">
        <h1 className="mb-6 text-2xl font-bold text-blue">
          Distance Calculator
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid bg-opacity-50"
        >
          <Combobox
            control={control}
            label="Origin"
            name="origin"
            required
            formMethods={formMethods}
            errorMessage={errors ? errors.origin?.message : undefined}
            defaultValue={origin}
          />
          <div className="mb-4">
            <Button
              onClick={() =>
                append({
                  admin_name: "",
                  capital: "",
                  city: "",
                  country: "",
                  iso2: "",
                  lat: "",
                  lng: "",
                  population: "",
                  population_proper: "",
                })
              }
              type="button"
              label="Add city"
              icon="pi pi-plus"
            />
          </div>
          {fields.map((field, index) => (
            <div
              key={`${field.city}-${index}`}
              className="flex items-center justify-between gap-x-3"
            >
              <div className="flex-grow">
                <Combobox
                  control={control}
                  label="Destination"
                  name={`intermediate.${index}`}
                  required
                  formMethods={formMethods}
                  errorMessage={
                    errors.intermediate?.[index]
                      ? "You have to fill this field."
                      : undefined
                  }
                />
              </div>
              <Button
                className="p-button-rounded"
                icon="pi pi-trash"
                type="button"
                onClick={() => remove(index)}
              />
            </div>
          ))}
          <Combobox
            control={control}
            label="Destination"
            name="destination"
            required
            formMethods={formMethods}
            errorMessage={errors ? errors.destination?.message : undefined}
            defaultValue={destination}
          />

          <div className="mb-4">
            <label
              htmlFor="calendar"
              className="mb-2 block text-sm font-bold text-white"
            >
              Trip date
            </label>
            <Controller
              name="tripDate"
              control={control}
              render={({ field }) => (
                <Calendar
                  {...field}
                  id="tripDate"
                  showIcon
                  value={field.value}
                  onChange={field.onChange}
                  minDate={new Date()}
                />
              )}
            />
          </div>

          <InputNumber
            name="passengers"
            control={control}
            rules={{ required: "Passengers is required." }}
            label="Passengers"
            errorMessage={errors ? errors.passengers?.message : undefined}
          />
          <Button label="Submit" loading={isSubmitting} className="mt-4" />
        </form>
      </div>
    </div>
  );
}

export default App;
