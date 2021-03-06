/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductDetails              ->  index
 * POST    /api/ProductDetails              ->  create
 * GET     /api/ProductDetails/:id          ->  show
 * PUT     /api/ProductDetails/:id          ->  upsert
 * PATCH   /api/ProductDetails/:id          ->  patch
 * DELETE  /api/ProductDetails/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { ProductDetail } from '../../sqldb';
import { ProductElectricalData } from '../../sqldb';
import { ProductMechanicalData } from '../../sqldb';
import { ProductSplFeature } from '../../sqldb';
import { ProductInputDcData } from '../../sqldb';
import { ProductOutputAcData } from '../../sqldb';
import { ProductKitsData } from '../../sqldb';
import { HSN } from '../../sqldb';
import { ProductCategory } from '../../sqldb';
import { ProductSubCategory } from '../../sqldb';

var base64 = require('file-base64');
var fs = require('fs');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of ProductDetails
export function index(req, res) {
  return ProductDetail.findAll({ include: [{ model: ProductCategory }, { model: ProductSubCategory }], order: [['_id', 'DESC']], attributes: { exclude: ['file'] } })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductDetail from the DB
export function show(req, res) {
  return ProductDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//Get Product Details for this category
export function getProductCategory(req, res) {
  return ProductDetail.findAll({
    where: {
      category_id: req.body.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Get Product Details for this category
export function getProductsubCategory(req, res) {
  return ProductDetail.findAll({
    where: {
      category_id: req.body.cid, sub_category_id: req.body.sid
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductDetail in the DB
export function create(req, res) {
  var brochure = req.body.brochurefiles;
  var buf = Buffer.from(brochure.base64, 'base64');
  var obj1 = req.body;
  var dObj = {};
  dObj['file'] = buf;
  dObj['filetype'] = brochure.filetype;
  dObj['filename'] = brochure.filename;

  var fObj = Object.assign(obj1, dObj);

  if (req.body.category_id == 2) {
    return ProductDetail.create(fObj).then(function (prod) {
      if (prod) {
        if (req.body.e_data.length != 0) {
          var eObj, eRes, sObj, sRes, mRes;
          for (var i = 0; i < req.body.e_data.length; i++) {
            eObj = req.body.e_data[i];
            eObj['product_detail_id'] = prod._id;
            eRes = ProductElectricalData.create(eObj);
          }
          for (var i = 0; i < req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }
          req.body.m_data.product_detail_id = prod._id;
          mRes = ProductMechanicalData.create(req.body.m_data);

          if (eRes && sRes && mRes) {
            return res.status(200).json({ message: "Product sucessfully added" })
          }
        }
      }
    })
      .catch(handleError(res));
  }

  if (req.body.category_id == 3) {
    return ProductDetail.create(fObj).then(function (prod) {
      if (prod) {
        if (req.body.i_data.length != 0) {
          var iObj, iRes, sObj, sRes, oObj, oRes;
          for (var i = 0; i < req.body.i_data.length; i++) {
            iObj = req.body.i_data[i];
            iObj['product_detail_id'] = prod._id;
            iRes = ProductInputDcData.create(iObj);
          }
          for (var i = 0; i < req.body.o_data.length; i++) {
            oObj = req.body.o_data[i];
            oObj['product_detail_id'] = prod._id;
            oRes = ProductOutputAcData.create(oObj);
          }
          for (var i = 0; i < req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }

          if (iRes && sRes && oRes) {
            return res.status(200).json({ message: "Product sucessfully added" });
          }
        }
      }
    })
      .catch(handleError(res));
  }

  if (req.body.category_id == 4) {
    return ProductDetail.create(fObj).then(function (prod) {
      if (prod) {
        if (req.body.k_data.length != 0) {
          var kObj, kRes, sObj, sRes;
          for (var i = 0; i < req.body.k_data.length; i++) {
            kObj = req.body.k_data[i];
            kObj['product_detail_id'] = prod._id;
            kRes = ProductKitsData.create(kObj);
          }
          for (var i = 0; i < req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }

          if (kRes && sRes) {
            return res.status(200).json({ message: "Product sucessfully added" });
          }
        }
      }
    })
      .catch(handleError(res));
  }

  if (req.body.category_id == 5) {
    return ProductDetail.create(fObj).then(function (prod) {
      if (prod) {
        if (req.body.features.length != 0) {
          var sObj, sRes;

          for (var i = 0; i < req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }

          if (sRes) {
            return res.status(200).json({ message: "Product sucessfully added" });
          }
        }
      }
    })
      .catch(handleError(res));
  }

}

export function getproductdetails(req, res) {
  var category_id = req.body.cid;
  var product_detail_id = req.body.pid;

  if (category_id == 2) {
    return ProductDetail.find({ where: { _id: product_detail_id } }).then(function (prod) {
      return ProductElectricalData.findAll({ where: { product_detail_id: product_detail_id } }).then(function (elist) {
        return ProductMechanicalData.findOne({ where: { product_detail_id: product_detail_id } }).then(function (mlist) {
          return ProductSplFeature.findAll({ where: { product_detail_id: product_detail_id } }).then(function (flist) {
            return res.status(200).json({ product: prod, elist: elist, mlist: mlist, flist: flist });
          })
            .catch(handleError(res));
        })
          .catch(handleError(res));
      })
        .catch(handleError(res));
    })
      .catch(handleError(res));
  }

  if (category_id == 3) {
    return ProductDetail.find({ where: { _id: product_detail_id } }).then(function (prod) {
      return ProductInputDcData.findAll({ where: { product_detail_id: product_detail_id } }).then(function (ilist) {
        return ProductOutputAcData.findAll({ where: { product_detail_id: product_detail_id } }).then(function (olist) {
          return ProductSplFeature.findAll({ where: { product_detail_id: product_detail_id } }).then(function (flist) {
            return res.status(200).json({ product: prod, ilist: ilist, olist: olist, flist: flist });
          })
            .catch(handleError(res));
        })
          .catch(handleError(res));
      })
        .catch(handleError(res));
    })
      .catch(handleError(res));
  }

  if (category_id == 4) {
    return ProductDetail.find({ where: { _id: product_detail_id } }).then(function (prod) {
      return ProductKitsData.findAll({ where: { product_detail_id: product_detail_id } }).then(function (klist) {
        return ProductSplFeature.findAll({ where: { product_detail_id: product_detail_id } }).then(function (flist) {
          return res.status(200).json({ product: prod, klist: klist, flist: flist });
        })
          .catch(handleError(res));
      })
        .catch(handleError(res));
    })
      .catch(handleError(res));
  }

  if (category_id == 5) {
    return ProductDetail.find({ where: { _id: product_detail_id } }).then(function (prod) {
      return ProductSplFeature.findAll({ where: { product_detail_id: product_detail_id } }).then(function (flist) {
        return res.status(200).json({ product: prod, flist: flist });
      })
        .catch(handleError(res));
    })
      .catch(handleError(res));
  }
}

// Upserts the given ProductDetail in the DB at the specified ID
export function upsert(req, res) {
  var brochure = req.body.brochurefiles;
  var prod = req.body;
  if(brochure != null) {
    var buf = Buffer.from(brochure.base64, 'base64');
    prod['file'] = buf;
    prod['filetype'] = brochure.filetype;
    prod['filename'] = brochure.filename;
  }

  return ProductDetail.update(prod, {
    where: {
      _id: req.body._id
    }
  })
    .then(function () {
      return res.status(200).json({ message: 'Successfully Updated' })
    })
    .catch(handleError(res));

  // if (brochure == undefined) {
  //   return ProductDetail.update(req.body, {
  //     where: {
  //       _id: req.body._id
  //     }
  //   })
  //     .then(function () {
  //       return res.status(200).json({ message: 'Successfully Updated' })
  //     })
  //     .catch(handleError(res));
  // } else {
  //   var mode = process.env.NODE_ENV;
  //   var fPath;
  //   if (mode == 'development') {
  //     fPath = 'client/';
  //   } else if (mode == 'production') {
  //     fPath = 'dist/client/';
  //   }
  //   fPath = fPath + req.body.brochure;
  //   fs.unlinkSync(fPath);
  //   var base64String = brochure.base64;
  //   var filepath = './assets/brochure/' + prod._id + brochure.filename;
  //   var path = './client/assets/brochure/' + prod._id + brochure.filename;
  //   base64.decode(base64String, path, function (err, output) {
  //     prod.brochure = filepath;
  //     ProductDetail.update(prod, { where: { _id: prod._id } }).then(function () {
  //       return res.status(200).json({ message: "Product sucessfully Updated" })
  //     })
  //       .catch(handleError(res));
  //   });
  // }
}

// Updates an existing ProductDetail in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductDetail from the DB
export function destroy(req, res) {
  // return ProductDetail.find({
  //   where: {
  //     _id: req.params.id
  //   }
  // })
  //   .then(handleEntityNotFound(res))
  //   .then(removeEntity(res))
  //   .catch(handleError(res));
  var id = req.params.id;
  return ProductDetail.find({ where: { _id: id } }).then(function (product) {
    if (product.brochure != null) {
      var mode = process.env.NODE_ENV;
      var fPath;
      if (mode == 'development') {
        fPath = 'client/';
      } else if (mode == 'production') {
        fPath = 'dist/client/';
      }
      fPath = fPath + product.brochure;
      if (fs.existsSync(fPath)) {
        fs.unlinkSync(fPath);
      }
    }
    if (product.category_id == 2) {
      var eres = ProductElectricalData.destroy({ where: { product_detail_id: id } });
      var mres = ProductMechanicalData.destroy({ where: { product_detail_id: id } });
      var fres = ProductSplFeature.destroy({ where: { product_detail_id: id } });
      if (eres && mres && fres) {
        return ProductDetail.destroy({ where: { _id: id } }).then(function (deleted) {
          return res.status(204).json({ message: 'Successfully Deleted' })
        })
      }
    }
    if (product.category_id == 3) {
      var eres = ProductInputDcData.destroy({ where: { product_detail_id: id } });
      var mres = ProductOutputAcData.destroy({ where: { product_detail_id: id } });
      var fres = ProductSplFeature.destroy({ where: { product_detail_id: id } });
      if (eres && mres && fres) {
        return ProductDetail.destroy({ where: { _id: id } }).then(function (deleted) {
          return res.status(204).json({ message: 'Successfully Deleted' })
        })
      }
    }
    if (product.category_id == 4) {
      var eres = ProductKitsData.destroy({ where: { product_detail_id: id } });
      var fres = ProductSplFeature.destroy({ where: { product_detail_id: id } });
      if (eres && fres) {
        return ProductDetail.destroy({ where: { _id: id } }).then(function (deleted) {
          return res.status(204).json({ message: 'Successfully Deleted' })
        })
      }
    }
    if (product.category_id == 5) {
      var fres = ProductSplFeature.destroy({ where: { product_detail_id: id } });
      if (fres) {
        return ProductDetail.destroy({ where: { _id: id } }).then(function (deleted) {
          return res.status(204).json({ message: 'Successfully Deleted' })
        })
      }
    }
  })
    .then(handleEntityNotFound(res))
    .catch(handleError(res));
}
