/* 
	CRISTOBAL CHAO 
	http://cristobalchao.com
*/

/* Basic JS functions for classes */
function hasClass(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
  }
}

function removeAllClasses(array,cls){
	for (var i = 0; i < array.length; i++){
		removeClass(array[i],cls);
	}
}

/* Get position of the object */
function getPosition(e){
	var left = 0,
		top  = 0;
	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
	}
	left += e.offsetLeft;
	top  += e.offsetTop;
	return {x:left, y:top};
}

var arrayImages = imageFilenames;

console.log(arrayImages);

/* Declaring main Object */
var Layout = function(){
	this.container_images = []; 							// Array to store all the containers of the images
	this.images = [];										// Array to store all the images
	this.dragObject = null;									// Object that is being dragged
	this.posWhileDrag = null;								// Mouse position while dragging
	this.swapObject = null;									// Object that is going to be swapped
	this.offsetX = null;									// Dragging cursor's X-position with respect to the image 
	this.offsetY = null;									// Dragging cursor's Y-position with respect to the image 
	this.IMAGEFOLDER = 'images/';							// Folder of the images
	this.browser = navigator.userAgent.toLowerCase();		// Info of the browser that is being used
	this.safari = (this.browser.indexOf('safari') > -1);		//Safari
	this.opera = (this.browser.indexOf('opera') > -1);			//Opera
}

/* Method of main Object */
Layout.prototype = {
	overlapping: function(object){		//Function that detect overlapping while dragging
		if (!!!object) return;

		for (var i = 0; i < this.container_images.length; i++){
			var posX = parseInt(this.container_images[i].getAttribute('x')),
			posY = parseInt(this.container_images[i].getAttribute('y')),
			posXY = parseInt(this.container_images[i].offsetHeight) + posX,
			posYX = parseInt(this.container_images[i].offsetWidth) + posY;

			posObjX = parseInt(object.x);
			posObjY = parseInt(object.y);


			if (posObjX > posX && posObjX < posXY && posObjY > posY &&   posObjY < posYX){
				this.swapObject = this.container_images[i];
				removeAllClasses(this.container_images, 'hover');
				addClass(this.container_images[i], 'hover');
			}
		}
	},
	swapElements: function(obj1, obj2) {	//Function that swaps two objects in the DOM
    	var temp = document.createElement("div");
    	obj1.parentNode.insertBefore(temp, obj1);
    	obj2.parentNode.insertBefore(obj1, obj2);
    	temp.parentNode.insertBefore(obj2, temp);
    	temp.parentNode.removeChild(temp);
	},
	linkTriggers: function(object){			//Function that associate the triggers to the objects ( Drag/Drop to the images ) 
		var that = this;

		object.ondragend  = function(e){	//Event fired when DROP
			that.dragObject.style.top = 0;
			that.dragObject.style.left = 0;

			if (that.swapObject != that.dragObject){
				that.swapElements(that.dragObject,that.swapObject.childNodes[0]);
			}
			
			that.offsetX = null;
			that.offsetY = null;
			that.dragObject = null;
			removeAllClasses(that.container_images, 'hover');
		}

		object.ondragover  = function(e){	//Event fired when DRAG - Functional support between browsers
			if (that.safari || that.opera){
				return false;
			}
		}

		object.ondrag = function(ev){			//Event fired while DRAGGING
			that.overlapping(that.posWhileDrag);
			that.dragObject = this;

		}

		document.ondragover = function(evt) {	//Event fired when DRAG
			evt = evt || window.event;

			that.posWhileDrag = {
				x: evt.pageX,
				y: evt.pageY
			}

			!!!that.offsetX && (that.offsetX = that.posWhileDrag.x)
			!!!that.offsetY && (that.offsetY = that.posWhileDrag.y);

			if (that.dragObject){
				var x = parseInt(that.posWhileDrag.x) - that.offsetX;
				y = parseInt(that.posWhileDrag.y) - that.offsetY;

				that.dragObject.style.left = x+'px';
				that.dragObject.style.top = y+'px';
			}
		}

		window.onresize = function(){			//Event fired when the window is being resized. It helps for the responsiveness.
			for( var i = 0; i < that.container_images.length; i++){
				that.savePosition(that.container_images[i]);
			}
 		}
	},
	savePosition: function(object){				//Saving position of the Object ( For containers )
		var pos = getPosition(object);
		object.setAttribute('x', pos.x);
		object.setAttribute('y', pos.y);
	},
	createLayout: function(arrayImages){		//Create Layout for the Images
		for( var i = 0; i < arrayImages.length; i++){
			var new_container = document.createElement('div'),
				new_image = document.createElement('img');
			new_container.className = 'image-container';
			new_image.src = this.IMAGEFOLDER + arrayImages[i];
			document.getElementById('container').appendChild(new_container);
			new_container.appendChild(new_image);

			this.linkTriggers(new_image);

			this.savePosition(new_container);
			this.container_images.push(new_container);
			this.images.push(new_image);
		}
	},
	init: function(){						//Initializing Layout
		this.createLayout(arrayImages);		
	}
}

//Running Object
var l = new Layout();
l.init();
