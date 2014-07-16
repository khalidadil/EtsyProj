function EtsyClient(options){
	this.etsy_url = "https://openapi.etsy.com/";
	this.version = options.version || "v2/";
	this.api_key = "fjlg40t8hj9r07c4alcbfmoo";
	this.complete_api_url = this.etsy_url + this.version;
}

EtsyClient.prototype.listings = function(){
	this.model = "listings/";
	this.filter = "active";
	var js = ".js";

	$.getJSON(this.complete_api_url + this.model + this.filter + ".js?api_key=" + this.api_key).then(function(data){
		console.log(data);
	})
}

var client = new EtsyClient({version:"v2/"});
client.listings();