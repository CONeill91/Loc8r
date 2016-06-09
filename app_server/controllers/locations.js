var request = require('request');
var apiOptions = {
  server: "http://localhost:5000"
};
// if(process.env.NODE_ENV === 'production'){
//   apiOptions.server = "https://getting-mean-loc8r.herokuapp.com"; // TODO Change URL
// }

var _isNumeric = function(n){
  return !isNaN(parseFloat(n) && isFinite(n));
};

var _formatDistance = function(distance){
  var numDistance, unit;
  if(distance && _isNumeric(distance)){
    if(distance > 1){
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    }else{
      numDistance = parseInt(distance * 1000, 10);
      unit = 'm';
    }
    return numDistance + unit;
  }else{
    return "?";
  }
};

var renderHomepage = function(req, res, responseBody){
    var message;
    if(!(responseBody instanceof Array)){
      message = "API lookup error";
      responseBody = [];
    }else{
      if(!responseBody.length){
        message = "No places found nearby";
      }
    }
    res.render('locations-list', {
      title: 'Loc8r - find a place to work with wifi',
      pageHeader:{
          title: 'Loc8r',
          strapline: 'Find places to work with wifi near you!'
      },
      sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when you are out and about.",
      locations: responseBody,
      message: message
    });
};

var renderDetailsPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader:{ title: locDetail.name},
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when you are out and about.",
    location: locDetail
  });
};

var _showError = function(req, res, statusCode){
	var title, content;
	if(statusCode === 404){
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page, sorry.";
	}	else{
		title = statusCode + ", something has gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong";
	}
	res.status(statusCode);
	res.render('generic-text',{
		title: title,
		content: content
	});
};

var renderReviewForm = function(req, res, locDetail){
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Loc8r',
		pageHeader: {title: 'Review ' + locDetail.name }
	});
};

var getLocationInfo = function(req, res, callback){
	var requestOptions, path;
  path = '/api/locations/' + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
  };
  request(requestOptions, function(err, response, body){
    var data = body;
		if(response.statusCode === 200){
    	data.coord = {
      	lng: body.coords[0],
      	lat: body.coords[1]
    	};
    	callback(req, res, data);
		}	else{
			_showError(req, res, response.statusCode);
		}
  });
};

/* GET 'home' page where qs == QUERY STRING */
module.exports.homelist = function(req,res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: -0.7992599,
      lat: 51.378091,
      maxDistance: 20
    }
  };
  request(requestOptions, function(err, response, body){
      var i, data;
      data = body;
      if(response.statusCode === 200 && data.length){
        for(i = 0; i < data.length; i++){
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomepage(req, res, data);
    }
  );
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req,res){
  getLocationInfo(req, res, function(req, res, responseData){
		renderDetailsPage(req, res, responseData);
	});
};

/* GET 'Add Review' page */
module.exports.addReview = function(req,res){
	getLocationInfo(req, res, function(req, res, responseData){
			renderReviewForm(req, res, responseData);
	});
};

module.exports.doAddReview = function(req, res){
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	path = "/api/locations/" + locationid + '/reviews';
	postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText:req.body.review
	};
	requestOptions = {
		url: apiOptions.server + path,
		method: "POST",
		json: postdata
	};
	request(requestOptions, function(err, response, body){
		if(response.statusCode === 201){
			res.redirect('/location/' + locationid);
		} else{
			_showError(req, res, response.statusCode);
		}
	});
};
