import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "./backend";
import type {
  CreateTripInput,
  Trip,
  UpdateTripInput,
  backendInterface,
} from "./backend";

export type { Trip, CreateTripInput, UpdateTripInput };

export function useActiveTrip() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Trip | null>({
    queryKey: ["activeTrip"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as unknown as backendInterface).getActiveTrip();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useCompletedTrips() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Trip[]>({
    queryKey: ["completedTrips"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as backendInterface).getCompletedTrips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTripById(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Trip | null>({
    queryKey: ["trip", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return (actor as unknown as backendInterface).getTripById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateTrip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as backendInterface).createTrip(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTrip"] });
      queryClient.invalidateQueries({ queryKey: ["completedTrips"] });
    },
  });
}

export function useUpdateTrip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTripInput) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as backendInterface).updateTrip(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activeTrip"] });
      queryClient.invalidateQueries({
        queryKey: ["trip", variables.id.toString()],
      });
    },
  });
}

export function useCompleteTrip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as backendInterface).completeTrip(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTrip"] });
      queryClient.invalidateQueries({ queryKey: ["completedTrips"] });
    },
  });
}

export function useDeleteTrip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as backendInterface).deleteTrip(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTrip"] });
      queryClient.invalidateQueries({ queryKey: ["completedTrips"] });
    },
  });
}
