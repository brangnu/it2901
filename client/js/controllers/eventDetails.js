angular
.module('it2901')
.controller('eventDetailsCtrl', eventDetailsCtrl);

function eventDetailsCtrl($scope, $stateParams, $reactive) {  
    $reactive(this).attach($scope);


    this.subscribe('events');
    this.subscribe('users');


    $scope.eventId = $stateParams.eventId;
    $scope.count = 0;

    $scope.participants = Events.findOne({_id : $scope.eventId}).participants
    for (var i = 0; i < $scope.participants.length; i++) {
      if ($scope.participants[i].attending == true){
          $scope.count++;
      }
    };

    $scope.fireEditEventModal = function() {
      $('.ui.small.modal.editEvent').modal('show');
    }

    $('#addUsers').dropdown({
      allowAdditions: true
    });

    $('.ui.fluid.search.dropdown').dropdown({});

    $('#status').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 300,
      hide: 800
    }
  });
    $('.participants.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 200,
      hide: 200
    }
  });
    $('.participating.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 200,
      hide: 200
    }
  });

  
    this.subscribe('events');
    this.subscribe('users');

    this.helpers({
        events: () => {
           return Events.find({});
         },
         currentEvent: () => {
          return Events.findOne({_id: $stateParams.eventId});
        }, 
      });

    /*
    this.updateEvent = () => {

      Meteor.call("updateEvent", Meteor.user(), this.currentEvent );

    };
    */
  

      this.save = () => {


      Events.update({
      _id: this.currentEvent._id
    }, {
      $set: {
        name: this.currentEvent.name,
        description: this.currentEvent.description,
        date: this.currentEvent.date,
        location: this.currentEvent.location,
        //participants: this.currentEvent.participants,
        type: this.currentEvent.type,
        level: this.currentEvent.level,
        //exercises: 
         public: this.currentEvent.public,
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the event...');
      } else {
        console.log('Done!');
        $('.ui.small.modal.editEvent').modal('hide');
      }
    });
    }


};
