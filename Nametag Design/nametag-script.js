const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasRect = canvas.getBoundingClientRect(); // Canvas size info relative to viewport
let offsetX, offsetY;
let isDragging = false;
let isResizing = false;
let selectedItem = null;
let copiedItem = null;
let items = [];

let undoStack = [];
let redoStack = [];
const MAX_HISTORY = 20;

const selectedCorners = [false, false, false, false]; // Tracks whether top-left, top-right, bottom-left, or bottom-right corner of rect is selected, respectively.
const RADIUS_BUFFER = 5; // Pixel thickness along circumference of circle which can be grabbed to resize.
const RECT_BUFFER = 10;  // Pixel thickness along perimeter of rectangle which can be grabbed to resize.
const TEXT_SIZE_LOWER_BOUND = 10;
const TEXT_SIZE_UPPER_BOUND = 150;
const CANVAS_SIZE_LOWER_BOUND = 100;
const CANVAS_SIZE_UPPER_BOUND = 2000;

function exportImage() {
	const dataURL = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.href = dataURL;
	const filename = checkFileName();
	link.download = document.getElementById("nametag-title").value;
	link.click();
}

function checkFileName() {
	let titleText = document.getElementById("nametag-title").value
	if (titleText == null || titleText === "") return "nametag_template";
	const regex = /[<>:"|?*\x00-\x1F#%&{}$!'`+=/\\]/g;
	let filename = titleText.replace(regex, "_");
	if (filename.length > 255) return filename.substring(0, 255);
	return filename;
}

function saveState() {
	undoStack.push(JSON.parse(JSON.stringify(items))); // Save deep copy of all items currently on canvas.
	if (undoStack.length >= MAX_HISTORY) undoStack.shift(); // Remove first (and oldest) saved state if length exceeds max history.
	redoStack = [];
}

function undo() {
	if (undoStack.length > 0) {
		redoStack.push(JSON.parse(JSON.stringify(items)));
		console.log(undoStack[undoStack.length - 1]);
		items = undoStack.pop();
		selectedItem = null;
		drawItems();
	}
}

function redo() {
	if (redoStack.length > 0) {
		undoStack.push(JSON.parse(JSON.stringify(items)));
		items = redoStack.pop();
		selectedItem = null;
		drawItems();
	}
}

function cut() {
	copy();
	remove();
}

function copy() {
	if (!selectedItem) return;
	switch (selectedItem.type) {
		case "circle":
			copiedItem = {type: "circle", x: selectedItem.x, y: selectedItem.y, radius: selectedItem.radius, color: selectedItem.color};
			break;
		case "rect":
			copiedItem = {type: "rect", x: selectedItem.x, y: selectedItem.y, width: selectedItem.width, height: selectedItem.height, color: selectedItem.color};
			break;
		case "image":
			copiedItem = {type: "image", image: selectedItem.image, x: selectedItem.x, y: selectedItem.y, width: selectedItem.width, height: selectedItem.height};
			break;
		case "text":
			copiedItem = {type: "text", text: selectedItem.text, size: selectedItem.size, font: selectedItem.font, x: selectedItem.x, y: selectedItem.y, width: selectedItem.width, height: selectedItem.height, color: selectedItem.color, bold: "", italic: ""};
	}
}

function paste() {
	saveState();
	copiedItem.x = canvas.width / 2;
	copiedItem.y = canvas.height / 2;
	items.push(copiedItem);
	copy();
	drawItems();
}

function remove() {
	saveState();
	items.splice(items.indexOf(selectedItem), 1);
	drawItems();
}

function clearCanvas() {
	if (!confirm("Clearing the canvas will remove everything. Are you sure you want to continue?")) return;
	saveState();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	items = [];
}

function setCanvasX() {
	let canvasWidth = document.getElementById("canvas-x").value;
	if (isNaN(parseInt(canvasWidth))) return;
	if (canvasWidth > CANVAS_SIZE_UPPER_BOUND) canvasWidth = CANVAS_SIZE_UPPER_BOUND;
	else if (canvasWidth < CANVAS_SIZE_LOWER_BOUND) canvasWidth = CANVAS_SIZE_LOWER_BOUND;
	canvas.width = canvasWidth;
}

function setCanvasY() {
	let canvasHeight = document.getElementById("canvas-y").value;
	if (isNaN(parseInt(canvasHeight))) return;
	if (canvasHeight > CANVAS_SIZE_UPPER_BOUND) canvasHeight = CANVAS_SIZE_UPPER_BOUND;
	else if (canvasHeight < CANVAS_SIZE_LOWER_BOUND) canvasHeight = CANVAS_SIZE_LOWER_BOUND;
	canvas.height = canvasHeight;
}

function addCircle(circleX, circleY, circleRadius, circleColor) {
	saveState();
	items.push({type: "circle", x: circleX, y: circleY, radius: circleRadius, color: circleColor});
	drawItems();
}

function addRect(rectX, rectY, rectWidth, rectHeight, rectColor) {
	saveState();
	items.push({type: "rect", x: rectX, y: rectY, width: rectWidth, height: rectHeight, color: rectColor});
	drawItems();
}

function addText(content, textSize, textFont, textX, textY, textColor) {
	saveState();
	items.push({type: "text", text: content, size: textSize, font: textFont, x: textX, y: textY, width: "", height: "", color: textColor, bold: "", italic: ""});
	drawItems();
}

document.getElementById("image-selector").addEventListener("change", (e) => {
	saveState();
	const img = new Image;
	img.src = URL.createObjectURL(e.target.files[0]);
	img.onload = function() {
		items.push({type: "image", image: img, x: 0, y: 0, width: img.width, height: img.height});
		drawItems();
	}
});

function drawItems() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = document.getElementById("background-color").value;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	items.forEach(item => {
		if (item.type === "image") ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
		else if (item.type === "text") {
			ctx.fillStyle = item.color;
			ctx.font = item.italic + item.bold + item.size + "px " + item.font;
			ctx.fillText(item.text, item.x, item.y);
			let textInfo = ctx.measureText(item.text);
			let fontHeight = textInfo.fontBoundingBoxAscent + textInfo.fontBoundingBoxDescent;
			item.width = textInfo.width;
			item.height = fontHeight;
		}
		else {
			ctx.beginPath();
			ctx.fillStyle = item.color;
			ctx.strokeStyle = item.color;
			if (item.type === "circle") ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
			else if (item.type === "rect") ctx.rect(item.x, item.y, item.width, item.height);
			ctx.fill();
			ctx.stroke();
		}
	});

	if (!selectedItem) hideUIDisplay();
}

function hideUIDisplay() {
	const colorElements = document.getElementsByClassName("color-selector");
	for (let i = 0; i < colorElements.length; i++) {
		colorElements[i].style = "display: none;";
	}
	document.getElementById("text-editor").style = "display: none;";
}

function changeItemColor() {
	if (selectedItem) {
		saveState();
		selectedItem.color = document.getElementById("shape-color").value;
		drawItems();
	}
}

function changeFont() {
	if (selectedItem.type !== "text") return;
	saveState();
	selectedItem.font = document.getElementById("fonts").value;
	drawItems();
}

function changeTextSize() {
	if (selectedItem.type !== "text") return;
	saveState();
	let textField = document.getElementById("text-sizes").value;
	if (textField > TEXT_SIZE_UPPER_BOUND) textField = TEXT_SIZE_UPPER_BOUND;
	else if (textField < TEXT_SIZE_LOWER_BOUND) textField = TEXT_SIZE_LOWER_BOUND;
	selectedItem.size = textField;
	drawItems();
}

function setText() {
	if (selectedItem.type !== "text") return;
	saveState();
	let content = document.getElementById("text-content").value;
	if (content === "") selectedItem.text = "Sample Text";
	else selectedItem.text = content;
	drawItems();
}

function setBold() {
	if (selectedItem.type !== "text") return;
	saveState();
	let checked = document.getElementById("bold").checked;
	if (checked) selectedItem.bold = "bold ";
	else		 selectedItem.bold = "";
	drawItems();
}

function setItalic() {
	if (selectedItem.type !== "text") return;
	saveState();
	let checked = document.getElementById("italic").checked;
	if (checked) selectedItem.italic = "italic ";
	else		 selectedItem.italic = "";
	drawItems();
}

function getItemUnderMouse(mouseX, mouseY) {
	for (let i = items.length - 1; i > -1; i--) {
		const item = items[i];
		if (item.type === "circle") { // Check that cursor's distance from circle's coordinates does not exceed radius.
			if (Math.sqrt((mouseX - item.x) ** 2 + (mouseY - item.y) ** 2) <= item.radius) return item;
		}
		else if (item.type === "rect" || item.type === "image") { // Check that cursor is between all four sides of the rect/image.
			if (mouseX >= item.x && mouseX <= item.x + item.width && mouseY >= item.y && mouseY <= item.y + item.height) return item;
		}
		else if (item.type === "text") { // Same logic as checking rect/image but modified for text.
			if (mouseX >= item.x && mouseX <= item.x + item.width && mouseY <= item.y && mouseY >= item.y - item.height) return item;
		}
	}
	return null;
}

canvas.addEventListener("mousedown", (e) => {
	const mouseX = e.pageX - canvasRect.left;	// pageX and pageY used; cursor position found with respect to page instead of viewport (to account for scrolling).
	const mouseY = e.pageY - canvasRect.top;
	const item = getItemUnderMouse(mouseX, mouseY);

	if (item) {
		if (item.type === "circle") {
			const distance = Math.sqrt((mouseX - item.x) ** 2 + (mouseY - item.y) ** 2);
			if (distance <= item.radius && distance > item.radius - RADIUS_BUFFER) isResizing = true;
			else isDragging = true;
		}
		else if (item.type === "rect" || item.type === "image") {
			if ((mouseX < item.x + RECT_BUFFER && mouseY < item.y + RECT_BUFFER) || (mouseX > item.x + item.width - RECT_BUFFER && mouseY < item.y + RECT_BUFFER) ||
					(mouseX < item.x + RECT_BUFFER && mouseY > itesm.y + item.height - RECT_BUFFER) || (mouseX > item.x + item.width - RECT_BUFFER && mouseY > item.y + item.height - RECT_BUFFER)) {
				isResizing = true;
				let cornerIndex = 0;
				cornerIndex = mouseY < item.y + (item.height / 2) ? 0 : 2;
				cornerIndex += mouseX < item.x + (item.width / 2) ? 0 : 1;
				selectedCorners[cornerIndex] = true;
			}
			else if (mouseX > item.x && mouseX < item.x + item.width && mouseY > item.y && mouseY < item.y + item.height) isDragging = true;
		}
		else if (item.type === "text") {
			let textInfo = ctx.measureText(item.text);
			let fontHeight = textInfo.fontBoundingBoxAscent + textInfo.fontBoundingBoxDescent;
			isDragging = true;
			document.getElementById("bold").checked = item.bold === "bold " ? true : false;
			document.getElementById("italic").checked = item.italic === "italic " ? true : false;
		}
		saveState();
		selectedItem = item;

		document.getElementById("text-editor").style = item.type === "text" ? "display: inline;" : "display: none;";

		document.getElementById("shape-color").value = selectedItem.color;
		const colorElements = document.getElementsByClassName("color-selector");
		uiDisplay = item.type !== "image" ? "inline" : "none";
		for (let i = 0; i < colorElements.length; i++) {
			colorElements[i].style = "display: " + uiDisplay + ";";
		}

		offsetX = mouseX - item.x;
		offsetY = mouseY - item.y;

		// Selected item will be moved to top layer of canvas.
		items = items.filter(i => i !== item);
		items.push(item);
		drawItems();
	}
});

canvas.addEventListener("mousemove", (e) => {
	if (!isDragging && !isResizing) return;

	const mouseX = e.pageX - canvasRect.left;
	const mouseY = e.pageY - canvasRect.top;

	if (isDragging) {
		selectedItem.x = mouseX - offsetX;
		selectedItem.y = mouseY - offsetY;
	}
	else if (isResizing && selectedItem.type === "circle") {
		const distance = Math.sqrt((mouseX - selectedItem.x) ** 2 + (mouseY - selectedItem.y) ** 2);
		if (distance < selectedItem.radius) selectedItem.radius -= selectedItem.radius - distance;
		else if (distance > selectedItem.radius) selectedItem.radius += distance - selectedItem.radius;
	}
	else if (isResizing && (selectedItem.type === "rect" || selectedItem.type === "image")) {
		if (selectedCorners[0]) { // Top-left corner
			selectedItem.width += selectedItem.x - mouseX;
			selectedItem.x = mouseX;
			selectedItem.height += selectedItem.y - mouseY;
			selectedItem.y = mouseY;
		}
		else if (selectedCorners[1]) { // Top-right corner
			selectedItem.width += (mouseX - selectedItem.x) - selectedItem.width;
			selectedItem.height += selectedItem.y - mouseY;
			selectedItem.y = mouseY;
		}
		else if (selectedCorners[2]) { // Bottom-left corner
			selectedItem.width += selectedItem.x - mouseX;
			selectedItem.x = mouseX;
			selectedItem.height += mouseY - (selectedItem.height + selectedItem.y);
		}
		else if (selectedCorners[3]) { // Bottom-right corner
			selectedItem.width += (mouseX - selectedItem.x) - selectedItem.width;
			selectedItem.height += mouseY - (selectedItem.height + selectedItem.y);
		}
	}
	drawItems();
});

canvas.addEventListener("mouseup", finalizeCanvas);
canvas.addEventListener("mouseleave", finalizeCanvas); // Prevents dragging items outside canvas.

function finalizeCanvas() {
	if (!selectedItem) return;
	isDragging = isResizing = false;
	const index = selectedCorners.indexOf(true);
	if (index != -1) selectedCorners[index] = false;
	if (selectedItem.width < 0 && (selectedItem.type === "rect" || selectedItem.type === "image")) {
		selectedItem.width = Math.abs(selectedItem.width);
		selectedItem.x -= selectedItem.width;
	}
	if (selectedItem.height < 0 && (selectedItem.type === "rect" || selectedItem.type === "image")) {
		selectedItem.height = Math.abs(selectedItem.height);
		selectedItem.y -= selectedItem.height;
	}
	drawItems();
}

document.getElementById("file-button").addEventListener("click", (e) => showComboBox("file-options", "edit-options", "insert-options", e));
document.getElementById("edit-button").addEventListener("click", (e) => showComboBox("edit-options", "file-options", "insert-options", e));
document.getElementById("insert-button").addEventListener("click", (e) => showComboBox("insert-options", "file-options", "edit-options", e));

function showComboBox(display, hide1, hide2, e) {
	const visibility = document.getElementById(display).style.display;
	if (visibility === "none" || visibility === "") {
		document.getElementById(hide1).style.display = "none";
		document.getElementById(hide2).style.display = "none";
	}
	document.getElementById(display).style.display = (visibility === "flex") ? "none" : "flex";
	e.stopPropagation();
}

document.addEventListener("click", (e) => {
	if (e.target && e.target.id !== "file-options" && e.target.id !== "edit-options" && e.target.id !== "insert-options")
	{
		document.getElementById("file-options").style.display = "none";
		document.getElementById("edit-options").style.display = "none";
		document.getElementById("insert-options").style.display = "none";
	}
});