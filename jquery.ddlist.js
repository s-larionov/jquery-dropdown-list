(function($) {// secure $ jQuery alias
/*******************************************************************************************/
// Copyright (c) 2011, Larry (http://larionov.biz)
// Liscensed under the BSD License (BSD-LICENSE.txt)
// http://www.opensource.org/licenses/bsd-license.php
// Examples of use:
// $('.ddlist').DropDownList();
// $('.ddlist').DropDownList({selectorItem: 'li', classFolded: 'g-opened'});
/*******************************************************************************************/

	/**
	 * @param {DOMElement} list
	 * @param {Object} config
	 */
	$.DropDownList = function(list, config) {
		var self = this;
		this.config = $.extend({}, this.defaultConfig, config || {});

		this.list	= $(list);

		// Initialize for DropDownList Items
		this.items	= [];
		this.list.find(this.config.selectorItem).each(function(i, item) {
			self.items.push(new $.DropDownList.Item(item, self));
		});

		this.countFolded = 0;
		if (this.config.autoFoldFirstItem && this.items.length) {
			this.items[0].show();
		}
	};
	/**
	 * Default configuration for DropDownList
	 * @var {Object}
	 */
	$.DropDownList.prototype.defaultConfig = {
		effects: true,				// Enable sliding
		effectsSpeed: null,			// speed for sliding

		autoFoldFirstItem: false,	// automatically fold first item
		oneUnfolded: false,			// one item always folded
		isAccordion: false,			// Accordion mode (folded only one item in one time)

		selectorItem: '.ddlist-item',
		selectorItemTitle: '.ddlist-title',
		selectorItemBody: '.ddlist-body',

		classFolded: 'ddlist-item-opened',
		classUnfolded: 'ddlist-item-one'
	};
	/**
	 * Class for DropDownList Item
	 * @param {DOMElement} item
	 * @param {$.DropDownList} list
	 */
	$.DropDownList.Item = function(item, list) {
		var self = this;
		this.list = list;
		this.item = $(item);
		this.body = this.item.find(this.list.config.selectorItemBody).hide();

		this.item.find(this.list.config.selectorItemTitle).click(function() {
			self.toggle();
		});

		this.folded = false;
	};

	/**
	 * Get DropDownList configuration
	 * @return {Object}
	 */
	$.DropDownList.Item.prototype.getConfig = function() {
		return this.list.config;
	};

	/**
	 * Fold DropDownList Item body for current item
	 * @return {$.DropDownList.Item}
	 */
	$.DropDownList.Item.prototype.show = function() {
		if (this.getConfig().isAccordion && this.list.countFolded > 0) {
			for (var i = this.list.items.length - 1; i >= 0; i--) {
				if (this.list.items[i].isFolded()) {
					this.list.items[i].hide(true);
				}
			}
		}
		this.body[this.getConfig().effects? 'slideDown': 'show'](this.list.config.effectsSpeed);
		this.item.addClass(this.getConfig().classFolded);
		this.folded = true;
		this.list.countFolded++;
		return this;
	};
	/**
	 * Unfold DropDownList Item body for current item
	 * @param {Boolean} force	Ignore configuration option oneUnfolded
	 * @return {$.DropDownList.Item}
	 */
	$.DropDownList.Item.prototype.hide = function(force) {
		if (!this.getConfig().oneUnfolded || this.list.countFolded > 1 || force) {
			this.body[this.getConfig().effects? 'slideUp': 'hide'](this.list.config.effectsSpeed);
			this.item.removeClass(this.getConfig().classFolded);
			this.folded = false;
			this.list.countFolded--;
		}
		return this;
	};
	/**
	 * Check state of DropDownList Item
	 * @return {Boolean}
	 */
	$.DropDownList.Item.prototype.isFolded = function() {
		return this.folded || false;
	};
	/**
	 * Toggle state for DropDownList Item
	 * @return {$.DropDownList.Item}
	 */
	$.DropDownList.Item.prototype.toggle = function() {
		if (this.isFolded()) {
			this.hide();
		} else {
			this.show();
		}
		return this;
	};

	/**
	 * @param {Object} config
	 * @return {jQuery}
	 */
	$.fn.DropDownList = function(config) {
		return this.each(function() {
			new $.DropDownList(this, config);
		});
	};
})(jQuery);
