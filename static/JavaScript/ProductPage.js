var urlParams = {};
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
  
    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

console.log(urlParams)

function add_break(element) {
    linebreak = document.createElement("br");
    element.appendChild(linebreak)
}

function add_element(el, text) {
    div = document.createElement('div');
    div.innerHTML = text
    el.appendChild(div)
}

ImagePath = "static\\Images\\"
default_image = "static\\Resources\\CarLot.jpg"

$.getJSON(`/get_vehicle_data?stockNumber=${urlParams.stockNumber}`, function (result) {
    console.log(result)
    product =  result.product
    CarDiv = document.getElementById("Car Details");
    if (!result.product) {
        console.log('Could not find car with stock number')
        let text = document.createElement('div');
        text.classList.add("none_found")
        text.innerHTML = "Could not find product"

        add_break(CarDiv)
        CarDiv.appendChild(text)
        add_break(CarDiv)
        return
    }

    table = document.createElement("table");
    CarDiv.appendChild(table)

    tr = document.createElement('tr')
    table.appendChild(tr)

    td = document.createElement('td')
    tr.appendChild(td)
    img = document.createElement('img')
    img.classList.add("display")

    images = product[9]
    num_images = images.length
    if (images == 0) {
        img.src = default_image;
    }
    else {
        img.src = ImagePath + images[0];
    }
    td.appendChild(img)

    td = document.createElement('td')
    td.classList.add("information")
    tr.appendChild(td)

    h2 = document.createElement("h2")
    h2.innerHTML = product[0] + " " + product[1] + " " + product[2]
    td.appendChild(h2)

    add_element(td, "Transmission: " + product[3])
    add_element(td, "Engine: " + product[4])
    add_element(td, "Miles: " + product[6])
    add_element(td, "Color: " + product[7])
    add_element(td, "Price: " + product[8])
    add_element(td, "Vin: " + product[5])


    for (let i = 1; i < images.length; i++) {
        if (i % 2 == 1) {
            tr = document.createElement('tr')
            table.appendChild(tr)
        }

        td = document.createElement('td')
        tr.appendChild(td)

        img = document.createElement('img')
        img.classList.add("display")
        img.src = ImagePath + images[i];
        td.appendChild(img)
    }

    console.log(images.length % 2)
    if (images.length % 2 == 0 && images.length != 0) {
        td = document.createElement('td')
        tr.appendChild(td)

        img = document.createElement('img')
        img.classList.add("display")
        img.src = default_image;
        td.appendChild(img)
    }
})