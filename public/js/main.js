/*global require, requirejs */

'use strict';

requirejs.config({
  paths: {
    'angular': ['../lib/angularjs/angular'],
    'angular-route': ['../lib/angularjs/angular-route']
  },
  shim: {
    'angular': {
      exports : 'angular'
    },
    'angular-route': {
      deps: ['angular'],
      exports : 'angular'
    }
  }
});

require(['angular', './controllers', './directives', './filters', './services', 'angular-route'],
  function(angular, controllers) {

    // Declare app level module which depends on filters, and services

    angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute'])
      .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
        var photosources = [];


        // $http.get('https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=06210d82421e04059a9a3c344e9a3932&user_id=91611553@N05&page=1&per_page=200&format=json&nojsoncallback=1').success(function(data) {
        //     var img = data.photos.photo;
        //     for (var i = 1; i < img.length; i++) {
        //         photosources.push({
        //             src: 'https://farm' + img[i].farm + '.staticflickr.com/' + img[i].server + '/' + img[i].id + '_' + img[i].secret + '.jpg'
        //         });
            
        //     }
        // }).error(function(){
        //     console.log("flickr error");
        // });
    
        $http.get('http://graph.facebook.com/305442362898377/photos?fields=images&limit=999').success(function(data) {
            var img = data.data;
            for (var j=img.length-1; j >= 0; j--) {
                var json = {}
                for (var i=0; i < img[j].images.length; i++) {         
                    if ((img[j].images[i].width == 2048) || (img[j].images[i].height == 2048)) {
                        json['link'] = img[j].images[i].source;
                    }
                    if ((img[j].images[i].width == 320) || (img[j].images[i].height == 320)) {
                        json['src'] = img[j].images[i].source;
                    }
                    if (img[j].images[0].width > img[j].images[0].height) {
                        json['orient'] = 'landscape';
                    } else {
                        json['orient'] = 'portrait';
                    }
                }
                console.log(json);
                photosources.push(json);
            }
        }).error(function(){
            console.log("shoot")
        });
        $scope.photos = photosources;

        $scope._Index = 0;

        $scope.isActive = function(index) {
            return $scope._Index === index;
        };

        $scope.showPhoto = function(index) {
            $scope._Index = index;
        };

            


      }]);


    angular.bootstrap(document, ['myApp']);

});
