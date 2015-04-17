/**
 * Created by federicomaceachen on 3/11/15.
 */
var Pet = Parse.Object.extend("Pet", {
  // Instance methods

  // Instance properties go in an initialize method
  initialize: function (attrs, options) {

  }
}, {
  // Class methods
  getDefaults: function () {
    return {
      image: '',
      color: '',
      state: '',
      zone: '',
      gender: '',
      date: '',
      description: ''
    };
  }
});
