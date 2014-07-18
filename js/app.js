function EtsyClient(options) {
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.version || "v2/";
    this.api_key = "fjlg40t8hj9r07c4alcbfmoo";
    this.complete_api_url = this.etsy_url + this.version;
}

EtsyClient.prototype.getHTMLTemplate = function(url) {
    return $.get(url).then(function(my_template){
    	findVariables = _.template(my_template);
    	return findVariables;
    });
};

EtsyClient.prototype.getAllActiveListings = function() {
    var model = "listings/";
    var filter = "active";
    var num_listings = 15;
    var min_price = 100000;
    var url = this.complete_api_url + model + filter + ".js?limit=" + num_listings + "&min_price=" + min_price + "&includes=MainImage&api_key=" + this.api_key + "&callback=?";

    return $.getJSON(url).then(function(data) {
    	return data;
    });
}

EtsyClient.prototype.showListings = function() {
    var self = this;
    $.when(
        this.getHTMLTemplate('/templates/listings.tmpl'),
        this.getAllActiveListings()
    ).then(function(template, data) {
        var search_results = data.results;
        search_results.forEach(function(n) {
            var filled_html = template(n);
            $('.mainArea').append(filled_html);
        })
    });
}

EtsyClient.prototype.getListingInfo = function(id) {
    var model = 'listings';
    var url = this.complete_api_url + model + '/' + id + ".js?includes=MainImage&api_key=" + this.api_key + "&callback=?";
    
    return $.getJSON(url).then(function(data) {
    	return data;
    });
}

EtsyClient.prototype.showListingInfo = function(id) {
    var self = this;
    $.when(
        this.getHTMLTemplate('/templates/listing.tmpl'),
        this.getListingInfo(id)
    ).then(function(template, data) {
            var filled_html = template(data.results[0]);
            $('.mainArea').append(filled_html);
    });
}

EtsyClient.prototype.getUserInfo = function(id) {
    var model = 'users';
    var url = this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?";

    return $.getJSON(url).then(function(data) {
		return data;
	});
}

EtsyClient.prototype.showUserInfo = function(id) {
    var self = this;
    $.when(
        this.getHTMLTemplate('/templates/seller.tmpl'),
        this.getUserInfo(id)
    ).then(function(template, data) {
            var filled_html = template(data.results[0]);
            $('.mainArea').append(filled_html);
    });
}

$(function() {
    var client = new EtsyClient({version: "v2/"});
    client.showListings ();
    client.showListingInfo(181535970);
    client.showUserInfo(12524035);
});
