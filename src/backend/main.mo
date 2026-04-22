import Types "types/trips";
import TripsMixin "mixins/trips-api";
import Migration "migration";
import List "mo:core/List";

(with migration = Migration.run)
actor {
  let trips = List.empty<Types.TripInternal>();

  include TripsMixin(trips);
};
