import webbrowser
import csv
import os
import re

import pandas as pd
from flask import Flask, render_template, request
from waitress import serve

app = Flask(__name__, template_folder='./templates', static_folder='./static')

images = os.listdir(r'static\Images')

file_path = 'static\\JavaScript\\WebsiteVehicles.CSV'
car_dict = {}
with open(file_path, mode ='r') as file:    
       csvFile = csv.reader(file)
       for lines in csvFile:
            car_dict[lines[0]] = lines[1:]

for key in car_dict.keys():
    print(key)
    matching_images = [i for i in images if re.search(f'\\d+_{key}_\\d+', i)]
    print(matching_images)
    car_dict[key].append(matching_images)

@app.route('/')
@app.route('/HomePage')
def index():
    return render_template("HomePage.html")

@app.route('/Inventory')
def inventory():
    return render_template("Inventory.html")

@app.errorhandler(404)
@app.route('/PageNotFound')
def page_not_found(e=None):
    return render_template("PageNotFound.html")

@app.route('/Parts')
def parts():
    return render_template("Parts.html")

@app.route('/About')
def about():
    return render_template("About.html")

@app.route('/ProductPage')
def template():
    print('yes')
    return render_template("ProductPage.html")

@app.route('/RepairShop')
def repair_shop():
    return render_template("RepairShop.html")

@app.route('/all_vehicles')
def all_vehicles():
    return {'all_vehicles': car_dict}
    return {'error': None}

@app.route('/get_vehicle_data')
def get_vehicle_data():
    stockNumber = request.args.get('stockNumber')
    if stockNumber in car_dict.keys():
        return {'product': car_dict[stockNumber]}

    return {'product': None}

if __name__=='__main__':
    webbrowser.open('http://127.0.0.1:80')
    serve(app, host='0.0.0.0', port=80)