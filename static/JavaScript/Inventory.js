// Store data for a vehicle
class Vehicle {
    constructor(stockNumber, year, make, model, transmission, engine, vin, miles, color, price, img_path, imgs) {
        this.stockNumber = stockNumber.replace(/['"]+/g, '');
        this.year = year.replace(/['"]+/g, '');
        this.make = make.replace(/['"]+/g, '');
        this.model = model.replace(/['"]+/g, '');
        this.transmission = transmission.replace(/['"]+/g, '');
        this.engine = engine.replace(/['"]+/g, '');
        this.vin = vin.replace(/['"]+/g, '');
        this.miles = miles.replace(/['"]+/g, '');
        this.color = color.replace(/['"]+/g, '');
        this.price = price.replace(/['"]+/g, '');
        this.img_path = img_path.replace(/['"]+/g, '');
        this.imgs = imgs.replace(/['"]+/g, '');
        this.html = null
        // string for searching
        this.search_string = this.stockNumber + ' ' + this.year + ' ' + this.make + ' ' + this.model + ' ' + this.transmission + ' ' + this.vin + ' ' + this.color
    }
}

// List of all vehicles
var invVehicles = [];

// Tracks direction of arrow
var asc_desc_sort = 1

// Add div with text to element
function add_element(el, text) {
    div = document.createElement('div');
    div.innerHTML = text
    el.appendChild(div)
}

// Sort vehicles based on and attribute (Year, Miles, or Price)
function sort_objects(items, sort_attribute="Year") {
    return items.sort((a, b) => {
        console.log(sort_attribute)
        if (sort_attribute == "Miles") {
            nameA = Number(a.miles);
            nameB = Number(b.miles);
        }
        else if (sort_attribute == "Price") {
            nameA = Number(a.price);
            nameB = Number(b.price);
        }
        else {
            nameA = a.year + a.make.toUpperCase() + a.model.toUpperCase();
            nameB = b.year + b.make.toUpperCase() + b.model.toUpperCase();
        }

        if (nameA < nameB) {
            return -1 * asc_desc_sort;
        }
        if (nameA > nameB) {
            return 1 * asc_desc_sort;
        }

        // names must be equal
        return 0;
    })
}

$.getJSON("/all_vehicles", function (result) {
    console.log(result['all_vehicles'])

    var MappedVehicles = [];
    MappedVehicles = Object.entries(result['all_vehicles']).map(([k, v]) => {
        return [k, v]
    });
    MappedVehicles.forEach(function (item, index) {
        var currentLine = item[1]
        let p = new Vehicle(item[0], currentLine[0], currentLine[1], currentLine[2], currentLine[3], currentLine[4], currentLine[5], currentLine[6], currentLine[7], currentLine[8], currentLine[9], currentLine[10])
        invVehicles.push(p)
    });
    invVehicles = sort_objects(invVehicles)
    console.log(invVehicles)
    let item;
    CarWrapper = document.getElementById("AllCars");
    imageDirectory = "static\\Images\\";

    table = document.createElement('table');
    CarWrapper.appendChild(table)

    for (let i = 0; i < invVehicles.length; i++) {
        if (i % 3 == 0) {
            tr = document.createElement('tr')
            table.appendChild(tr)
        }

        CurrentVehicle = invVehicles[i]

        // Load car image details
        let link = document.createElement('a');
        link.href = 'ProductPage?stockNumber=' + CurrentVehicle.stockNumber;
        let img = document.createElement('img');
        console.log(invVehicles)
        img.src = imageDirectory + invVehicles[i].img_path;
        img.classList.add("InventoryImage")

        image_table_data = document.createElement('td');
        image_table_data.classList.add('CarImage')
        image_table_data.id = invVehicles[i].stockNumber;

        // Add image to table
        image_table_data.appendChild(link)
        link.appendChild(img)

        link = document.createElement('a');
        let linkText = document.createTextNode(CurrentVehicle.year + " " + CurrentVehicle.make + ' ' + CurrentVehicle.model);
        link.appendChild(linkText);
        link.title = CurrentVehicle.make + ", " + CurrentVehicle.model;
        link.href = 'ProductPage?stockNumber=' + CurrentVehicle.stockNumber;

        image_table_data.id = (CurrentVehicle.stockNumber + "button");

        table.appendChild(image_table_data)

        link.allText = CurrentVehicle.make + ", " + CurrentVehicle.model
        link.classList.add("Heading")

        image_table_data.appendChild(link);
        add_element(image_table_data, "Miles: " + CurrentVehicle.miles)
        add_element(image_table_data, "Price: " + CurrentVehicle.price)

        linebreak = document.createElement("br");
        image_table_data.appendChild(linebreak);

        tr.appendChild(image_table_data);
        CurrentVehicle.html = image_table_data
    }

})


function search_cars() {
    SearchBar = document.getElementById("SearchBar")
    SearchOption = document.getElementById("SearchOption")

    console.log(SearchBar)
    console.log(SearchBar.value)
    console.log(SearchOption.value)

    function keyword(item) {
        return item.search_string.toLowerCase().includes(SearchBar.value.toLowerCase())
    }
    function min_miles(item) {
        console.log(Number(item.miles))
        console.log(Number(SearchBar.value.replace(/,/g, '')))
        console.log()
        return Number(item.miles) > Number(SearchBar.value.replace(/,/g, ''))
    }
    function max_miles(item) {
        return Number(item.miles) < Number(SearchBar.value.replace(/,/g, ''))
    }
    function min_price(item) {
        return Number(item.price) > Number(SearchBar.value.replace(/,/g, ''))
    }
    function max_price(item) {
        return Number(item.price) < Number(SearchBar.value.replace(/,/g, ''))
    }
    function vin(item) {
        return item.vin.toLowerCase().includes(SearchBar.value.toLowerCase())
    }

    if (SearchOption.value == "Key Word") {filter_function = keyword}
    else if (SearchOption.value == "Minimum Miles") {filter_function = min_miles}
    else if (SearchOption.value == "Maximum Miles") {filter_function = max_miles}
    else if (SearchOption.value == "Minimum Price") {filter_function = min_price}
    else if (SearchOption.value == "Maximum Price") {filter_function = max_price}
    else if (SearchOption.value == "VIN") {filter_function = vin}

    table.remove()
    table = document.createElement('table');
    CarWrapper.appendChild(table)
    
    searchList = invVehicles.filter(filter_function)
    i = 0
    searchList.forEach(car_obj => {
        if (i % 3 == 0) {
            tr = document.createElement('tr')
            table.appendChild(tr)
        }

        tr.appendChild(car_obj.html);
        i += 1;
    })
}

var SortVeh = document.getElementById('SortVehicles');
SortVeh.onchange = (event) => {
    var inputText = event.target.value;

    invVehicles = sort_objects(invVehicles, inputText)
    search_cars()
}

function flip_sort() {
    SortButton = document.getElementById("SortButton")
    if (SortButton.classList.value.includes("Rotate")) {
        asc_desc_sort = 1
        SortButton.classList.remove("Rotate")
    } else {
        asc_desc_sort = -1
        SortButton.classList.add("Rotate")
    }
    inputText = SortVeh.value

    invVehicles = sort_objects(invVehicles, inputText)
    search_cars()
}

var SearchOpt = document.getElementById('SearchOption');
SearchOpt.onchange = (event) => {
    search_cars()
}
