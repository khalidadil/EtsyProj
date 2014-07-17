function EtsyClient(options){
	this.etsy_url = "https://openapi.etsy.com/";
	this.version = options.version || "v2/";
	this.api_key = "fjlg40t8hj9r07c4alcbfmoo";
	this.complete_api_url = this.etsy_url + this.version;
}

EtsyClient.prototype.pullAllActiveListings = function(){
	var model = "listings/";
	var filter = "active";
	var url = this.complete_api_url + model + filter + ".js?limit=25&min_price=100000&api_key=" + this.api_key + "&callback=?";
	
	var html_template_url = "./templates/listing.tmpl";

	$.get(html_template_url).then(function(my_template){
		var findVariables = _.template(my_template);

		$.getJSON(url).then(function(data){
				var search_results = data.results;
				search_results.forEach(function(n){
					var filled_html = findVariables(n);
					// $('h1').append(filled_html);
					var div = document.createElement('div');
					div.innerHTML = filled_html;
					document.body.appendChild(div);
					// document.body.appendChild(div);
				})
		});
	});
}

EtsyClient.prototype.getListingInfo = function(id) {
    var model = 'listings';

    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        console.log(data.results[0]);
        // $('h1')[0].innerText = data.results[0].title;
    });
}

EtsyClient.prototype.getUserInfo = function(id) {
    var model = 'users';
    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        console.log(data.results[0]);
    });
}

window.onload=function(){
	var client = new EtsyClient({version:"v2/"});
	client.pullAllActiveListings();
	client.getListingInfo(77362746);
	client.getUserInfo(12524035);
};