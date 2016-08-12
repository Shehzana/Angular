(function() {
    var dest, detail_prop_id, i;
    var propArray = new Array();
    var bannerImage = new Array();
    var prop_name;
    var prop_id;
    var prop_thumb_image;
    var prop_banner_image;
    var prop_detail_bannerimage_gallery = new Array();;
    var prop_cat_list;
    var prop_ref_id;
    var prop_address1, prop_address2, prop_town, prop_county, prop_location, prop_lat, prop_long;
    var PropertyDataPromise, PropertyCategoryPromise, CategoryType;
    var prop_thumb_image_final;
    var app = angular.module('app', ['ngRoute', 'slick']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'listingview.html',
                controller: 'Controller'
            }).when('/detail/:prop_ref_id', {
                templateUrl: 'detailview.html',
                controller: 'Controller'
            });
    });

    app.factory('GetAllData', ['$http', '$q', function($http, $q) {
        return {
            CategoryData: function() {
                var deferred = $q.defer();
                jQuery.getJSON('data/categorylist.json', function(data) {

                }).done(function(data, status) {
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


    app.controller('Controller', ['$scope', 'GetAllData', '$http', '$routeParams', '$window', '$q', function($scope, GetAllData, $http, $routeParams, $window, $q) {

        PropertyDataPromise = GetAllData.processingData();

        PropertyDataPromise.then(function(data) {
            $(data).find('Properties').find('Property').each(function() {
                prop_name = $(this).find('PROP_NAME').text();
                prop_id = $(this).find('PROP_REF').text();
                bannerImage = [];
                $(this).find('BANNER_IMAGE_PATHS').find('IMAGE').each(function() {
                    prop_banner_image = "http://www.britishland.com" + $(this).text();
                    bannerImage.push(prop_banner_image);
                });
                prop_thumb_image = $(this).find('THUMB_IMAGE_PATH').find('IMAGE').text();
                prop_cat_list = $(this).find('CATEGORY_LIST').text();
                prop_ref_id = $(this).find('PROP_REF').text();
                prop_thumb_image_final = "http://www.britishland.com" + prop_thumb_image;
                prop_address1 = $(this).find('ADDR_L1').text();
                prop_address2 = $(this).find('ADDR_L2').text();
                prop_town = $(this).find('TOWN').text();
                prop_county = $(this).find('COUNTY').text();
                prop_location = $(this).find('LOCATION').text();
                prop_lat = $(this).find('LATITUDE').text();
                prop_long = $(this).find('LONGITUDE').text();

                if (prop_thumb_image != "") {
                    propArray.push({
                        'prop_name': prop_name,
                        'prop_id': prop_id,
                        'prop_banner_image': bannerImage,
                        'prop_thumb_image': prop_thumb_image_final,
                        'prop_cat_list': prop_cat_list,
                        'prop_ref_id': prop_ref_id,
                        'prop_address1': prop_address1,
                        'prop_address2': prop_address2,
                        'prop_town': prop_town,
                        'prop_county': prop_county,
                        'prop_location': prop_location,
                        'prop_lat': prop_lat,
                        'prop_long': prop_long

                    });
                }

            });

            $scope.propArray = propArray;
            $scope.quantity = 15;
            dest = window.location.href;
            detail_prop_id = dest.substr(dest.lastIndexOf('/') + 1);

            for (i = 0; i < $scope.propArray.length; i++) {

                if (detail_prop_id === propArray[i].prop_ref_id) {
                    prop_detail_bannerimage_gallery = [];
                    $scope.prop_detail_name = propArray[i].prop_name;
                    $scope.prop_detail_bannerimage = propArray[i].prop_banner_image[0];
                    $scope.prop_detail_address1 = propArray[i].prop_address1;
                    $scope.prop_detail_address2 = propArray[i].prop_address2;
                    $scope.prop_detail_town = propArray[i].prop_town;
                    $scope.prop_detail_county = propArray[i].prop_county;
                    $scope.prop_detail_location = propArray[i].prop_location;
                    prop_detail_bannerimage_gallery = propArray[i].prop_banner_image;
                    $scope.prop_detail_bannerimage_gallery = prop_detail_bannerimage_gallery;


                }
            }

        });

        $scope.images = [
            "http://vasyabigi.github.io/angular-slick/images/lazyfonz1.png",
            "http://vasyabigi.github.io/angular-slick/images/lazyfonz2.png",
            "http://vasyabigi.github.io/angular-slick/images/lazyfonz3.png",
        ];
		
			
        /*--- Loadmore function starts ---*/
        $scope.propertyLoadMore = function() {
           $scope.quantity = $scope.quantity + 15;
         }
        /*--- Loadmore function ends ---*/
		
		/*--- Goback function starts ---*/
		$scope.ReturntoPage = function(){
			$window.history.back();
		}
		/*--- Goback function ends ---*/

        /*---- Property filter list starts ---*/
        PropertyCategoryPromise = GetAllData.CategoryData();
        PropertyCategoryPromise.then(function(data) {
            CategoryType = data;
            $scope.categorylist = CategoryType;
        });
        /*---- Property filter list ends ---*/

        /*---- Property filter as per category starts ---*/
        $scope.currentcat = "All";
        $scope.propertyCategoryWise = function(c) {
                if (c.title == "All") {
                    $scope.searchcat = {
                        "prop_cat_list": ''
                    };
                } else {
                    $scope.searchcat = {
                        "prop_cat_list": c.title
                    };
                }
                $scope.currentcat = c.title;
                $scope.quantity = 15;
            }
            /*---- Property filter as per category starts ---*/

    }]);
})();