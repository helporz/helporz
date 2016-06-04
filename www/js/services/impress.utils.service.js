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
            id:1,
            text: '热情',
            className: 'impress-1'
          },
          {
            id:2,
            text: '高冷',
            className: 'impress-2'
          },
          {
            id:3,
            text: '可爱',
            className: 'impress-3'
          },
          {
            id:4,
            text: '有趣',
            className: 'impress-4'
          },
          {
            id:5,
            text: '耐心',
            className: 'impress-5'
          },
          {
            id:6,
            text: '迅速',
            className: 'impress-6'
          },
          {
            id:7,
            text: '细心',
            className: 'impress-7'
          },
          {
            id:8,
            text: '爽快',
            className: 'impress-8'
          },
          {
            id:9,
            text: '马虎',
            className: 'impress-9'
          },
          {
            id:10,
            text: '小气',
            className: 'impress-10'
          },
          {
            id:11,
            text: '拖沓',
            className: 'impress-11'
          },
          {
            id:12,
            text: '暴躁',
            className: 'impress-12'
          },
          {
            id:13,
            text: '江湖菜鸟',
            className: 'impress-13'
          }
        ]
      }

    }])
})()

