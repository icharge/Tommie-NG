	// create the module and name it myApp
	var myApp = angular.module('myApp', ['ngRoute', 'chieffancypants.loadingBar', 'ngAnimate']);

	// configure our routes
	myApp.config(function($httpProvider, $routeProvider, $locationProvider) {
		$httpProvider.interceptors.push('httpRequestInterceptor');
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'view/home.html',
				controller  : 'homeController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'view/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'view/contact.html',
				controller  : 'contactController'
			})

			// test
			.when('/register', {
				templateUrl : 'view/register.html',
				controller  : 'registerController'
			})

			.when('/404', {
				templateUrl : 'view/404.html',
				controller: '404Ctrl',
				/*resolve: {
					project: function ($route) {
							// return a dummy project, with only id populated
							return {id: $route.current.params.projectId};
					}
				}*/
			})
			.otherwise({ redirectTo: '/' });
			//$locationProvider.html5Mode(true);
	}).config(function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
	});

	myApp.factory('Page', function(){
		var title = 'default';
		return {
			title: function() { return title; },
			setTitle: function(newTitle) { title = newTitle; }
		};
	}).factory('httpRequestInterceptor', function ($q, $location) {
		return {
			'responseError': function(rejection) {
				// do something on error
				if(rejection.status === 404){
					$location.path('/404');
					return $q.reject(rejection);
				}
			}
		};
	});

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope, Page, $timeout, cfpLoadingBar) {
		$scope.start = function() {
			$scope.fakeIntro = true;
			cfpLoadingBar.start();
		};

		$scope.complete = function () {
			cfpLoadingBar.complete();
			$scope.fakeIntro = false;
		}

		
		$scope.start();
		$scope.Page = Page;
		Page.setTitle('Default');

		$scope.$on('$routeChangeStart', function(next, current) { 
			$scope.start();
		});
		$scope.$on('$routeChangeSuccess', function () {

		});
		$scope.$on('$viewContentLoaded', function() {
			$scope.complete();
		});

		// fake the initial load so first time users can see it right away:
		/*$scope.start();
		$scope.fakeIntro = true;
		$timeout(function() {
			$scope.complete();
			$scope.fakeIntro = false;
		}, 250);*/
	});

	myApp.controller('aboutController', function($scope, Page) {
		$scope.message = 'Look! I am an about page.';
		Page.setTitle('About');
	});

	myApp.controller('homeController', function($scope, Page) {
		// create a message to display in our view
		$scope.message = 'Hello World สวัสดีชาวโลก';
		$scope.Page = Page;
		Page.setTitle('Home');
	});

	myApp.controller('404Ctrl', function($scope, Page) {
		Page.setTitle('Not Found');
	});

	myApp.controller('contactController', function($scope, Page, $location, $http) {
		Page.setTitle('Contact');
		$scope.message = 'Contact us! JK. This is just a demo.';
		$scope.go = function ( path ) {
			$location.path( path );
		};
		$scope.getData = function() {
			$http.get('app/database/select.php?rand=' + Math.floor(Math.random() * 100)).success(function(data){
				$scope.itemList = data;
			});
		};
	});

	myApp.controller('registerController', function($scope, Page, $http) {
		$scope.errors = [];
		$scope.msgs = [];

		$scope.SignUp = function() {

			$scope.errors.splice(0, $scope.errors.length); // remove all error messages
			$scope.msgs.splice(0, $scope.msgs.length);

			$http.post('app/database/insert.php', {'uid': $scope.userid, 'uname': $scope.username, 'pwd': $scope.userpassword, 'email': $scope.useremail}
			).success(function(data, status, headers, config) {
				if (data.msg != '')
				{
					$scope.msgs.push(data.msg);
				}
				else
				{
					$scope.errors.push(data.error);
				}
			}).error(function(data, status) { // called asynchronously if an error occurs
// or server returns response with an error status.
				$scope.errors.push(status);
			});
		}
	});