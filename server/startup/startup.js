Meteor.startup(function () {
  Events.remove({});
  if(Events.find().count() === 0){
    var events = [
      {
        'name': 'Event1',
        'description': 'Dette er event 1'
      },
      {
        'name': 'Event2',
        'description': 'Dette er event 2'
      }
    ];

    for (var i = 0; i < events.length; i++) {
        Events.insert(events[i]);
    }
  }


  Meteor.users.remove({});
  if (Meteor.users.find().count() === 0) {
    var users = [
      {
        'username': 'Babs',
        'password':'123',
        'email':'baf@idi.ntnu.no',
        'profile': {
          'nameFirst': 'Babak',
          'nameLast': 'Farschian',
          'friends': [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          }
        }
      },
      {
        'username': 'theRandy',
        'password':'123',
        'email':'RandsterS@ntnu.no',
        'profile': {
          'nameFirst': 'Randy',
          'nameLast': 'Savage',
          'friends': [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          }
        }
      },
      {
        'username': 'perp',
        'password':'123',
        'email':'pepa@ntnu.no',
        'profile': {
          'nameFirst': 'Per',
          'nameLast': 'P�l',
          'friends': [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          }
        }
      }
    ];

    for (var i = 0; i < users.length; i++) {
      Accounts.createUser(users[i]);
    }
  }

  if (NewsPosts.find().count() < 15) {
    NewsPosts.remove({});
    for (i=0; i<15; i++) {
      NewsPosts.insert({
        title: 'Fredrik ('+i+') har laget en ny hendelse: "Tur i parken"',
        description: 'Håper alle blir med!',
        date: new Date(),
        owner: Meteor.users.findOne()._id,
        "public": true
      });
    }
  }

  Meteor.publish("newsfeedPosts", function (options) {
    //if (this.userId) {
      selector = {
        $or: [
          { $and: [
              { owner: {$exists: true}},
              { $or: [
                { owner: this.userId}
                //{owner: { $in: Meteor.user().profile.friends}},
              ]}
          ]},
          { $and: [
              { "public": true},
              { "public": {$exists: true}}
          ]},
          { "public": {$exists: true}}
        ]
      };

      Counts.publish(this, 'numberOfNewsfeedPosts',
        NewsPosts.find(selector), {noReady: true});

      return NewsPosts.find(selector, options);

    //} else {
     // return null;
   //}
  });

  Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {'profile': 1, 'username': 1});
  });
  // "By default, the current user's username, emails and profile are
  // published to the client." http://docs.meteor.com/#/full/meteor_users
});
