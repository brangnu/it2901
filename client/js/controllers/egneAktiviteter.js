angular
.module('it2901')
.controller('egneAktiviteterCtrl', egneAktiviteterCtrl);

function egneAktiviteterCtrl($scope, $reactive) {
    $reactive(this).attach($scope);

    userff: () => {
      return Meteor.user().profile.events;
    }

    $scope.acceptEvent = function(eventId,bool){
      var evs = Meteor.user().profile.events
      if (bool == true){
        for (var i = 0; i < evs.length; i++) {
              if (evs[i].eventId == eventId){
                swal("Accepted", "You are going to this event!", "success")
                Meteor.call('acceptEvent', eventId)
              }
            };
      } else if (bool == false) {
        Meteor.call('denyEvent', eventId, function(err, result){
          if (!err){
            swal("Deleted", "You have declined the invitation.", "success");
          }
        })
      }

    }

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
        user: () => {
          return Meteor.user()
        },

        events: () => {
          return Meteor.user().profile.events;
       },

       userEvents: () => {
         return Meteor.user().profile.events;
       }
   });

    this.removeEvent = (eventId) => {
        theEvent = Events.findOne({_id : eventId})
        if (Meteor.userId() == theEvent.owner){
          Meteor.call('deleteEvent', eventId, function(err, result){
            if (!err){
              swal("Deleted", "The event is now deleted", "success")
            }else{
              swal("Failed!", "Failed to delete the event", "error")
            }
          })
        }else{
          swal("Failed!", "You cannot delete this since you are not the owner of the event.", "error")
        }
      }
};
