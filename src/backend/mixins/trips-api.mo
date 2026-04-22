import Types "../types/trips";
import TripLib "../lib/trips";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  trips : List.List<Types.TripInternal>,
) {
  var nextTripId : Nat = 1;

  /// Create a new active trip. Returns the created trip.
  public shared func createTrip(input : Types.CreateTripInput) : async Types.Trip {
    let trip = TripLib.createTrip(trips, nextTripId, input);
    nextTripId += 1;
    TripLib.toPublic(trip);
  };

  /// Update fields on an active trip. Returns true if updated, false if not found or not active.
  public shared func updateTrip(input : Types.UpdateTripInput) : async Bool {
    TripLib.updateTrip(trips, input);
  };

  /// Mark an active trip as completed with a timestamp. Returns true if completed, false otherwise.
  public shared func completeTrip(id : Types.TripId) : async Bool {
    TripLib.completeTrip(trips, id, Time.now());
  };

  /// Get the current active trip, if any.
  public query func getActiveTrip() : async ?Types.Trip {
    TripLib.getActiveTrip(trips);
  };

  /// Get all completed trips sorted by dateCompleted descending.
  public query func getCompletedTrips() : async [Types.Trip] {
    TripLib.getCompletedTrips(trips);
  };

  /// Get a single trip by ID.
  public query func getTripById(id : Types.TripId) : async ?Types.Trip {
    TripLib.getTripById(trips, id);
  };

  /// Delete a trip by ID. Returns true if deleted, false if not found.
  public shared func deleteTrip(id : Types.TripId) : async Bool {
    TripLib.deleteTrip(trips, id);
  };
};
