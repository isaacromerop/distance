import { City } from "../services/cities";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type DistanceObject = {
  cities: Array<City>;
  distances: Array<number>;
  tripDate: string;
  passengers: number;
};

const StateDistanceContext = createContext<DistanceObject | null>(null);

const DispatchDistanceContext = createContext<Dispatch<
  SetStateAction<DistanceObject>
> | null>(null);

type DistanceProviderProps = {
  children: React.ReactNode;
};

const DistanceProvider = ({
  children,
}: DistanceProviderProps): React.ReactElement => {
  const [distance, setDistance] = useState<DistanceObject>(
    {} as DistanceObject
  );

  return (
    <DispatchDistanceContext.Provider value={setDistance}>
      <StateDistanceContext.Provider value={distance}>
        {children}
      </StateDistanceContext.Provider>
    </DispatchDistanceContext.Provider>
  );
};

const useDispatchDistance = () => {
  const context = useContext(DispatchDistanceContext);

  if (!context) {
    throw new Error(
      "useDispatchDistance must be used within the DistanceProvider"
    );
  }

  return context;
};

const useStateDistance = () => {
  const context = useContext(StateDistanceContext);

  if (!context) {
    throw new Error(
      "useStateDistance must be used within the DistanceProvider"
    );
  }

  return context;
};

export default DistanceProvider;
export { useDispatchDistance, useStateDistance };
