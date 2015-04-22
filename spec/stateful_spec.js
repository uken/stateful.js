var assert = require('better-assert');
var Stateful = require('../stateful');

describe('Stateful', function(){
  describe('#extend(Class)', function(){
    it('should be a function', function(){
      assert(typeof Stateful.extend === 'function');
    });
  });
});
