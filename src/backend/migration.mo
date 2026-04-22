import Types "types/trips";
import List "mo:core/List";

module {
  // Old TripInternal shape (from previous version)
  type OldTripStatus = {
    #active;
    #completed;
  };

  type OldTripInternal = {
    id : Nat;
    var cargoDescription : Text;
    var cargoWeight : Float;
    var pickupLocation : Text;
    var dropoffLocation : Text;
    var totalMiles : Float;
    var revenue : Float;
    var mpg : Float;
    var fuelPricePerGallon : Float;
    var status : OldTripStatus;
    dateCreated : Int;
    var dateCompleted : ?Int;
  };

  // Only consume trips from old state — nextTripId migrates automatically (same type, same name)
  type OldActor = {
    trips : List.List<OldTripInternal>;
    var nextTripId : Nat;
  };

  type NewActor = {
    trips : List.List<Types.TripInternal>;
  };

  public func run(old : OldActor) : NewActor {
    let newTrips = old.trips.map<OldTripInternal, Types.TripInternal>(
      func(t) {
        {
          id = t.id;
          var date = "";
          var loadId = "";
          var pickupNumber = "";
          var pickupTrailerNumber = "";
          var pickupTime = "";
          var dropTime = "";
          var pickupLocation = t.pickupLocation;
          var dropoffLocation = t.dropoffLocation;
          var totalMiles = t.totalMiles;
          var status = t.status;
          dateCreated = t.dateCreated;
          var dateCompleted = t.dateCompleted;
        }
      }
    );
    { trips = newTrips };
  };
};
