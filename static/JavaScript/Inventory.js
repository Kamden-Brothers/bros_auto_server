const default_image = "static/Resources/no_image.jpg"; // Updated to single default image

// Store data for a vehicle
class Vehicle {
    constructor(stockNumber, year, make, model, transmission, engine, vin, miles, color, price, imgs) {
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
        this.imgs = imgs;

        this.img_path = this.imgs.length > 0
            ? "static/Images/" + this.imgs[0].replace(/['"]+/g, '')
            : default_image;

        this.html = null;
        this.search_string = `${this.stockNumber} ${this.year} ${this.make} ${this.model} ${this.transmission} ${this.vin} ${this.color}`;
    }
}

// List of all vehicles
let invVehicles = [];

// Tracks direction of arrow
let asc_desc_sort = 1;

// Sort vehicles based on an attribute (Year, Miles, or Price)
function sort_objects(items, sort_attribute = "Year") {
    return items.sort((a, b) => {
        let nameA, nameB;
        if (sort_attribute === "Miles") {
            nameA = Number(a.miles);
            nameB = Number(b.miles);
        } else if (sort_attribute === "Price") {
            nameA = Number(a.price);
            nameB = Number(b.price);
        } else {
            nameA = a.year + a.make.toUpperCase() + a.model.toUpperCase();
            nameB = b.year + b.make.toUpperCase() + b.model.toUpperCase();
        }

        return (nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)) * asc_desc_sort;
    });
}

$.getJSON("/all_vehicles", function (result) {
    // Create list of all current vehicles
    invVehicles = Object.entries(result['all_vehicles']).map(([key, currentLine]) =>
        new Vehicle(key, ...currentLine)
    );

    // Sort vehicles
    invVehicles = sort_objects(invVehicles);

    const CarWrapper = $("#AllCars");
    const table = $("<table></table>").appendTo(CarWrapper).attr('id', 'main_table');

    for (let i = 0; i < invVehicles.length; i++) {
        // Create a new row after appending 3 items
        if (i % 3 === 0) {
            const tr = $("<tr></tr>").appendTo(table);
        }

        const CurrentVehicle = invVehicles[i];

        // Load car image details
        const link = $("<a></a>").attr("href", 'ProductPage?stockNumber=' + CurrentVehicle.stockNumber);
        const img = $("<img>").attr("src", CurrentVehicle.img_path).addClass("InventoryImage");

        const image_table_data = $("<td></td>").addClass('CarImage').attr('id', CurrentVehicle.stockNumber);

        // Add image to table
        link.append(img);
        image_table_data.append(link);

        // Create Heading with Car year make and model that links to product page
        const linkText = `${CurrentVehicle.year} ${CurrentVehicle.make} ${CurrentVehicle.model}`;
        const linkTextElement = $("<a></a>")
            .text(linkText)
            .attr("title", `${CurrentVehicle.make}, ${CurrentVehicle.model}`)
            .attr("href", 'ProductPage?stockNumber=' + CurrentVehicle.stockNumber)
            .addClass("Heading");

        image_table_data.attr('id', CurrentVehicle.stockNumber + "button").append(linkTextElement);
        $("<div></div>").text("Miles: " + CurrentVehicle.miles).appendTo(image_table_data);
        $("<div></div>").text("Price: " + CurrentVehicle.price).appendTo(image_table_data);

        image_table_data.append("<br>");
        const tr = table.find('tr').last(); // Find the last row to append to
        tr.append(image_table_data);
        CurrentVehicle.html = image_table_data;
    }
});

// Limit list based on SearchOption
function search_cars() {
    const SearchBar = $("#SearchBar");
    const SearchOption = $("#SearchOption");

    // Functions for filtering items
    const keyword = item => item.search_string.toLowerCase().includes(SearchBar.val().toLowerCase());
    const min_miles = item => Number(item.miles) > Number(SearchBar.val().replace(/,/g, ''));
    const max_miles = item => Number(item.miles) < Number(SearchBar.val().replace(/,/g, ''));
    const min_price = item => Number(item.price) > Number(SearchBar.val().replace(/,/g, ''));
    const max_price = item => Number(item.price) < Number(SearchBar.val().replace(/,/g, ''));
    const vin = item => item.vin.toLowerCase().includes(SearchBar.val().toLowerCase());

    let filter_function;
    switch (SearchOption.val()) {
        case "Key Word": filter_function = keyword; break;
        case "Minimum Miles": filter_function = min_miles; break;
        case "Maximum Miles": filter_function = max_miles; break;
        case "Minimum Price": filter_function = min_price; break;
        case "Maximum Price": filter_function = max_price; break;
        case "VIN": filter_function = vin; break;
    }

    // Delete previous data
    $("table").remove();
    const newTable = $("<table></table>").appendTo($("#AllCars")).attr('id', 'main_table');

    const searchList = invVehicles.filter(filter_function);
    let i = 0;

    let tr;
    searchList.forEach(car_obj => {
        // Create new row every 3
        if (i % 3 === 0) {
            tr = $("<tr></tr>").appendTo(newTable);
        }

        // Add cars to row
        tr.append(car_obj.html);
        i++;
    });
}

// Check for sort variable to change
const SortVeh = $('#SortVehicles');
SortVeh.change(event => {
    const inputText = event.target.value;
    invVehicles = sort_objects(invVehicles, inputText);
    search_cars();
});

// Change asc desc status
function flip_sort() {
    const SortButton = $("#SortButton");
    if (SortButton.hasClass("Rotate")) {
        asc_desc_sort = 1;
        SortButton.removeClass("Rotate");
    } else {
        asc_desc_sort = -1;
        SortButton.addClass("Rotate");
    }
    const inputText = SortVeh.val();
    invVehicles = sort_objects(invVehicles, inputText);
    search_cars();
}

// Check for search text
const SearchOpt = $('#SearchOption');
SearchOpt.change(() => {
    search_cars();
});
