/**
 * Created by Midstream on 16/5/18.
 */

(function () {
  'use strict'

  angular.module('impress.utils.service', [])

    .factory('impressUtils', [function () {

      return {
        impressUI: impressUI
      }

      function impressUI() {
        return [
          {
            text: '热情',
            className: 'impress-1'
          },
          {
            text: '高冷',
            className: 'impress-2'
          },
          {
            text: '可爱',
            className: 'impress-3'
          },
          {
            text: '有趣',
            className: 'impress-4'
          },
          {
            text: '耐心',
            className: 'impress-5'
          },
          {
            text: '迅速',
            className: 'impress-6'
          },
          {
            text: '细心',
            className: 'impress-7'
          },
          {
            text: '爽快',
            className: 'impress-8'
          },
          {
            text: '马虎',
            className: 'impress-9'
          },
          {
            text: '小气',
            className: 'impress-10'
          },
          {
            text: '拖沓',
            className: 'impress-11'
          },
          {
            text: '暴躁',
            className: 'impress-12'
          }
        ]
      }

    }])
})()

