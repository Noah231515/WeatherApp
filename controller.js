angular.module('weatherApp', []).controller('weatherCtrl',function($scope, $http) {
    $scope.apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    $scope.appID = apiKey;
    $scope.zipCode;
    $scope.data;
    $scope.msg;
    $scope.dataTable = document.getElementById('dataTable');
    $scope.cityName = document.getElementById('cityName');
    
    function getWeatherData(response){
        $scope.dataTable.style.display = 'table';
        $scope.cityName.style.display = 'block';
        dataList = response.data.list;
        $scope.data = {'city': response.data.city['name'] };

        for (dataIndex in dataList){
            dataPoint = response.data.list[dataIndex];
            dateOptions = {'day': 'numeric', weekday: 'long', month: 'long', hour: 'numeric', year: 'numeric'};

            $scope.data[dataIndex] = {
                'date': new Date(dataPoint['dt']*1000).toLocaleDateString('en-US', dateOptions),
                'temp': dataPoint.main['temp'] | 0, //Bitwise or to truncate the temperature
                'pressure': dataPoint.main['pressure']
            };
        }
    }

    function getErrorMessage(response){
        errorMsg = response['data']['message'];
        $scope.msg = errorMsg[0].toUpperCase() + errorMsg.slice(1).toLowerCase();
        $scope.data = '';
    }

    $scope.$watch('zipCode', function(newval, oldval) { //Watcher watches the zip code field
        
        if ($scope.zipCode && $scope.zipCode.toString().length == 5){
            $scope.msg = '';
            $http.get($scope.apiUrl, {'params':{'zip':$scope.zipCode, 'APPID':$scope.appID, 'units':'imperial'}}).then(getWeatherData, getErrorMessage);
        }
        else if ($scope.zipCode && $scope.zipCode.toString().length > 5){
            $scope.msg = 'Entered zip code is too long!';
            $scope.data = '';
        }
        else {
            $scope.dataTable.style.display = 'none';
            $scope.cityName.style.display = 'none';
            $scope.data = '';
            $scope.msg = '';
        }
    });
  }); 