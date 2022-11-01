import { Timeline } from "primereact/timeline";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { useStateDistance } from "../contexts/distance";
import { useNavigate } from "react-router-dom";

const Result = (): React.ReactElement => {
  const distance = useStateDistance();
  console.log(distance);

  const navigate = useNavigate();

  if (distance.passengers) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center py-5">
        <h2 className="mb-4 text-xl">
          This is your route and the distance between the cities.
        </h2>
        <div className="flex gap-x-5 pb-6">
          <Chip label={distance.tripDate} icon="pi pi-calendar" />
          <Chip label={`${distance.passengers}`} icon="pi pi-users" />
        </div>
        <div className="flex w-screen max-w-md items-center">
          <Timeline
            align="right"
            value={distance.cities}
            content={(item) => item.city}
          />
          <Timeline
            align="left"
            value={distance.distances}
            content={(item) => <p className="w-full font-bold">{item} kms</p>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center py-5">
      <h2 className="mb-6 text-xl font-bold">
        Oops, you have to enter your cities first.
      </h2>
      <Button onClick={() => navigate("/")} aria-label="Google">
        <i className="pi pi-home px-2"></i>
        <span className="px-3">Go home</span>
      </Button>
    </div>
  );
};

export default Result;
