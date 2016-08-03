'use strict';

angular.module('dora')
/**
 * @ngdoc component
 * @module dora:doraError
 *
 * @params {string} errorMessage
 *
 * @description
 * エラー表示
 */
.component('doraError', {
  template : `
<div class="error">
  <i class="fa fa-times-circle error__icon"></i>
  <p class="error__text" ng-bind="$ctrl.errorMessage"></p>
</div>
  `,
  bindings : {
    'errorMessage' : '<'
  }
})
