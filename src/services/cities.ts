import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { deg2Rad } from "../utils/formatter";

type City = {
  city: string;
  lat: string;
  lng: string;
  country: string;
  iso2: string;
  admin_name: string;
  capital: string;
  population: string;
  population_proper: string;
};

type CitiesResponseAttr = Array<City>;

/**
 * @description Get all france cities.
 * It is using useQuery, so you will have acces to all useQuery states.
 * @returns {Object} Object of type City.
 */
const useGetCities = (): UseQueryResult<CitiesResponseAttr> => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await fetch("./fr.json");
      const parsedResponse = await response.json();

      return parsedResponse.data;
    },
  });
};

// This function will not be used BUT was created as per assignnment requirement.
const getCity = async (query: string) => {
  const response = await fetch("./src/mocks/fr.json");
  const parsedResponse: { data: CitiesResponseAttr } = await response.json();

  const city = parsedResponse.data.filter((city) =>
    city.city.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  );

  if (city.length === 0) {
    return "error";
  }

  console.log(city);

  return city;
};

type ErrorResponse = {
  status: number;
  message: string;
  error: unknown;
};

const getDistance = async (
  destinations: Array<City>
): Promise<{ data: Array<number> } | ErrorResponse | undefined> => {
  const dijon = destinations.filter(
    (city) => city.city.toLocaleLowerCase() === "dijon"
  );

  if (dijon.length > 0) throw new Error("Do not search DIJON!");

  try {
    let distances: Array<number> = [];

    for (let i = 0; i < destinations.length - 1; i++) {
      const lat1 = Number(destinations[i].lat);
      const lng1 = Number(destinations[i].lng);
      const lat2 = Number(destinations[i + 1].lat);
      const lng2 = Number(destinations[i + 1].lng);

      const earthRadius = 6371; // Radius of the earth in km
      const d1 = lat2 - lat1;
      const dLat = deg2Rad(d1);
      const d2 = lng2 - lng1;
      const dLng = deg2Rad(d2);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2Rad(lat1)) *
          Math.cos(deg2Rad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = Number((earthRadius * c).toFixed(2));

      distances.push(d);
    }

    return { data: distances };
  } catch (error) {
    return { status: 500, message: "Error occured. Try again later.", error };
  }
};

export type { City, ErrorResponse };
export { useGetCities, getCity, getDistance };
