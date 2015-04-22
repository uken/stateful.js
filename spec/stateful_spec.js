require('should');
var sinon = require('sinon');
var Stateful = require('../stateful');

describe('Stateful', function(){'use strict';
  describe('#extend(Class)', function(){
    it('should be a function', function(){
      Stateful.extend.should.be.type('function');
    });
  });

  describe('An Extended Class', function(){
    var TestClass;

    beforeEach(function(){
      TestClass = function(){};
      Stateful.extend(TestClass);
    });

    describe('#addState(stateName, stateDefinition)', function(){
      it('should be a function', function(){
        TestClass.addState.should.be.type('function');
      });

      it('adds a state to the possible states', function(){
        var testInstance = new TestClass();
        testInstance.gotoState.bind(testInstance, 'TestState').should.throw();
        TestClass.addState('TestState', {});
        testInstance.gotoState.bind(testInstance, 'TestState').should.not.throw();
      });
    });

    describe('A Stateful Instance', function(){
      var testInstance;

      beforeEach(function(){
        var TestState = {
          enterState: sinon.spy(),
          testProperty: sinon.spy(),
          exitState: sinon.spy()
        };
        TestClass.addState('TestState', TestState);
        testInstance = new TestClass();
      });

      describe('#gotoState', function(){
        it('should be a function', function(){
          testInstance.gotoState.should.be.type('function');
        });

        it('should throw when going to an undefined state', function(){
          testInstance.gotoState.bind(testInstance, 'NotAState').should.throw();
        });

        it('adds properties from the state definition to the instance', function(){
          testInstance.should.not.have.property('testProperty');
          testInstance.gotoState('TestState');
          testInstance.should.have.property('testProperty');
        });

        it('returns to the base state when called without a state name', function(){
          testInstance.gotoState('TestState');
          testInstance.should.have.property('testProperty');
          testInstance.gotoState();
          testInstance.should.not.have.property('testProperty');
        });

        it('calls `enterState` and `exitState` if they exist', function(){
          testInstance.gotoState('TestState');
          var enterState = testInstance.enterState;
          var exitState = testInstance.exitState;
          enterState.calledOnce.should.be(true);
          testInstance.gotoState();
          exitState.calledOnce.should.be(true);
        });
      });
    });
  });
});
