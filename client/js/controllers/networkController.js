angular
    .module('it2901')
    .controller('networkController', networkController);

function networkController($scope, $reactive) {
  $reactive(this).attach($scope);


  this.helpers({
    user: () => {
      return Meteor.user();
    },

    contacts: () => {
      return Meteor.users.find({}, {'username':1});
    },

    friends: () => {
      user = Meteor.user();
      return user.profile.friends;
    }
  });

  var friendList = []


  function isFriend(userId){
    friendObject = Meteor.user().profile.friends
    for (var i = 0; i < friendObject.length; i++) {
      friendList.push(friendObject[i]._id)
    };

    if (friendList.indexOf(userId) < 0){
      return false;
    }else{
      return true;
    }
  }

  friendRequestList = []
  function isRequest(userId){
    friendRequestObjects = Meteor.user().profile.notifications.friendRequests
    for (var i = 0; i < friendRequestObjects.length; i++) {
      friendRequestList.push(friendRequestObjects[i._id])
    };

    if (friendRequestList.indexOf(userId) < 0){
      return false;
    }else{
      return true;
    }
  }

  $scope.inviteFriend = function(userId){
    theUser = Meteor.users.findOne({'_id' : userId})
    if ( userId === Meteor.userId() ){
      sweetAlert("Oops...", "You cannot be your own friend.", "error");
    } else if ( isFriend(userId) == true){
      sweetAlert("Oops...", "You are already friend with this person!", "error");
    } else if ( isRequest(userId) == true ){
      sweetAlert("Oops...", "You have already sent friend invitation to this person!", "error");
    } else if ( isFriend(userId) == false ){
        reqList = []
        allRequests = Meteor.user().profile.notifications.friendRequests
        if (allRequests){
          for (var i = 0; i < allRequests.length; i++) {
            reqList.push(allRequests[i]._id)
          };
        }
        if (reqList.indexOf(userId) < 0 ){
          Meteor.call('inviteFriend', theUser)
          swal("Invitation sent", "An invitation has been sent", "success")
          friendRequestList.push(userId)
        }else{
          swal("Oops", "You've already got an invitation from this freind. You just need to approve it!", "error")
        }

    }else {
      sweetAlert("Oops...", "You are already friend with this person!", "error");
    }
  }


}
