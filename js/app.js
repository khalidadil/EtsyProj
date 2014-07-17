function EtsyClient(options){
	this.etsy_url = "https://openapi.etsy.com/";
	this.version = options.version || "v2/";
	this.api_key = "fjlg40t8hj9r07c4alcbfmoo";
	this.complete_api_url = this.etsy_url + this.version;
}

EtsyClient.prototype.pullAllActiveListings = function(){
	var model = "listings/";
	var filter = "active";

	return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&callback=?").then(function(data){
		console.log(data);
	});
}

EtsyClient.prototype.getListingInfo = function(id) {
    var model = 'listings';

    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        console.log(data);
    });
}

EtsyClient.prototype.getUserInfo = function(id) {
    var model = 'users';
    return $.getJSON(this.complete_api_url + model + '/' + id + "?api_key=" + this.api_key + "&callback=?").then(function(data) {
        console.log(data);
    });
}

window.onload=function(){
	var client = new EtsyClient({version:"v2/"});
	client.pullAllActiveListings();
	client.getListingInfo(77362746);
	client.getUserInfo(12524035);
};