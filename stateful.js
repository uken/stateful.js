(function(){'use strict';
  var extend = function(a, b) {
    var results = [];

    for (var k in b) {
      if (b.hasOwnProperty(k)){
        var v = b[k];
        results.push(a[k] = v);
      }
    }

    return results;
  };

  var isFunction = function(func) {
    return typeof func === 'function';
  };

  var Stateful = {
    extend: function(klass) {
      var currentStateName = null;
      var originalPrototype = {};
      var possibleStates = {};

      for (var k in klass.prototype) {
        if (klass.prototype.hasOwnProperty(k)) {
          var v = klass.prototype[k];
          originalPrototype[k] = v;
        }
      }

      klass.prototype.gotoState = function() {
        var currentState, state;
        var stateName = arguments[0];
        var args = 2 <= arguments.length ? arguments.slice(1) : [];

        if (currentStateName !== null) {
          currentState = possibleStates[currentStateName];
        }

        state = possibleStates[stateName];
        if (stateName && !state) {
          console.warn('That state is not defined for this object.');
          return false;
        }

        if (isFunction(this.exitState)) {
          this.exitState();
        }

        if (currentState !== null) {
          for (k in currentState) {
            if (currentState.hasOwnProperty(k)) {
              this[k] = void 0;
            }
          }
        }

        if (state) {
          extend(this, state);
        } else {
          extend(this, originalPrototype);
        }

        currentStateName = stateName;
        if (isFunction(this.enterState)) {
          this.enterState.apply(this, args);
        }
      };

      klass.addState = function(stateName, state) {
        possibleStates[stateName] = state;
      };
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Stateful;
    }
    exports.Stateful = Stateful;
  } else {
    this.Stateful = Stateful;
  }
})();