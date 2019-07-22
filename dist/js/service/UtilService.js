'use strict';

angular.module('wma').factory('UtilService',
    ['$mdDialog', function ($mdDialog) {
        return {
            showAlert: showAlert
        };

        function showAlert(message, title) {
            var alertTitle = title || 'Error Occurred';
            var alert = $mdDialog.alert({
                title: alertTitle,
                textContent: message,
                ok: 'Close'
            });

            $mdDialog.show(alert);
        }
    }]
);
