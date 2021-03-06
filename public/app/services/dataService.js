(function () {
  'use strict';

  angular.module('like')
  .factory('dataService', ['$http', function ($http) {
    var getLogedInUserData = function (userId) {
      var url = '/api/profile/' + userId;
      return $http({
        method: 'GET',
        url: url
      })
      .then(function (data) {
        return data;
      });
    };

    var getUserData = function (userId) {
      var url = '/api/profile/' + userId;
      return $http({
        method: 'GET',
        url: url
      })
      .then(function (data) {
        return data;
      }).catch(function () {
        return false;
      });
    };

    var getAllUsers = function (region) {
      return $http({
        method: 'GET',
        url: '/api/browse'
      })
      .then(function (data) {
        return data;
      });
    };

    return {
      getLogedInUserData: getLogedInUserData,
      getUserData: getUserData,
      getAllUsers: getAllUsers
    };
  }]);
})();
