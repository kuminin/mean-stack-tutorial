var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
'$scope',
'posts',
($scope, posts) => {
    $scope.test = 'Hello World!';

    $scope.posts = posts.posts;

    $scope.addPost = () => {
        if (!$scope.title || $scope.title === '') { return; }
        posts.create({
            title: $scope.title,
            link: $scope.link
        });
        // $scope.posts.push({
        //     title: $scope.title,
        //     link: $scope.link,
        //     upvotes: 0,
        //     comments: [
        //         {author: 'Joe', body: 'Cool post!', upvotes: 0},
        //         {author: 'Bob', body: 'Cool post! But Everything is Wrong!', upvotes: 0},
        //     ]
        // });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.incrementUpvotes = (post) => {
        posts.upvote(post);
    };
}]);

app.factory('posts', ['$http', function($http){
    var o = {
        posts: []
    };
    o.getAll = () => {
        return $http.get('/posts').success((data) => {
            angular.copy(data, o.posts);
        });
    };
    o.create = (post) => {
        return $http.post('/posts', post).success((data) => {
            o.posts.push(data);
        });
    };
    o.upvote = (post) => {
        return $http.put('/posts/' + post._id + '/upvote').success((data) => {
            post.upvotes += 1;
        });
    };
    o.get = (id) => {
        return $http.get('/posts/' + id).then((res) => {
            return res.data;
        });
    };
    o.addComment = (id, comment) => {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    o.upvoteComment = (post, comment) => {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success((data) => {
            comment.upvotes += 1;
        });
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
        controller: 'MainCtrl',
        resolve: {
            postPromise: ['posts', (posts) => {
                return posts.getAll();
            }]
        }
    });

    $stateProvider.state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
            post: ['$stateParams', 'posts', ($stateParams, posts) => {
                return posts.get($stateParams.id);
            }]
        }
    });

    $urlRouterProvider.otherwise('home');
}]);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
($scope, posts, post) => {
    $scope.post = post;

    $scope.incrementUpvotes = (comment) => {
        posts.upvoteComment(post, comment);
    };
    $scope.addComment = () => {
        if($scope.body === '') { return; }
        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user',
        }).success((comment) => {
            $scope.post.comments.push(comment);
        });
        $scope.body = '';
    };
}]);
