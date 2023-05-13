document.addEventListener('DOMContentLoaded', () => {
    let selectedWidget = null;
	const widgetQuantities = {button: 0, text: 0, gauge: 0, dial: 0, trend: 0};
    const guiContainer = document.getElementById('gui-container');


	/*
	-----------------------------------------------------------
		GUI configuration toolbar
	-----------------------------------------------------------
	*/
	const widgetDefaults = {
        button: { width: 80, height: 40, fillColor: '#808080', textColor: '#000000', borderColor: '#D3D3D3', xPos: 0, yPos: 0 },
        text: { width: 80, height: 40, fillColor: '#FFFFFF', textColor: '#A9A9A9', borderColor: '#000000', xPos: 0, yPos: 0 },
        gauge: { width: 20, height: 80, fillColor: '#0000FF', textColor: '#FFFFFF', borderColor: '#000000', xPos: 0, yPos: 0 },
        dial: { width: 90, height: 90, fillColor: '#FFFFFF', textColor: '#000000', borderColor: '#000000', xPos: 45, yPos: 45 },
        trend: { width: 100, height: 50, fillColor: '#D3D3D3', textColor: '#000000', borderColor: '#000000', xPos: 0, yPos: 0 },
    };

	document.getElementById('widget-type').addEventListener('change', function() {
		const type = this.value;
		if (widgetDefaults[type]) {
			resetSelection();
			document.getElementById('widget-x-pos').value = widgetDefaults[type].xPos;
			document.getElementById('widget-y-pos').value = widgetDefaults[type].yPos;
			document.getElementById('widget-width').value = widgetDefaults[type].width;
			document.getElementById('widget-height').value = widgetDefaults[type].height;
			document.getElementById('widget-fill-color').value = widgetDefaults[type].fillColor;
			document.getElementById('widget-text-color').value = widgetDefaults[type].textColor;
			document.getElementById('widget-border-color').value = widgetDefaults[type].borderColor;
		}
	});

    document.getElementById('gui-update').addEventListener('click', () => {
        const width = document.getElementById('gui-width').value;
        const height = document.getElementById('gui-height').value;
        const color = document.getElementById('gui-color').value;
        
        guiContainer.style.width = `${width}px`;
        guiContainer.style.height = `${height}px`;
        guiContainer.style.backgroundColor = color;
    });


	/*
	-----------------------------------------------------------
		Widget configuration toolbar
	-----------------------------------------------------------
	*/
	// Create a widget or Update selected widget
    document.getElementById('widget-create-update').addEventListener('click', () => {
        if (selectedWidget) {
			const type = document.getElementById('widget-type').value;
			const width = document.getElementById('widget-width').value || widgetDefaults[type].width;
			const height = document.getElementById('widget-height').value || widgetDefaults[type].height;
			const fillColor = document.getElementById('widget-fill-color').value || widgetDefaults[type].fillColor;
			const textColor = document.getElementById('widget-text-color').value || widgetDefaults[type].textColor;
			const borderColor = document.getElementById('widget-border-color').value || widgetDefaults[type].borderColor;
			const xPos = document.getElementById('widget-x-pos').value || widgetDefaults[type].xPos;
			const yPos = document.getElementById('widget-y-pos').value || widgetDefaults[type].yPos;

			// Update the selected widget
            selectedWidget.style.width = `${width}px`;
            selectedWidget.style.height = `${height}px`;
            selectedWidget.style.backgroundColor = fillColor;
            selectedWidget.style.color = textColor;
            selectedWidget.style.borderColor = borderColor;
            selectedWidget.style.left = (type === "dial")? `${xPos-(width/2)}px` : `${xPos}px`;
            selectedWidget.style.top = (type === "dial")? `${yPos-(width/2)}px` : `${yPos}px`;


        } else {
			createWidget();						
        }
    });

	// Function to create a widget with the properties selected in the
	// widget configuration toolbar
	function createWidget(){
        const type = document.getElementById('widget-type').value;
        const width = document.getElementById('widget-width').value || widgetDefaults[type].width;
        const height = document.getElementById('widget-height').value || widgetDefaults[type].height;
        const fillColor = document.getElementById('widget-fill-color').value || widgetDefaults[type].fillColor;
        const textColor = document.getElementById('widget-text-color').value || widgetDefaults[type].textColor;
        const borderColor = document.getElementById('widget-border-color').value || widgetDefaults[type].borderColor;
        const xPos = document.getElementById('widget-x-pos').value || widgetDefaults[type].xPos;
        const yPos = document.getElementById('widget-y-pos').value || widgetDefaults[type].yPos;

		const widget = document.createElement('div');
		widget.setAttribute('type',type);
		widget.classList.add('widget');
		widget.style.width = `${width}px`;
		widget.style.height = `${height}px`;
		widget.style.backgroundColor = fillColor;
		widget.style.color = textColor;
		widget.style.left = (type === "dial")? `${xPos-(width/2)}px` : `${xPos}px`;
		widget.style.top = (type === "dial")? `${yPos-(width/2)}px` : `${yPos}px`;
		widget.style.position = 'absolute';
		widget.style.border = '1px solid '+borderColor;
		if(type==='dial'){
			widget.style.borderRadius = '50%';
		}
		widget.innerHTML = type + "-" + widgetQuantities[type];
		widget.id = widget.innerHTML;
		guiContainer.appendChild(widget);

					
		widget.addEventListener('click', () => {
			selectedWidget = widget;

			const xPos = parseInt(widget.style.left) || 0;
			const yPos = parseInt(widget.style.top) || 0;
			const width = parseInt(widget.style.width) || widgetDefaults[type].width;
			const height = parseInt(widget.style.height) || widgetDefaults[type].height;
			const fillColor = rgbToHex(widget.style.backgroundColor) || widgetDefaults[type].fillColor;
			const textColor = rgbToHex(widget.style.color) || widgetDefaults[type].textColor;
			const borderColor = rgbToHex(widget.style.borderColor) || widgetDefaults[type].borderColor;

			document.getElementById('widget-type').value = type;
			document.getElementById('widget-x-pos').value = (type === "dial") ? xPos + (width/2) : xPos;
			document.getElementById('widget-y-pos').value = (type === "dial") ? yPos + (width/2) : yPos;
			document.getElementById('widget-width').value = width;
			document.getElementById('widget-height').value = height;
			document.getElementById('widget-fill-color').value = fillColor;
			document.getElementById('widget-text-color').value = textColor;
			document.getElementById('widget-border-color').value = borderColor;
		});

		widgetQuantities[type]++;
	}

	// Duplicate selected Widget
	document.getElementById('widget-duplicate').addEventListener('click', function(){
		if(selectedWidget){
			createWidget();
		}
	});

	// Remove selected widget
	document.getElementById('remove-widget').addEventListener('click', function() {
		if (selectedWidget) {
			guiContainer.removeChild(selectedWidget);
			widgetQuantities[selectedWidget.getAttribute("type")]--;

			selectedWidget = null;

			// Reset widget configuration toolbar
			document.getElementById('widget-type').value = '';
			document.getElementById('widget-x-pos').value = '';
			document.getElementById('widget-y-pos').value = '';
			document.getElementById('widget-width').value = '';
			document.getElementById('widget-height').value = '';
			document.getElementById('widget-fill-color').value = '';
			document.getElementById('widget-text-color').value = '';
			document.getElementById('widget-border-color').value = '';

		}
	});


	// Reset selectedWidget when clicking anywhere in the GUI container but not on a widget
	guiContainer.addEventListener('click', (e) => {
		if (e.target === guiContainer) {
			document.getElementById('widget-type').value = '';
			resetSelection();
		}
	});
	
	function resetSelection(){
		selectedWidget = null;
		document.getElementById('widget-x-pos').value = '';
		document.getElementById('widget-y-pos').value = '';
		document.getElementById('widget-width').value = '';
		document.getElementById('widget-height').value = '';
		document.getElementById('widget-fill-color').value = '#000000';
		document.getElementById('widget-text-color').value = '#000000';
		document.getElementById('widget-border-color').value = '#000000';		
	}

	// Dragging widgets code
	let isDragging = false;
	let offsetX = 0, offsetY = 0;

	guiContainer.addEventListener('mousedown', function(e) {
		if (e.target.classList.contains('widget')) {
				isDragging = true;
				selectedWidget = e.target;
				offsetX = e.clientX - e.target.offsetLeft;
				offsetY = e.clientY - e.target.offsetTop;
		}
	});

	guiContainer.addEventListener('mouseup', function() {
		isDragging = false;
	});

	guiContainer.addEventListener('mousemove', function(e) {
		if (selectedWidget && isDragging) {
			const gridSize = parseInt(document.getElementById('grid-size').value) || 10;

			// Snap the widget position to the nearest grid
			const snappedX = Math.round((e.clientX - offsetX) / gridSize) * gridSize;
			const snappedY = Math.round((e.clientY - offsetY) / gridSize) * gridSize;

			// Ensure the widget stays within the boundaries of the GUI container
			const maxX = guiContainer.clientWidth - selectedWidget.clientWidth;
			const maxY = guiContainer.clientHeight - selectedWidget.clientHeight;
			const x = Math.min(Math.max(snappedX, 0), maxX);
			const y = Math.min(Math.max(snappedY, 0), maxY);

			selectedWidget.style.left = x + 'px';
			selectedWidget.style.top = y + 'px';
		}
	});	
	

	/*
	-----------------------------------------------------------
		Code area
	-----------------------------------------------------------
	*/
	// Create code list
	/*
		gui.init(bg_color, fg_color, ol_color, orientation, calibration?)
		screen[id].configure(id, x, y, width, height, bg_color, fg_color, ol_color)
		numkey.configure(0, x, y, width, height, bg_color, fg_color, ol_color)
		image[id].set_image(@banner, width, height)
		image[id].configure(id, x, y, bg_color, fg_color, ol_color)
		terminal.configure(id, x, y, width, height, bg_color, fg_color, ol_color)
		trend[id].configure(id,@trend_values_array, MAX_DATA_VALUES, x, y, width, height, bg_color, fg_color, ol_color)
		
		Done --
		**button[id].configure(id, x, y, width, height, bg_color, fg_color, ol_color)
		**gauge[id].configure(id, x, y, width, height, bg_color, fg_color, ol_color)
		**text[id].configure(id, x, y, width, height, bg_color, fg_color, ol_color)
		**dial[id].configure(id, x, y, radius, bg_color, fg_color, ol_color)

	*/
	document.getElementById("show-code-button").addEventListener('click',function(){
		let widgets = guiContainer.children;
		let widgetList = document.getElementById("widgets-list");
		widgetList.innerHTML = '';

		if(widgets.length > 0){
			for (let w of widgets){
				let listItem = document.createElement("li");
				let type = w.getAttribute("type"); 
				if ( type === "button" || type === "gauge" || type === "text"){
					let id = w.id.match(/\d+/g);
					listItem.innerHTML = 
					type + "[" + id + "]" + 
					".configure(" + id +
					", " + w.style.left.match(/\d+/g)[0] +
					", " + w.style.top.match(/\d+/g)[0] +
					", " + w.style.width.match(/\d+/g)[0] +
					", " + w.style.height.match(/\d+/g)[0] +
					", " + rgbToP2(w.style.backgroundColor) +
					", " + rgbToP2(w.style.color) +
					", " + rgbToP2(w.style.borderColor) +
					")"; 
				}
				if (type === "dial"){
					let radius = parseInt(w.style.width.match(/\d+/g)[0],10) / 2;
					let xc = parseInt(w.style.left.match(/\d+/g)[0],10) + radius;
					let yc = parseInt(w.style.top.match(/\d+/g)[0],10) + radius;
					listItem.innerHTML = 
					type + "[" + w.id.match(/\d+/g) + "]" + 
					".configure(" + w.id.match(/\d+/g) +
					", " + xc +
					", " + yc +
					", " + radius +
					", " + rgbToP2(w.style.backgroundColor) +
					", " + rgbToP2(w.style.color) +
					", " + rgbToP2(w.style.borderColor) +
					")"; 					
				}
				if (type === "trend"){
					let id = w.id.match(/\d+/g);
					listItem.innerHTML = 
					type + "[" + id + "]" + 
					".configure(" + id +
					", @trend_values_array, MAX_TREND_VALUES" +
					", " + w.style.left.match(/\d+/g)[0] +
					", " + w.style.top.match(/\d+/g)[0] +
					", " + w.style.width.match(/\d+/g)[0] +
					", " + w.style.height.match(/\d+/g)[0] +
					", " + rgbToP2(w.style.backgroundColor) +
					", " + rgbToP2(w.style.color) +
					", " + rgbToP2(w.style.borderColor) +
					")"; 					
				}				
				widgetList.appendChild(listItem);
			}
		}
	});
});

// Function to create color string for P2
function rgbToP2(rgb){
	const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
	return result ? "color.set_color(" + 
	parseInt(result[1], 10).toString() + 
	"," + parseInt(result[2],10).toString() + 
	"," + parseInt(result[3],10).toString() + 
	")" : null;
}

function rgbToHex(rgb) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result ? "#" +
        ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[3], 10).toString(16)).slice(-2) : null;
}