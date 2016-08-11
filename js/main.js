(function() {

    var propArray = new Array();
    var bannerImage = new Array();
    var prop_name;
    var prop_id;
    var prop_thumb_image;
    var prop_banner_image;
	var prop_cat_list;
    var PropertyDataPromise,PropertyCategoryPromise,CategoryType;
    var prop_thumb_image_final;
    var app = angular.module('app', []);
	
    app.factory('GetAllData', ['$http', '$q', function($http, $q) {
        return {
			CategoryData: function() {
				var deferred = $q.defer();
				jQuery.ajax({
                    method: 'GET',
                    url: 'data/categorylist.json',
                    dataType: "json"
                }).success(function(data, status) {
                    deferred.resolve(data);
                })
                return deferred.promise;
			 },
			
            processingData: function() {
                var deferred = $q.defer();
                jQuery.ajax({
                    method: 'GET',
                    url: 'data/propertydata.xml',
                    dataType: "xml"
                }).success(function(data, status) {
                    deferred.resolve(data);
                })
                return deferred.promise;
            }
        }
    }]);
    app.controller('Controller', ['$scope', 'GetAllData', '$http', '$window', '$q', function($scope, GetAllData, $http, $window, $q) {
        PropertyDataPromise = GetAllData.processingData();
		
        PropertyDataPromise.then(function(data) {
            $(data).find('Properties').find('Property').each(function() {
                prop_name = $(this).find('PROP_NAME').text();
                prop_id = $(this).find('PROP_REF').text();
                $(this).find('BANNER_IMAGE_PATHS').find('IMAGE').each(function() {
                    prop_banner_image = "http://www.britishland.com" + $(this).text();
                    bannerImage.push(prop_banner_image);
                });
                prop_thumb_image = $(this).find('THUMB_IMAGE_PATH').find('IMAGE').text();
				prop_cat_list = $(this).find('CATEGORY_LIST').text();
                prop_thumb_image_final = "http://www.britishland.com" + prop_thumb_image;
                if (prop_thumb_image != "") {
                    propArray.push({
                        'prop_name': prop_name,
                        'prop_id': prop_id,
                        'prop_banner_image': bannerImage,
                        'prop_thumb_image': prop_thumb_image_final,
						'prop_cat_list':prop_cat_list
                    });
                }

            });
            $scope.propArray = propArray;
            $scope.quantity = 15;
       });
	    
	   
            /*--- Loadmore function starts ---*/
            $scope.propertyLoadMore = function() {
            $scope.quantity = $scope.quantity + 15;
            }
			/*--- Loadmore function ends ---*/
			
			/*---- Property filter list starts ---*/
			PropertyCategoryPromise = GetAllData.CategoryData();
			PropertyCategoryPromise.then(function(data) {
		    CategoryType= data;
            $scope.categorylist = CategoryType;
            });
			/*---- Property filter list ends ---*/
			
			/*---- Property filter as per category starts ---*/
			$scope.currentcat = "All"
			$scope.propertyCategoryWise = function(c) {
           if ( c.title== "All") {
			   $scope.searchcat = {"prop_cat_list": ''};
			   }
		   else{
              $scope.searchcat = {"prop_cat_list": c.title};
		       }
			  $scope.currentcat =  c.title; 
			  $scope.quantity = 15;
            }
			/*---- Property filter as per category starts ---*/
			
			
    }]);
})();