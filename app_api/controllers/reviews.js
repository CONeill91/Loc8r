var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var doAddReview = function(req, res, location){
  if(!location){
    sendJsonResponse(res, 404, {"message" : "locationid not found"});
  } else{
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location){
      var thisReview;
      if(err){
        sendJsonResponse(res, 400, err);
      } else{
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};

// Find correct parent doc, add new subdoc, save parent doc.
module.exports.reviewsCreate = function(req, res){
  var locationid = req.params.locationid;
  if(locationid){
    Loc.findById(locationid).select('reviews').exec(function(err,location){
      if(err){
        sendJsonResponse(res, 400, err);
      }else{
        doAddReview(req,res,location);
      }
    }
    );
  }else{
    sendJsonResponse(res, 404, {"message" : "Not found, locationid required"});
  }
};
module.exports.reviewsReadOne = function(req, res){
  if(req.params && req.params.locationid && req.params.reviewid){
    Loc.findById(req.params.locationid).select('name reviews').exec(function(err, location){
      var response, review;
      if(!location){
        sendJsonResponse(res, 404, {"message" : "locationid not found"});
        return;
      } else if(err){
          sendJsonResponse(res, 404, err);
          return;
      }
      if(location.reviews && locations.reviews.length > 0){
        review = location.reviews.id(req.params.reviewid);
        if(!review){
          sendJsonResponse(res, 404, {"message" : "reviewid not found"});
        } else{
          response = {
            location : {
              name : locaton.name,
              id : req.params.locationid
            },
            review: review
          };
          sendJsonResponse(res, 200, response);
          }
        }else{
          sendJsonResponse(res, 404, {"message" : "No reviews found"});
        }
      }
    );
  }else {
    sendJsonResponse(res, 404, {"message" : "Not found, locationid and reviewid both required"});
  }

};
module.exports.reviewsUpdateOne = function(req, res){sendJsonResponse(res, 200, {"status":"success"})};
module.exports.reviewsDeleteOne = function(req, res){sendJsonResponse(res, 200, {"status":"success"})};
