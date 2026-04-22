import Types "../types/trips";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  let CPM : Float = 0.775;

  public func calcEarnings(totalMiles : Float) : Float {
    totalMiles * CPM;
  };

  public func toPublic(trip : Types.TripInternal) : Types.Trip {
    {
      id = trip.id;
      date = trip.date;
      loadId = trip.loadId;
      pickupNumber = trip.pickupNumber;
      pickupTrailerNumber = trip.pickupTrailerNumber;
      pickupTime = trip.pickupTime;
      dropTime = trip.dropTime;
      pickupLocation = trip.pickupLocation;
      dropoffLocation = trip.dropoffLocation;
      totalMiles = trip.totalMiles;
      status = trip.status;
      dateCreated = trip.dateCreated;
      dateCompleted = trip.dateCompleted;
      earnings = calcEarnings(trip.totalMiles);
    };
  };

  public func createTrip(
    trips : List.List<Types.TripInternal>,
    nextId : Nat,
    input : Types.CreateTripInput,
  ) : Types.TripInternal {
    let trip : Types.TripInternal = {
      id = nextId;
      var date = input.date;
      var loadId = input.loadId;
      var pickupNumber = input.pickupNumber;
      var pickupTrailerNumber = input.pickupTrailerNumber;
      var pickupTime = input.pickupTime;
      var dropTime = input.dropTime;
      var pickupLocation = input.pickupLocation;
      var dropoffLocation = input.dropoffLocation;
      var totalMiles = input.totalMiles;
      var status = #active;
      dateCreated = Time.now();
      var dateCompleted = null;
    };
    trips.add(trip);
    trip;
  };

  public func updateTrip(
    trips : List.List<Types.TripInternal>,
    input : Types.UpdateTripInput,
  ) : Bool {
    switch (trips.find(func(t : Types.TripInternal) : Bool { t.id == input.id and t.status == #active })) {
      case null { false };
      case (?trip) {
        switch (input.date) { case (?v) { trip.date := v }; case null {} };
        switch (input.loadId) { case (?v) { trip.loadId := v }; case null {} };
        switch (input.pickupNumber) { case (?v) { trip.pickupNumber := v }; case null {} };
        switch (input.pickupTrailerNumber) { case (?v) { trip.pickupTrailerNumber := v }; case null {} };
        switch (input.pickupTime) { case (?v) { trip.pickupTime := v }; case null {} };
        switch (input.dropTime) { case (?v) { trip.dropTime := v }; case null {} };
        switch (input.pickupLocation) { case (?v) { trip.pickupLocation := v }; case null {} };
        switch (input.dropoffLocation) { case (?v) { trip.dropoffLocation := v }; case null {} };
        switch (input.totalMiles) { case (?v) { trip.totalMiles := v }; case null {} };
        true;
      };
    };
  };

  public func completeTrip(
    trips : List.List<Types.TripInternal>,
    id : Types.TripId,
    now : Types.Timestamp,
  ) : Bool {
    switch (trips.find(func(t : Types.TripInternal) : Bool { t.id == id and t.status == #active })) {
      case null { false };
      case (?trip) {
        trip.status := #completed;
        trip.dateCompleted := ?now;
        true;
      };
    };
  };

  public func getActiveTrip(trips : List.List<Types.TripInternal>) : ?Types.Trip {
    switch (trips.find(func(t : Types.TripInternal) : Bool { t.status == #active })) {
      case null { null };
      case (?trip) { ?toPublic(trip) };
    };
  };

  public func getCompletedTrips(trips : List.List<Types.TripInternal>) : [Types.Trip] {
    let completed = trips.filter(func(t : Types.TripInternal) : Bool { t.status == #completed });
    let publicList = completed.map<Types.TripInternal, Types.Trip>(func(t) { toPublic(t) });
    let arr = publicList.toArray();
    arr.sort(func(a : Types.Trip, b : Types.Trip) : { #less; #equal; #greater } {
      let aTime = switch (a.dateCompleted) { case (?t) t; case null 0 };
      let bTime = switch (b.dateCompleted) { case (?t) t; case null 0 };
      if (bTime > aTime) { #less } else if (bTime < aTime) { #greater } else { #equal };
    });
  };

  public func getTripById(
    trips : List.List<Types.TripInternal>,
    id : Types.TripId,
  ) : ?Types.Trip {
    switch (trips.find(func(t : Types.TripInternal) : Bool { t.id == id })) {
      case null { null };
      case (?trip) { ?toPublic(trip) };
    };
  };

  public func deleteTrip(
    trips : List.List<Types.TripInternal>,
    id : Types.TripId,
  ) : Bool {
    let sizeBefore = trips.size();
    switch (trips.findIndex(func(t : Types.TripInternal) : Bool { t.id == id })) {
      case null { false };
      case (?idx) {
        let sz = trips.size();
        let last : Nat = if (sz > 0) { sz - 1 } else { 0 };
        if (idx < last) {
          let lastItem = trips.at(last);
          trips.put(idx, lastItem);
        };
        ignore trips.removeLast();
        trips.size() < sizeBefore;
      };
    };
  };
};
