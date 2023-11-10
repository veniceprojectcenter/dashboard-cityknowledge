(function () {
  'use strict';

  dashboard.controller('NewWidgetController', ['$scope', '$firebase', '$sce', function ($scope, $firebase, $sce) {
    $scope.config = {
      identifier: '',
      title: 'Sample Widget',
      url: 'http://google.com',
      urlTitle: 'Google',
      helpDocUrl: 'https://docs.google.com/document/d/1xYIm4kcQbhzxl09Td9JE0Qa1dEdy46EOAvs2qn1zuWA/pub?embedded=true',
      width: 2,
      height: 1,
      widgetElements: [],
      log: false
    };

    $scope.widgetElementConfigs = [
      {
        name: 'Image',
        config: [
          { label: 'Twitter Handle @', type: 'text', value: '' }
        ],
        content: "<img src='http://www.emoticonswallpapers.com/avatar/cartoons/Daffy-Ducks-Head.gif' />"
      },
      {
        name: 'Map',
        config: [
          { label: 'Facebook ID', type: 'text', value: '' }
        ]
      },
      {
        name: 'Iframe',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      },
      {
        name: 'Link',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      },
      {
        name: 'Wordcloud',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      },
      {
        name: 'Twitter',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      },
      {
        name: 'Facebook',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      },
      {
        name: 'Label',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      },
      {
        name: 'Box',
        config: [
          { label: 'URL', type: 'text', value: '' },
          { label: 'Scrolling', type: 'checkbox', value: false }
        ]
      }
    ];

    $scope.addWidgetElement = function(selectedWidgetElementIndex) {
      $scope.config.widgetElements.push($scope.widgetElementConfigs[selectedWidgetElementIndex]);
    };

    $scope.saveWidget = function() {
      if ($scope.config.identifier && $scope.config.title && $scope.config.width && $scope.config.height) {
        // var widgetsRef = new Firebase(ckconfig.wdg_url);
        var widgetsRef = ckconfig.wdg_fb;
        widgetsRef.push({
          'height': $scope.config.height,
          'width': $scope.config.width,
          'id': $scope.config.identifier,
          'helpDocUrl': $scope.config.helpDocUrl,
          'url': $scope.config.url,
          'urlTitle': $scope.config.urlTitle,
          'title': $scope.config.title,
          'log': $scope.config.log,
          'contentHTML': ''
        });
        window.location = '/#/';
      } else {
        alert('You must fill in the identifier, title, width, and height of the widget.');
      }
    };

    $scope.showHelp = function() {
      $('.sample-widget-help').modal();
    };

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.widgetElementContent = function(widgetElementIndex) {
      return $scope.config.widgetElements[widgetElementIndex].content;
    };

    $scope.htmlSafe = function(html_code) {
      return $sce.trustAsHtml(html_code);
    }
  }]);
}());
