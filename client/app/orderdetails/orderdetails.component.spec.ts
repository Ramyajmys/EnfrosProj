'use strict';

describe('Component: OrderdetailsComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.orderdetails'));

  var OrderdetailsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    OrderdetailsComponent = $componentController('orderdetails', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
