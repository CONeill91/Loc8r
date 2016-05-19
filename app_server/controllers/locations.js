/* GET 'home' page */
module.exports.homelist = function(req,res){
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader:{
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when you are out and about.",
    locations: [{
      name: 'Starcups',
      address: '125 High Street, Reading, N78QG',
      rating: 3,
      facilities: ['Hot Drinks', 'Food', 'Wifi'],
      distance: '100m'
    },{
      name: 'Hannah Cafe',
      address: '125 High Street, Dublin, N78QG',
      rating: 4,
      facilities: ['Hot Drinks', 'Food', 'Wifi'],
      distance: '200m'
    },{
      name: 'Nail Cafe',
      address: '125 High Street, London, N78QG',
      rating: 2,
      facilities: ['Hot Drinks', 'Food', 'Wifi'],
      distance: '100m'
    }]
  });
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req,res){
  res.render('location-info', {
    title: 'Starcups',
    pageHeader:{ title: 'Starcups'},
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when you are out and about.",

    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, N78QG',
      rating: 3,
      facilities: ['Hot Drinks', 'Food', 'Wifi'],
      coords: {lat: 51.455041, lng: -0.9690884},
      openingTimes:[{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      },{
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      },{
        days: 'Sunday',
        closed:true
      }],
      reviews: [{
        author: 'Simon Holmes',
        rating: 5,
        timestamp: '16 July 2013',
        reviewText: 'Great place to eat'
      },{
        author: 'Conor ONeill',
        rating: 1,
        timestamp: '13 May 2015',
        reviewText: 'Shite place to eat'
      }]
    }
  });
};

/* GET 'Add Review' page */
module.exports.addReview = function(req,res){
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: {title: 'Review Starcups'}
  });
};
