angular.module("it2901").directive("newsfeed", function () {
	return {
		restrict: "E",
		templateUrl: "client/js/components/newsfeed.html",
		controllerAs: "newsfeed",
		controller: newsfeedCtrl
	}
});

function newsfeedCtrl($scope, $reactive) {
	$reactive(this).attach($scope);

	this.postsPerPage = 6;
	this.elementNumber = 0;

	this.showPostCreator = false;

	this.helpers({
		posts: () => {
			return NewsPosts.find({}).map((post) => {
				post.owner = Meteor.users.findOne({_id: post.ownerID });

				switch (post.type) {
					case "friendAdded":
						post.newFriend = Meteor.users.findOne({_id: post.newFriendID });
						break;
					case "userPost":
						post.showDesc = false;
						break;
					case "newEvent":
						post.event = Events.findOne({_id: post.eventID });
						break;
					case "joinedEvent":
						post.event = Events.findOne({_id: post.eventID });
						break;
					default:
						throw TypeError("[Newsfeed] Found post with invalid post type: \""
							+ post.type + "\"");
						break;
				}
				return post;
			});
		},
		postsCount: () => {
          return Counts.get('numberOfNewsfeedPosts');
        }
	});

	this.subscribe("events");

	this.subscribe("newsfeedPosts", () => {
		return [{
			limit: parseInt(this.postsPerPage),
			skip: parseInt(this.getReactively('elementNumber')),
			sort: { date: 1}
		}]
	});

	this.changePage = (pageDiff) => {
		console.log("[Newsfeed] changed element from "+this.elementNumber+" to "+(this.elementNumber + this.postsPerPage*pageDiff)+ " ("+this.postsPerPage+", "+pageDiff+")");
		
		this.elementNumber = Math.max(0, Math.min(this.postsCount-this.postsPerPage, 
			this.elementNumber + this.postsPerPage*pageDiff));
	};

    this.resetPost = () => {
    	this.newPost = {
			title: "",
			description: ""
    	};
    }
    this.resetPost();
	
	this.addNewPost = () => {
		Meteor.call("createNewsPost", Meteor.userId(), { "userPost":
				this.newPost});
		this.showPostCreator = false;
		this.resetPost();
	};
}