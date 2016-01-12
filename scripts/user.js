var app = angular.module("myUserApp", ['ui.grid', 'ui.grid.pagination']);

app.controller("myUserCtrl", function($scope, $http, uiGridConstants) {
    $scope.user = {};
    $scope.showForm = false;
    $scope.showList = true;
    $scope.userList = [];
    $scope.replaceIndex = null;
    $scope.olderUserData = {};

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15, 25],
        paginationPageSize: 5,
        enableFiltering: true,
        data: 'userList',
        enableSorting: true,
        columnDefs: [{
            field: 'userName',
            displayName: 'User Name'
        }, {
            field: 'firstName',
            displayName: 'First Name'
        }, {
            field: 'lastName',
            displayName: 'Last Name'
        }, {
            field: 'email',
            displayName: 'Email'
        }, {
            field: 'registered',
            type: 'date',
            cellFilter: 'date:"medium"',
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            },
            displayName: 'Registered Date'
        }, {
            name: 'operations',
            displayName: 'Operations',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="grid.appScope.editView(true, row.entity, rowRenderIndex)" >Edit</button>&nbsp;<button id="deleteBtn" type="button" class="btn-small" ng-click="grid.appScope.deleteRow(row)">Delete</button>'
        }]
    };

    $scope.toggleView = function(showForm) {
        $scope.showForm = showForm;
        $scope.showList = !showForm;
        $scope.reset();
    };
    $scope.editView = function(showForm, userData, index) {
        $scope.showForm = showForm;
        $scope.showList = !showForm;
        $scope.user = angular.copy(userData);
        $scope.olderUserData = angular.copy(userData);
        $scope.hashKey = userData.$$hashKey;
        $scope.replaceIndex = index;
    };
    $scope.deleteRow = function(row) {
        if (confirm("Are you sure you want delete the user " + row.entity.userName + " ?") == true) {
            var index = $scope.userList.indexOf(row.entity);
            $scope.userList.splice(index, 1);
        }
    };
    $scope.saveUser = function(user) {
        if ($scope.userUnique(user)) {
            if ($scope.hashKey != null) {
                $scope.userList.splice($scope.replaceIndex, 1, user);
                $scope.hashKey = null;
                $scope.replaceIndex = null;
            } else {
                user.registered = new Date();
                $scope.userList.push(user);
            }
            $scope.toggleView(false)
        }
    };
    $scope.userUnique = function(user) {
        var userList = $scope.userList;
        if (userList.length > 0) {
            for (i in userList) {
                if ($scope.hashKey != userList[i].$$hashKey) {
                    if (angular.equals(userList[i].userName, user.userName)) {
                        alert('User Name already exist!');
                        return false;
                    }
                    if (angular.equals(userList[i].email, user.email)) {
                        alert("Email already exist!");
                        return false;
                    }
                } else {
                    // get the actual index by matching hash key
                    $scope.replaceIndex = i;
                }
            }
        }
        return true;
    };
    $scope.reset = function() {
        $scope.user = {};
        $scope.olderUserData = {};
        /*original state and the state of userForm is reset to pristine by calling the $setPristine function on it.*/
        $scope.userForm.$setPristine();
    };
    $scope.isUserChanged = function(user) {
        return !angular.equals(user, $scope.olderUserData);
    };
    $scope.importDummyUsers = function() {
        /*$http.get('scripts/data.json').success(function(data) {
            $scope.userList = data;
        });*/
        /*Dummy data impored from data.js*/
        if (confirm("Warning! By doing this action, Your all changes are lost. Still want to add dummy data?") == true) {
            $scope.userList = angular.copy(userdummydata);
            $scope.toggleView(false);
            alert((userdummydata.length) + " dummy users added");
        }
    }
});
