import { useQuery } from "@tanstack/react-query";
import { getLocations } from "../services/locationService";

export const useLocations = () => {
  return useQuery({ 
    queryKey: ["locations"], 
    queryFn: getLocations });
};