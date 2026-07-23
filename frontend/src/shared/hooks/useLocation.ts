import {
  getCities,
  getCountries,
  getStates,
} from "../services/location.service";

export const useLocation = () => {
  const countries = getCountries();
  const states = getStates();
  const cities = getCities();

  return {
    countries,
    states,
    cities,
  };
};
