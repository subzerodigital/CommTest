/***************************************************
 * jQuery plug-in to enable Profile Browser web app
 *
 * dependency: jQuery , underscore
 * binding class: fn-starProfile
 * Author: Yinan Yang , subzerodigital@gmail.com
 ***************************************************/

(function (window, undefined) {

    "use strict";
    //cache jQuery
    var $ = window.jQuery;
    //options
    var defaults = {};
    //constructor
    var ProfileBrowser = function ($el, options) {
        //init memeber properties
        this.$el = $el;
        this.$nav = $el.find(".nav");
        this.$navBtns = null;
        this.$content = $el.find(".content");
        this.$navTemplate = null;
        this.$contentTemplate = null;
        this.$profiles = null;
        this.$profileLabels = null;
        //init plugin
        this.init();
    };

    ProfileBrowser.prototype = {
        init:function () {
            //get the templates ready to use
            this.$navTemplate = $("#navTemp");
            this.$contentTemplate = $("#contentTemp");
            //load data (ajax/js object)
            this.fetchData();
        },
        fetchData:function () {
            var self = this;
            //load data via ajax
            $.ajax({
                url:"data/data.json",
                dataType:"json",
                success:function (resp) {
                    //once ajax response succeed, render the page
                    self.renderHtml(resp);
                },
                error:function () {
                    //if ajax is failed, we have to load data from javascript
                    //chrome doesn't allow ajax calls to file system, so we have to get data from data.js
                    //this 'data' is a global var
                    var profiles = {};
                    profiles.data = window.data;
                    self.renderHtml(profiles);
                }
            }).done(function () {
                    //console.log("success")
                });
        },
        renderHtml:function (data) {
            var self = this;
            //render the navigation
            this.$nav.html(_.template(self.$navTemplate.html(), {items:data.data}));
            //render the page body
            this.$content.html(_.template(self.$contentTemplate.html(), {items:data.data}));
            //binding actions to buttons
            this.binding();
        },
        binding:function () {
            //bind click for desk top
            //cache DOMs
            var self = this;
            self.$navBtns = this.$nav.find("li");
            self.$profiles = self.$content.find(".profile");
            self.$profileLabels = self.$content.find(".profileLabel");

            //bind click for desktop
            self.$navBtns.click(function (evt) {
                evt.preventDefault();
                var index = $(this).index();

                if (!self.$profiles.eq(index).is(":visible")) {
                    self.updateIndex(index);
                    self.$profiles.hide();
                    self.$profiles.eq(index).fadeIn(200);
                }
            });
            //bind click for mobile
            self.$profileLabels.click(function (evt) {
                //find out the index of item
                evt.preventDefault();
                var index = $.inArray(this, self.$profileLabels);
                var $target = $(this).next(".profile");
                if (!$target.is(":visible")) {
                    self.updateIndex(index);
                    self.$profiles.slideUp(200);
                    $target.slideDown(200);
                }
            });

            //kick off the app by clicking on the first item
            this.$nav.find("li:first").trigger("click");
        },
        updateIndex:function (index) {
            this.$navBtns.removeClass("active").eq(index).addClass("active");
            this.$profileLabels.removeClass("active").eq(index).addClass("active");

        }
    };

    //register plug-in to jQuery and bind to to data for debugging
    $.fn.profileBrowser = function (options) {
        return this.each(function () {
            $(this).data("profileBrowser", new ProfileBrowser($(this), options));
        });
    };

})(window);


