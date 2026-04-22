module {
  public type TripId = Nat;
  public type Timestamp = Int;

  public type TripStatus = {
    #active;
    #completed;
  };

  // Internal mutable record used in state
  public type TripInternal = {
    id : TripId;
    var date : Text;
    var loadId : Text;
    var pickupNumber : Text;
    var pickupTrailerNumber : Text;
    var pickupTime : Text;
    var dropTime : Text;
    var pickupLocation : Text;
    var dropoffLocation : Text;
    var totalMiles : Float;
    var status : TripStatus;
    dateCreated : Timestamp;
    var dateCompleted : ?Timestamp;
  };

  // Shared/public type returned to the frontend
  public type Trip = {
    id : TripId;
    date : Text;
    loadId : Text;
    pickupNumber : Text;
    pickupTrailerNumber : Text;
    pickupTime : Text;
    dropTime : Text;
    pickupLocation : Text;
    dropoffLocation : Text;
    totalMiles : Float;
    status : TripStatus;
    dateCreated : Timestamp;
    dateCompleted : ?Timestamp;
    earnings : Float;
  };

  public type CreateTripInput = {
    date : Text;
    loadId : Text;
    pickupNumber : Text;
    pickupTrailerNumber : Text;
    pickupTime : Text;
    dropTime : Text;
    pickupLocation : Text;
    dropoffLocation : Text;
    totalMiles : Float;
  };

  public type UpdateTripInput = {
    id : TripId;
    date : ?Text;
    loadId : ?Text;
    pickupNumber : ?Text;
    pickupTrailerNumber : ?Text;
    pickupTime : ?Text;
    dropTime : ?Text;
    pickupLocation : ?Text;
    dropoffLocation : ?Text;
    totalMiles : ?Float;
  };
};
