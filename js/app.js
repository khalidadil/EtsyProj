function EtsyClient(options) {
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.version || "v2/";
    this.api_key = "fjlg40t8hj9r07c4alcbfmoo";
    this.complete_api_url = this.etsy_url + this.version;
}

EtsyClient.prototype.getHTMLTemplate = function(url) {
    return $.get(url).then(function(my_template) {
        findVariables = _.template(my_template);
        return findVariables;
    });
};

EtsyClient.prototype.getAllActiveListings = function(offset) {
    var model = "listings/";
    var filter = "active";
    this.offset = offset || 0;
    var num_listings = 15;
    var min_price = 100000;
    var url = this.complete_api_url + model + filter + ".js?limit=" + num_listings + "&min_price=" + min_price + "&offset=" + this.offset + "&includes=MainImage&api_key=" + this.api_key + "&callback=?";

    return $.getJSON(url).then(function(data) {
        this.cachedListings = data;
        return data;
    });
}

EtsyClient.prototype.showListings = function(page) {
    var self = this;
    var all_html = '';
    var offset = page * 15;
    return $.when(
        this.getHTMLTemplate('/templates/listings.tmpl'),
        this.getAllActiveListings(offset)
    ).then(function(template, data) {
        var search_results = data.results;
        // console.log(data.results);
        search_results.forEach(function(n) {
            var filled_html = template(n);
            all_html += filled_html;
        });
        $('.mainArea')[0].innerHTML = all_html;
        // console.log(all_html);
        return all_html;
    });
}

EtsyClient.prototype.showPages = function(page) {
    var self = this;
    // console.log(self.showListings(0));
    for (i=0; i<page; i++){
        var all_html = all_html + this.showListings(i);
    }
    $('.mainArea')[0].innerHTML = all_html;
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
        // console.log(data.results[0].user_id);
        self.showUserInfo(data.results[0].user_id);
        var filled_html = template(data.results[0]);
        $('body').append(filled_html);
    });
}

EtsyClient.prototype.getUserInfo = function(id) {
    var model = 'users';
    var url = this.complete_api_url + model + '/' + id + "/profile.js?api_key=" + this.api_key + "&callback=?";

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
        // console.log(data);
        var filled_html = template(data.results[0]);
        $('.mainsection').append(filled_html);
    });
}

EtsyClient.prototype.handleClicks = function() {
    var self = this;
    $('body').on('click', '.cover', function() {
        self.showListingInfo($(this).attr('id'));
        $('body').toggleClass('noScroll');
    });
    $('body').on('click', '.mask', function() {
        $(".mask").remove();
        $(".hoverbox").remove();
        $('body').toggleClass('noScroll');
    });
    $('body').on('click', '.closebutton', function() {
        $(".mask").remove();
        $(".hoverbox").remove();
        $('body').toggleClass('noScroll');
    });
}

EtsyClient.prototype.handleRouting = function() {
    var self = this;

    Path.root("#/");

    Path.map("#/:page").to(function() {
        self.showPages(this.params.page);
        $(".hoverListing").remove();
        $('body').removeClass('noScroll');
    });

    Path.map("#/listing/:id").to(function() {
        self.showListingInfo(this.params.id);
        $('body').addClass('noScroll');
    });

    Path.listen();
}

$(function() {
    var client = new EtsyClient({
        version: "v2/"
    });
    // client.showListings();
    // client.handleClicks();
    client.handleRouting();
});
