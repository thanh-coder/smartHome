var fakeDataModel = require('../model/fakeData.model');

exports.index = function(req, res) {
  fakeDataModel.find({}, function(err, docs) {
    res.render('smarthome', {chartsData: docs});
  });
}