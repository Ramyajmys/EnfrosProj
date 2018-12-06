/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/quotations', require('./api/quotation'));
  app.use('/api/ProductOutputAcDatas', require('./api/ProductOutputAcData'));
  app.use('/api/ProductInputDcDatas', require('./api/ProductInputDcData'));
  app.use('/api/ProductCableDatas', require('./api/ProductCableData'));
  app.use('/api/ProductBatteryDatas', require('./api/ProductBatteryData'));
  app.use('/api/ProductKitsDatas', require('./api/ProductKitsData'));
  app.use('/api/orderDetails', require('./api/orderDetail'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/Status', require('./api/Status'));
  app.use('/api/ProductKeyNotes', require('./api/ProductKeyNote'));
  app.use('/api/ProductSplFeatures', require('./api/ProductSplFeature'));
  app.use('/api/ProductBrochures', require('./api/ProductBrochure'));
  app.use('/api/ProductMechanicalDatas', require('./api/ProductMechanicalData'));
  app.use('/api/ProductElectricalDatas', require('./api/ProductElectricalData'));
  app.use('/api/HSNs', require('./api/HSN'));
  app.use('/api/ProductDetails', require('./api/ProductDetail'));
  app.use('/api/UserProfiles', require('./api/UserProfile'));
  app.use('/api/Roles', require('./api/Role'));
  app.use('/api/Citys', require('./api/City'));
  app.use('/api/States', require('./api/State'));
  app.use('/api/Countrys', require('./api/Country'));
  app.use('/api/ProductSubCategorys', require('./api/ProductSubCategory'));
  app.use('/api/ProductCategorys', require('./api/ProductCategory'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
