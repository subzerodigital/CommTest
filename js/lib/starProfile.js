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
	var StarProfile = function($el,options){
		//init properties 
		this.$el = $el;	
		this.$nav = $el.find(".nav");
		this.$navTemplate = null;
		this.$bodyTemplate = null;
		//init plugin
		this.init();
	};
	
	StarProfile.prototype = {
		init:function(){
			this.$navTemplate = $("#navTemp");
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
		},
		binding:function(){
			
		}
	};
	
	//register plug-in to jQuery and bind to to data for debugging
	$.fn.starProfile = function(options){
		return this.each(function(){
			$(this).data("starProfile",new StarProfile($(this),options));
		});
	};
		
})(window);


