'use strict';

describe('Component: QuotationComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.quotation'));

  var QuotationComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    QuotationComponent = $componentController('quotation', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
