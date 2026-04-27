import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocation } from '../services/locationService';
import { EventLocation } from '../types';

export const useCreateLocation = () => {
 const queryClient = useQueryClient();

 return useMutation({
    mutationFn: createLocation,

    onMutate: async (newLoc) => {
      await queryClient.cancelQueries({ queryKey: ['locations'] })
      //Snapshot the previous value
      const previousLocs = queryClient.getQueryData<EventLocation[]>(['locations'])
      // Optimistically update to the new value
      queryClient.setQueryData<EventLocation[]>(['locations'], (old = []) => [...old, newLoc as EventLocation])

      // Return a result with the snapshotted value
      return { previousLocs }
    },
    onError: (error, newLoc, context) => {
      console.error("Error creating location:", error);

      if (context?.previousLocs) {
        queryClient.setQueryData(['locations'], context.previousLocs);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}