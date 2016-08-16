var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
'$scope',
'posts',
($scope, posts) => {
    $scope.test = 'Hello World!';

    $scope.posts = posts.posts;

    $scope.addPost = () => {
        if (!$scope.title || $scope.title === '') { return; }
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0,
            comments: [
                {author: 'Joe', body: 'Cool post!', upvotes: 0},
                {author: 'Bob', body: 'Cool post! But Everything is Wrong!', upvotes: 0},
            ]
        });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.incrementUpvotes = (post) => {
        post.upvotes += 1;
    };
}]);

app.factory('posts', [function(){
    var o = {
        posts: []
    };
    return o;
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
    });

    $stateProvider.state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
    });

    $urlRouterProvider.otherwise('home');
}]);

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
($scope, $stateParams, posts) => {
    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = () => {
        if($scope.body === '') { return; }
        $scope.post.comments.push({
            body: $scope.body,
            author: 'user',
            upvotes: 0
        });
        $scope.body = '';
    };
}]);