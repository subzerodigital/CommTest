/***************************************************
 * jQuery plug-in to enable starProfile web app 
 * 
 * dependency: jQuery , underscore
 * binding class: fn-starProfile
 * Author: Yinan Yang
 ***************************************************/

(function(window,undefined){
	
	"use strict";
	//cache jQuery 
	var $ = window.jQuery;
	//options
	var defaults = {};
	//constructor
	var ProfileBrowser = function($el,options){
		//init properties 
		this.$el = $el;	
		this.$nav = $el.find(".nav");
		this.$content = $el.find(".content");
		this.$navTemplate = null;
		this.$contentTemplate = null;
		//init plugin
		this.init();
	};
	
	ProfileBrowser.prototype = {
		init:function(){
			this.$navTemplate = $("#navTemp");
			this.$contentTemplate = $("#contentTemp");
			this.fetchData();
		},
		fetchData:function(){
			var self = this;
			//load data via ajax
			$.ajax({
				url: "data/data.json",
				dataType:"json",
				success:function(resp){
					//once ajax response succeed, render the page 
					self.renderHtml(resp);
				},
				error:function(){
					//if ajax is failed, we have to load data from javascript
                    self.renderHtml(data);
				}
			}).done(function() {
				//console.log("success")
			});
		},
		renderHtml:function(data){
			var self = this;
			//render the navigation
			this.$nav.html(_.template(self.$navTemplate.html(),{items:data.data}));
			//render the page body
			this.$content.html(_.template(self.$contentTemplate.html(),{items:data.data}));
            //binding
            this.binding();
		},
		binding:function(){
            //bind click for desk top
            var self = this;
			this.$nav.find("li").click(function(evt){
                evt.preventDefault();
                var index = $(this).index();
                var profiles = self.$content.find(".profile");
                var target = profiles.eq(index);
                profiles.hide();
                profiles.eq(index).fadeIn(200);
            });
            //bind click for mobile
            this.$content.find(".profileLabel").click(function(evt){
                evt.preventDefault();
                self.$content.find(".profile").slideUp(200);

                $(this).next(".profile").slideDown(200);
            })

            //kick off the app
            this.$nav.find("li:first").trigger("click");
		}
	};
	
	//register plug-in to jQuery and bind to to data for debugging
	$.fn.profileBrowser = function(options){
		return this.each(function(){
			$(this).data("profileBrowser",new ProfileBrowser($(this),options));
		});
	};
		
})(window);


