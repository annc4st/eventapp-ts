import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";

import { CreateLocation } from "./CreateLocation";

export const LocationsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { locations, loading, error } = useSelector(
    (state: RootState) => state.locations
  );

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    <>
      <div>
        <CreateLocation />
      </div>
      <h3>List of Locations</h3>
      {loading && <p>Loading locations ...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && locations.length === 0 && (
        <p>No locations available.</p>
      )}
      {!loading && !error && locations.length > 0 && (
        <ul>
          {locations.map((l) => {
            return (
              <li key={l.id}>
                <p>{l.firstLine}</p>
                <p>{l.city}, {l.postcode}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
