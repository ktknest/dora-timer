'use strict';

angular.module('dora')
/**
 * @ngdoc filter
 * @module dora:time
 *
 * @description
 * タイマー表示の変換フィルター
 */
.filter('time', function() {
  return function(input) {
    var m = Math.floor(input / 60);
    var s = input % 60;
    if (s < 10) {
      s = '0' + s;
    }

    return m + ':' + s;
  };
});
