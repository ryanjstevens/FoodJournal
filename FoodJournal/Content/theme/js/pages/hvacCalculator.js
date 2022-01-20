var hvacCalculator = (function() {

	var contentType = "cooling";

	//object that stores the calculated data
	var calculatedData = {
		"cooling": {
			"annualCostExisting": 0,
			"annualCostNew": 0,
			"annualSavings": [
				{
					"year": 0,
					"annualCostExisting": 0,
					"annualCostNew": 0,
					"annualCostDifference": 0,
					"cumulativeSavings": 0,
					"cumulativeSavingPercent": 0
				}
			]
		},
		"heating": {
			"annualCostExisting": 0,
			"annualCostNew": 0,
			"annualSavings": [
				{
					"year": 0,
					"annualCostExisting": 0,
					"annualCostNew": 0,
					"annualCostDifference": 0,
					"cumulativeSavings": 0,
					"cumulativeSavingPercent": 0
				}
			]
		} 
	};

	//object that stores all user-selected answers
	var userSettingsObj = {
		"cityData": 0,
		"equipmentTons":36000,
		"cSEER":15,
		"cSEERExisting":8,
		"cEquipmentExisting":24000,
		//"cDegreeDays":4266,
		"cEquipment":24000,
		"inflation":"",
		"electric":"",
		"gas":"",
		"oil":"",
		"propane":"",
		"inflationGhost":6.0,
		"electricGhost":11.8,
		"gasGhost":186.9,
		"oilGhost":267.2,
		"propaneGhost":437.6,
		"hEquipmentType":0,
		"hEfficiencyType":"AFUE",
		"hFuelType":0,
		"hEquipmentTypeExisting":0,
		"hEfficiencyTypeExisting":"AFUE",
		"hFuelTypeExisting":0,
		"hAFUESingle":90,
		//"hAFUEVariable":95,
		"hAFUEExistingSingle":70,
		//"hAFUEVariableExisting":81,
		"hHSPF":8.6,
		"hHSPFExisting":6.5,
		"hEquipment":80000,
		"hEquipmentExisting":80000
		//"hDegreeDays":686   
	};

	var cityData = [];
	var dropdownDefs = {};

	var labels = {
		"cityData": "Location",
		"cEquipment": "Cooling Equipment Size",
		"cSEERExisting": "SEER Rating",
		"cSEER": "SEER Rating",
		"hEquipmentTypeExisting": "Equipment Type",
		"hEquipmentExisting": "Equipment Size",
		"hEquipmentTonsExisting": "Heat Pump Size",	
		"hFuelTypeExisting": "Fuel Type",
		"hAFUEExistingSingle": "AFUE Rating (Single Speed)",
		//"hAFUEExistingVariable": "Existing AFUE Rating (Variable Speed)",
		"hHSPFExisting": "HSPF Rating",
		"hEquipmentType": "Equipment Type",
		"hEquipment": "Equipment Size",
		"hEquipmentTons": "Heat Pump Size",		
		"hFuelType": "Fuel Type",
		"hAFUESingle": "AFUE Rating (Single Speed)",
		//"hAFUEVariable": "New AFUE Rating (Variable Speed)",
		"hHSPF": "HSPF Rating",
		"pInflation": "Annual Utility Increase (percent)",
		"pElectric": "Electricity Rate (cents/kWhr)",
		"pGas": "Gas Rate (cents/Therm)",
		"pOil": "Oil Rate (cents/Gallon)",
		"pPropane": "Propane Rate (cents/Gallon)"
	}

	var chartColors = {
		red: "rgb(255, 99, 132)",
		orange: "rgb(255, 159, 64)",
		yellow: "rgb(255, 205, 86)",
		green: "rgb(75, 192, 192)",
		blue: "rgb(54, 162, 235)",
		purple: "rgb(153, 102, 255)",
		grey: "rgb(201, 203, 207)"
	};

	var contentArea;
	var inputFormStr = '';
	var chartInitialized = false;
	var chartInstance = null;

	function init() {
		console.log("hvacCalculator Loaded.");

		thisFile = "json/hvacCalculator.json";

		contentArea = document.getElementsByTagName("ui")[0];
		getCalculatorJSON(contentArea, thisFile);
	}

	function getCalculatorJSON(element, urlStr) {
		/* load hvacCalculator.json */

		var contentStr = "";
		var contentArea = element;
		getUrl(urlStr).then(function (response) {
			//console.log("Success!", response);
			contentStr = response.toString();
			setContentCalculator(contentArea, contentStr);
		}, function (error) {
			console.error("Failed!", error);
		})
	}

	function getUrl(url) {
		/* Load an external file */

		//return a promise
		return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			req.open('GET', url);

			req.onload = function () {
				if (req.status == 200) {
					//404 not found
					resolve(req.response);
				} else {
					//other errors
					reject(Error(req.statusText));
				}
			};

			//network errors
			req.onerror = function () {
				reject(Error("Network Error"));
			};

			//send the request
			req.send();
		});
	}

	function setContentCalculator(element, jsonStr) {
		/* create the content area */

		//parse the json data
		var jsonObj = JSON.parse(jsonStr);

		//create the dropdowns, saving all values to inputFromStr
		createTypeButton();
		createDropdownsCity(jsonObj['cityData']);
		createDropdownsJSON(jsonObj['dropdownMenus']);
		createInputBoxes();

		//add inputFromStr to the html
		contentArea.innerHTML = '<table class="inputForm">' + inputFormStr + '</table>';

		//turn on and off the relevant input rows
		hideDropdowns();

		//perform calculations
		calculate();
	}

	function createTypeButton(){
		/* creates a text link to toggle between heating and cooling and save the setting */
		thisLink = '<button type="button" id="toggleCooling" class="toggle toggleActive" onclick="hvacCalculator.toggleMode(this)">Cooling</button><button type="button" id="toggleHeating" class="toggle" onclick="hvacCalculator.toggleMode(this)">Heating</button>';
		inputFormStr += '<tr><td colspan="2">' + thisLink + '</td></tr>';
	}

	function toggleMode(btnActive) {
		/* Toggles ui elements from Cooling to Heating */

		// Only switch if we weren't already looking at the active set
		if (btnActive.className != "toggle toggleActive") {

			var btnInactive = (btnActive.id == "toggleCooling") ? document.getElementById("toggleHeating") : document.getElementById("toggleCooling");

			typeActive = (btnActive.id == "toggleCooling") ? "cooling" : "heating";
			typeInactive = (btnActive.id == "toggleCooling") ? "heating" : "cooling";

			btnActive.className = "toggle toggleActive";
			btnInactive.className = "toggle toggleInactive";

			var rowsActive = document.getElementsByClassName(typeActive + "Row");
			var rowsInactive = document.getElementsByClassName(typeInactive + "Row");

			for (var i = 0; i < rowsActive.length; i++){
				rowsActive[i].classList.remove('typeInactive');
			}
			for (var i = 0; i < rowsInactive.length; i++){
				rowsInactive[i].classList.add('typeInactive');
			}

			contentType = typeActive;
			updateChart();
		}
	}

	function createInputBoxes(){
		/* Create input boxes out of labels */

		for (var k in labels) {
			var v = labels[k];
			var origKey = k;

			//all items in labels that start with the letter p are not dropdowns
			//create an input box if one exists
			if (k.substring(0, 1).toLowerCase() == 'p'){

				//begin fieldsets
				if (k == 'pInflation'){
					inputFormStr += '</table></fieldset><fieldset><legend>Utility Prices</legend><table>';
				}

				//add ghost text
				k = k.substring(1, 2).toLowerCase() + k.slice(2);
				var thisGhost = '';
				if (userSettingsObj.hasOwnProperty(k + 'Ghost')){
					thisGhost = userSettingsObj[k + 'Ghost'];
				}
				//build the input form
				inputFormStr += "<tr id=\"row_" + origKey + "\"><td class=\"calcLabel\"><div>" + v + '</div></td><td  class=\"calcInput\"><input type="text" id="' + k + '" name="' + k + '" placeholder="'+thisGhost+'" onchange="hvacCalculator.inputChange(this)"></td></tr>';

				//end fieldsets
				if (k == 'pPropane'){
					inputFormStr += '</table></fieldset>';
				}

			}

		}
	}

	function createDropdownsJSON(dropdowns) {
		/* Build dropdowns for dropdowns specified in the JSON */
		var lastExisting = false;

		var lastRow = '';

		//sort dropdowns by order of labels
		for (var k in labels){
			var isExisting = false;
			if (dropdowns[k + "DD"]){
				var v = dropdowns[k + "DD"];

				//track the heating/cooling rows as classes
				if (k.substring(0, 1) == 'c') {
					var thisClass = 'coolingRow';
				}
				else {
					var thisClass = 'heatingRow typeInactive';
				}

				//split the rows up into fieldsets: Existing and New
				switch (k){
					case 'cSEERExisting':
						inputFormStr += '</table><fieldset class="' + thisClass + ' fieldsetExisting"><legend>Existing Equipment</legend><table>';
						break;
					case 'cSEER':
						inputFormStr += '</table></fieldset><fieldset class="' + thisClass + ' fieldsetNew"><legend>New Equipment</legend><table>';
						break;

					case 'hEquipmentTypeExisting':
						inputFormStr += '</table></fieldset><fieldset class="' + thisClass + ' fieldsetExisting"><legend>Existing Equipment</legend><table>';
						break;
					case 'hEquipmentType':
						inputFormStr += '</table></fieldset><fieldset class="' + thisClass + ' fieldsetNew"><legend>New Equipment</legend><table>';
						break;
				}

				//save the html content for this dropdown
				inputFormStr += createDropdownHTML(k + "DD", v, thisClass);
			}
		}
	}

	function createDropdownsCity(dropdowns) {
		/* Build dropdowns for all cities in the JSON */

		var ddEntries = [];
		var cityEntries = [];
		var thisClass = 'ddCity';

		for (i = 0; i < dropdowns.length; i++) {
			ddEntries.push({
				'id': i,
				'name': dropdowns[i]['name']
			});
			cityEntries.push({
				'id': i,
				'jsonid': dropdowns[i]['id'],
				'name': dropdowns[i]['name'],
				'city': dropdowns[i]['City'],
				'state':  dropdowns[i]['Initial'],
				'cooling':{
					'degreeDays': dropdowns[i]['CoolingDegreeDays'],
					'zone': dropdowns[i]['CoolingZone']
				},
				'heating':{
					'degreeDays': dropdowns[i]['HeatingDegreeDays'],
					'zone': dropdowns[i]['HeatingZone']
				},
				'price':{
					'electric': dropdowns[i]['electric'],
					'gas': dropdowns[i]['gas'],
					'oil': dropdowns[i]['oil'],
					'propane': dropdowns[i]['propane']
				}
			});
		}

		//save the cities data for later
		cityData = cityEntries;

		//save the html content for this dropdown
		inputFormStr += createDropdownHTML('cityDataDD', ddEntries, thisClass);
	}

	function createDropdownHTML (key, value, thisClass) {
		contentStr = '';

		//in the json file, the dropdown menus end with "DD".  We need to remove that for labels:
		key = key.slice(0, -2);

		//if the label exists, create the html
		if (labels.hasOwnProperty(key)){ 
			//get the label for the dropdown menu
			var thisLabel = labels[key];
			thisLabel = '<div id="label_' + key + '">' + thisLabel + '</div>';

			//create the dropdown menu
			contentStr += "<tr id=\"row_" + key + "\" class=\"" + thisClass + "\"><td class=\"calcLabel\">" + thisLabel + '</td><td class=\"calcInput\"><select name="' + key + '" onchange="hvacCalculator.ddChange(this)">';
			for (var i = 0; i < value.length; i++) {
				thisName = value[i]['name'];
				selectedStr = '';
				//select the default values and add a star
				if (value[i]['default'] == true) {
					selectedStr = " selected";
					thisName = thisName + ' *';
					//save the default value to the userSettingsObject
					userSettingsObj[key] = value[i]['id'];
				}
				//create the html string
				contentStr += '<option value=' + value[i]['id'] + selectedStr + '>' + thisName + '</option>';
			}
			contentStr += '</select></td></tr>';
		}

		return contentStr;
	}

	function ddChange(selectedObj) {
		/* Track user-entered changes to the dropdown menu */

		var key = selectedObj.name;
		var value = parseInt(selectedObj.options[selectedObj.selectedIndex].value);

		//save the user-entered values:
		userSettingsObj[key] = value;

		calculate();
	}

	function inputChange(selectedObj) {
		/* Track user-entered changes to the dropdown menu */

		var key = selectedObj.name;


		//blank strings need to be recoded as such
		if (selectedObj.value == ''){
			console.log("changed: " + key + " \"\"");

			//save the user-entered values:
			userSettingsObj[key] = '';
		}
		//all other values should be parsed as float
		else {
			var value = parseFloat(selectedObj.value);

			console.log("changed: " + key + " " + value);

			//save the user-entered values:
			userSettingsObj[key] = value;
		}

		calculate();
	}

	function calculate() {

		//get the prices
		var price = [];
		price.electric = (userSettingsObj.electric == "") ? userSettingsObj.electricGhost : userSettingsObj.electric;
		price.gas = (userSettingsObj.gas == "") ? userSettingsObj.gasGhost : userSettingsObj.gas;
		price.oil = (userSettingsObj.oil == "") ? userSettingsObj.oilGhost : userSettingsObj.oil;
		price.propane = (userSettingsObj.propane == "") ? userSettingsObj.propaneGhost : userSettingsObj.propane;
		price.inflation = (userSettingsObj.inflation == "") ? userSettingsObj.inflationGhost : userSettingsObj.inflation;

		//city data
		var cityObj = {};
		cityObj = cityData[userSettingsObj.cityData];
		updateAllGhosts(cityObj);

		//turn on and off dropdown/input rows
		hideDropdowns();

		//calculate values, toggle dropdowns, and update chart
		calculateCool(price, cityObj);
		calculateHeat(price, cityObj);

		console.log("Cooling Cost | Existing: " + calculatedData['cooling']['annualCostExisting'] + " | New:" + calculatedData['cooling']['annualCostNew']);
		console.log("Heating Cost | Existing: " + calculatedData['heating']['annualCostExisting'] + " | New:" + calculatedData['heating']['annualCostNew']);

		//update the chart
		updateChart();
	}

	function calculateCool(price, cityObj) {
		/*  Cooling Calculations
			Derived from https://en.wikipedia.org/wiki/Seasonal_energy_efficiency_ratio */

		var coolingOutput = parseInt((userSettingsObj.cEquipment / 1000) * cityObj.cooling.degreeDays);  // BTU/year  

		//store the annual prices
		price['annualExisting'] = parseInt((coolingOutput / userSettingsObj.cSEERExisting) * (price.electric / 100));  
		price['annualNew'] = parseInt((coolingOutput / userSettingsObj.cSEER) * (price.electric / 100));

		setCalculatedData(price, 'cooling');
	}

	function calculateHeat(price, cityObj) {
		/* Heating Calculations
		derived from https://en.wikipedia.org/wiki/Seasonal_energy_efficiency_ratio 
		more examples: http://www.hvacopcost.com/ and  http://www.greenbuildingadvisor.com/community/forum/gba-pro-help/14608/seer-cop-and-hspf */

		var hNewAnnualCost;   
		var thisAFUE; 
		var stdHEquipment = 80000;

		//new equipment
		switch(parseInt(userSettingsObj.hEquipmentType)) {
			case 0: //Furnace
				thisAFUE = userSettingsObj.hAFUESingle;

				switch (userSettingsObj.hFuelType) {
					case 0: //gas
						hNewAnnualCost = (userSettingsObj.hEquipment / 40) * (price.gas / 100000) * (cityObj.heating.degreeDays * 24) / thisAFUE;
						break;
					case 1: //oil
						hNewAnnualCost = (userSettingsObj.hEquipment / 40) * (price.oil / 140000) * (cityObj.heating.degreeDays * 24) / thisAFUE;
						break;
					case 2: //propane
						hNewAnnualCost = (userSettingsObj.hEquipment / 40) * (price.propane / 91000) * (cityObj.heating.degreeDays * 24) / thisAFUE;
						break;
				}
				break;
			case 1: //Heat Pump
				hNewAnnualCost = (userSettingsObj.hEquipmentTons / 40) * (price.electric / 100000) * (cityObj.heating.degreeDays * 24) / userSettingsObj.hHSPF;
				break;
			case 2: //Electric Heat
				hNewAnnualCost = (stdHEquipment / 40) * (price.electric / 100000) * (cityObj.heating.degreeDays * 24) / 3.41214;
				break;
		}  

		//existing equipment
		var hExistingAnnualCost;  
		switch(parseInt(userSettingsObj.hEquipmentTypeExisting)) {
			case 0: //Furnace
				thisAFUE = userSettingsObj.hAFUEExistingSingle;

				switch (userSettingsObj.hFuelTypeExisting) {
					case 0: //gas
						hExistingAnnualCost = (userSettingsObj.hEquipmentExisting / 40) * (price.gas / 100000) * (cityObj.heating.degreeDays * 24) / thisAFUE;
						break;
					case 1: //oil
						hExistingAnnualCost = (userSettingsObj.hEquipmentExisting / 40) * (price.oil / 140000) * (cityObj.heating.degreeDays * 24) / thisAFUE;
						break;
					case 2: //propane
						hExistingAnnualCost = (userSettingsObj.hEquipmentExisting / 40) * (price.propane / 91000) * (cityObj.heating.degreeDays * 24) / thisAFUE;
						break;
				}  
				break;
			case 1: //Heat Pump
				hExistingAnnualCost = (userSettingsObj.hEquipmentTonsExisting / 40) * (price.electric / 100000) * (cityObj.heating.degreeDays * 24) / userSettingsObj.hHSPFExisting;
				break;
			case 2: //Electric Heat
				hExistingAnnualCost = (stdHEquipment / 40) * (price.electric / 100000) * (cityObj.heating.degreeDays * 24) / 3.41214;
				break;
		}  

		//store the annual prices
		price['annualExisting'] = parseInt(hExistingAnnualCost);  
		price['annualNew'] = parseInt(hNewAnnualCost);

		setCalculatedData(price, 'heating');
	}

	function hideDropdowns(){
		/* Turns on and off dropdowns based on parent values in the JSON */

		//store the display status of elements that turn on and off
		displayStatus = {
			'pGas':false,
			'pOil':false,
			'pPropane':false,
			'hFuelType':false,
			'hFuelTypeExisting':false,
			'hAFUESingle':false,
			'hAFUEExistingSingle':false,
			'hEquipmentTons': false,
			'hEquipmentTonsExisting': false,
			'hHSPF':false,
			'hHSPFExisting':false,
			'hEquipment':false,
			'hEquipmentExisting':false
		}

		//heating equipment types:
		//0 = furnace, 1 = heat pump, 2 = electric heat

		//heating fuel types:
		//0 = gas, 1 = oil, 2 = propane

		//equipment types
		if (userSettingsObj.hEquipmentTypeExisting == 0){
			displayStatus['hFuelTypeExisting'] = true;  //fuel type dropdown
			displayStatus['hAFUEExistingSingle'] = true;  //afue single			
			displayStatus['hEquipmentExisting'] = true;	//equipment size
		}
		if (userSettingsObj.hEquipmentType == 0){
			displayStatus['hFuelType'] = true;	//fuel type dropdown
			displayStatus['hAFUESingle'] = true; //afue single
			displayStatus['hEquipment'] = true;	//equipment size
		}

		if (userSettingsObj.hEquipmentTypeExisting == 1){
			displayStatus['hEquipmentTonsExisting'] = true;	//heat pump size
			displayStatus['hHSPFExisting'] = true;	//hspf
		}
		if (userSettingsObj.hEquipmentType == 1){
			displayStatus['hEquipmentTons'] = true;	//heat pump size
			displayStatus['hHSPF'] = true;	//hspf
		}

		//gas 
		//if furnace and gas selected
		if (
			contentType != 'cooling' &&
			((userSettingsObj.hEquipmentTypeExisting == 0 && userSettingsObj.hFuelTypeExisting == 0) ||
			(userSettingsObj.hEquipmentType == 0 && userSettingsObj.hFuelType == 0))
		){
			displayStatus['pGas'] = true;
		}

		//oil
		//if furnace and oil selected
		if (
			contentType != 'cooling' &&
			((userSettingsObj.hEquipmentTypeExisting == 0 && userSettingsObj.hFuelTypeExisting == 1) ||
			(userSettingsObj.hEquipmentType == 0 && userSettingsObj.hFuelType == 1))
		){
			displayStatus['pOil'] = true;
		}

		//propane
		//if furnace and propane selected
		if (
			contentType != 'cooling' &&
			((userSettingsObj.hEquipmentTypeExisting == 0 && userSettingsObj.hFuelTypeExisting == 2) ||
			(userSettingsObj.hEquipmentType == 0 && userSettingsObj.hFuelType == 2))
		){
			displayStatus['pPropane'] = true;
		}

		//AFUE single
		if (userSettingsObj.hEquipmentTypeExisting == 0){
			displayStatus['hAFUEExistingSingle'] = true;
		}
		if (userSettingsObj.hEquipmentType == 0){
			displayStatus['hFuelType'] = true;
		}


		//set the classes for the input/dropdowns
		var thisElement;
		for (var k in displayStatus){
			//elements cannot be searched if display=none ?!?!?
			if (displayStatus[k] == true){
				thisElement = document.getElementById('row_' + k);
				if (thisElement){
					thisElement.classList.remove('inputInactive');
				}
			}
			else {
				thisElement = document.getElementById('row_' + k);
				if (thisElement){
					thisElement.classList.add('inputInactive');
				}
			}
		}
	}

	function updateAllGhosts(cityObj){
		/*updates ghost text with city data for electric, gas, oil, and propane*/
		updatePlaceholder('electric', cityObj);
		updatePlaceholder('gas', cityObj);
		updatePlaceholder('oil', cityObj);
		updatePlaceholder('propane', cityObj);
	}

	function updatePlaceholder(elementId, cityObj){
		/*updates ghost text in both the input box and the UserSettingsObj*/
		var thisInput = document.getElementById(elementId);
		thisInput.placeholder = cityObj.price[elementId];
		userSettingsObj[elementId + "Ghost"] = cityObj.price[elementId];
	}

	function setCalculatedData(price, hvacType) {

		/* Returns an object of the annual savings with inflation over time */
		var chartData;

		// Update created data if available
		if (calculatedData.hasOwnProperty(hvacType) && calculatedData[hvacType].hasOwnProperty("chartData")) {
			chartData = calculatedData[hvacType].chartData;
		} else {
			chartData = {
				"existingCost":[],
				"newCost":[],
				"diff":[],
				"savings":[],
				"max":null
			}
		}

		//set the cooling/heating property
		calculatedData[hvacType] = {
			"annualCostExisting": price['annualExisting'],
			"annualCostNew": price['annualNew'],
			"annualSavings": [],
			"chartData": chartData
		};

		//create the variables needed to calculate cumulative settings
		var thisYearCosts = {};
		var thisCostExisting = price['annualExisting'];
		var thisCostNew = price['annualNew'];
		var thisInflation = (price['inflation'] + 100) / 100;
		var thisDiff = thisCostExisting - thisCostNew;
		var totalSavings = 0;
		var totalCostExisting = thisCostExisting;

		//loop through each year, saving cumulative savings to  an array
		for (i = 1; i <= 20; i++) {
			thisCostExisting = parseInt( (i == 1 ? thisCostExisting : thisCostExisting * thisInflation) );
			thisCostNew = parseInt( (i == 1 ? thisCostNew : thisCostNew * thisInflation) );
			thisDiff = parseInt(thisCostExisting - thisCostNew);
			totalSavings += thisDiff;
			totalCostExisting += thisCostExisting;

			thisYearCosts = {
				"year": i,
				"annualCostExisting": thisCostExisting,
				"annualCostNew": thisCostNew,
				"annualCostDifference": thisDiff,
				"cumulativeSavings": totalSavings,
				"cumulativeSavingPercent":  parseInt( 100 * (totalSavings/totalCostExisting) )
			};
			calculatedData[hvacType]['annualSavings'].push(thisYearCosts);

			if (i < 11) {
				if (chartInitialized == false) {
					//console.log("Created new Chart");
					calculatedData[hvacType]['chartData']['existingCost'].push(thisCostExisting);
					calculatedData[hvacType]['chartData']['newCost'].push(thisCostNew);
					calculatedData[hvacType]['chartData']['diff'].push(thisDiff);
					calculatedData[hvacType]['chartData']['savings'].push(totalSavings);
					calculatedData[hvacType]['chartData']['max'] = calculatedData[hvacType].chartData.savings[9];
				} else {
					//console.log("Updating existing chart data.");
					calculatedData[hvacType]['chartData']['existingCost'][i-1] = thisCostExisting;
					calculatedData[hvacType]['chartData']['newCost'][i-1] = thisCostNew;
					calculatedData[hvacType]['chartData']['diff'][i-1] = thisDiff;
					calculatedData[hvacType]['chartData']['savings'][i-1] = totalSavings;

					if (calculatedData[hvacType].chartData.max < calculatedData[hvacType].chartData.savings[9]) {
						//console.log("New Max value == " + calculatedData[hvacType].chartData.savings[9]);
						calculatedData[hvacType].chartData.max = calculatedData[hvacType].chartData.savings[9];
					}
				}
			}
		}

		//console.log(calculatedData);
	}

	function updateChart() {
		var ctx = document.getElementById('timeline').getContext('2d');

		if (chartInitialized == false) {
			console.log("Initializing chart");
			var barChartData = {
				labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
				datasets: [
					{
						label: 'Existing Cost',
						backgroundColor: chartColors.red,
						stack: 'Stack 1',
						data: calculatedData[contentType]['chartData']['existingCost']
					},
					{
						label: 'New Cost',
						backgroundColor: chartColors.blue,
						stack: 'Stack 0',
						data: calculatedData[contentType]['chartData']['newCost']
					},
					{
						label: 'Difference',
						backgroundColor: chartColors.grey,
						stack: 'Stack 0',
						data: calculatedData[contentType]['chartData']['diff']
					},
					{
						label: 'Savings',
						backgroundColor: chartColors.green,
						stack: 'Stack 2',
						data: calculatedData[contentType]['chartData']['savings']
					}
				]
			};

			chartInstance = new Chart(ctx, {
				type: 'bar',
				data: barChartData,
				options: {
					"animation":  {
						"duration": 2000,
						"easing":'easeInOutQuint'
					},
					"scaleLabel":
						function(label){return  '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");},
					"title": {
						"display": true,
						"text": 'Projected Costs & Cumulative Savings'
					},
					"tooltips": {
						"mode": 'label',
						"intersect": false
					},
					"responsive": true,
					"scales": {
						"xAxes": [{
							// stacked: true
						}],
						"yAxes": [{
							// stacked: true,
							"beginAtZero":true,
							"ticks": {
								"userCallback":
									function(value, index, values) {
									// Convert the number to a string and splite the string every 3 charaters from the end
									value = value.toString();
									value = value.split(/(?=(?:...)*$)/);
									// Convert the array to a string and format the output
									value = value.join(',');
									return '$' + value;
								},
								// "suggestedMin": 100,
								// "suggestedMax": 5000
								"max":calculatedData[contentType].chartData.max
							}
						}]
					}
				}
			});

			chartInitialized = true;
		} else {
			console.log("Updating chart");
			chartInstance.config.data.datasets[0].data = calculatedData[contentType].chartData.existingCost;
			chartInstance.config.data.datasets[1].data = calculatedData[contentType].chartData.newCost;
			chartInstance.config.data.datasets[2].data = calculatedData[contentType].chartData.diff;
			chartInstance.config.data.datasets[3].data = calculatedData[contentType].chartData.savings;

			chartInstance.config.options.scales.yAxes[0].ticks.max = calculatedData[contentType].chartData.max;
			chartInstance.update();
		}
	}

	init();

	// Public Accessors
	return {
		"init":init,
		"ddChange":ddChange,
		"inputChange":inputChange,
		"toggleMode":toggleMode,
	}
})()