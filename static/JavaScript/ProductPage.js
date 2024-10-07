var urlParams = {};
(window.onpopstate = function () {
    // Get url parameters for current cars stock number
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();

console.log(urlParams);

const ImagePath = "static/Images/";
const default_image = "static/Resources/CarLot.jpg";

$.getJSON(`/get_vehicle_data?stockNumber=${urlParams.stockNumber}`, function (result) {
    const product = result.product;
    // Get main div to insert data
    const CarDiv = $("#CarDetails");

    if (!product) {
        // No product was found with id number
        $('<br>').appendTo(CarDiv);
        $('<div></div>').addClass("none_found").html("Could not find product").appendTo(CarDiv);
        $('<br>').appendTo(CarDiv);
        return;
    }

    const table = $("<table></table>").appendTo(CarDiv);

    let tr = $("<tr></tr>").appendTo(table);
    let td = $("<td></td>").appendTo(tr);
    let img = $("<img>").addClass("display");

    const images = product[9];
    if (images.length === 0) {
        // No image data. Add generic image
        img.attr("src", default_image);
    } else {
        // Add first image
        img.attr("src", ImagePath + images[0]);
    }
    td.append(img);

    // Create information table cell
    td = $("<td></td>").addClass("information").appendTo(tr);
    $("<h2></h2>").html(`${product[0]} ${product[1]} ${product[2]}`).appendTo(td);

    // Add car information to page
    $('<div></div>').html("Transmission: " + product[3]).appendTo(td);
    $('<div></div>').html("Engine: " + product[4]).appendTo(td);
    $('<div></div>').html("Miles: " + product[6]).appendTo(td);
    $('<div></div>').html("Color: " + product[7]).appendTo(td);
    $('<div></div>').html("Price: " + product[8]).appendTo(td);
    $('<div></div>').html("Vin: " + product[5]).appendTo(td);

    for (let i = 1; i < images.length; i++) {
        if (i % 2 === 1) {
            // Create new row every other image
            tr = $("<tr></tr>").appendTo(table);
        }

        td = $("<td></td>").appendTo(tr);
        img = $("<img>").addClass("display").attr("src", ImagePath + images[i]);
        td.append(img);
    }

    if (images.length % 2 === 0 && images.length !== 0) {
        // Add default image if last image is on the left
        td = $("<td></td>").appendTo(tr);
        img = $("<img>").addClass("display").attr("src", default_image);
        td.append(img);
    }
});
