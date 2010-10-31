function DOMSerializer(node) {
  this.node = node;
}

DOMSerializer._getImageData = function(src, callback) {
  var img = new Image();
  img.onload = function() {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    
    var dataURL = canvas.toDataURL("image/jpeg");
    callback.ok(dataURL);
  }
  img.onerror = function() {
    callback.err("getImageData: Failed!");
  }
  img.src = src;
}

  
  // Process each rules function for the node sequentially
  //   NOTE: This performs tail recursion on the rules array.
DOMSerializer.prototype._processNodeRules = function(node, rules, callback) {
  thisObj = this;

  var rule = rules.pop();
  if(rule) {
    rule(node, function() {
      thisObj._processNodeRules(node, rules, callback);
    })
  } else {
    callback();
  }
}

DOMSerializer.prototype.processNode = function(node, callback) {
  // Flatten node node with it own rules. Rule funcs defined below.
  var rules = [
  /*this.processorSTYLE <----- Not working */
  ]

  func = eval("this.processor"+node.tagName);
  if (func) {
    rules.push(func);
  }

  this._processNodeRules(node, rules, function() {
    callback(node);
  });
}

//
// Node processing functions.
//
DOMSerializer.prototype.processorIMG = function(node, callback) {
  DOMSerializer._getImageData(node.src, {
    ok: function(dataURL) {
      node.src = dataURL;
      callback();
    },
    err: function(msg) {
      callback()
    }
  })
}

/*
///////// WHY DOESN'T THIS WORK!!!!!! /////////////
DOMSerializer.prototype.processorSTYLE = function(node, callback) {
  var thisObj = this;
  
  var cssImgRules = [
  {rule: 'background-image'}
  ]
  
  // Some good old tail recursion!
  this.tail = function(node, cssRules, callback) {
    var cssRule = cssRules.pop();
    if(cssRule) {
      var ruleText = $(node).css(cssRule.rule);
      if(ruleText) {          
        var src = ruleText.replace(/^url\(/,"").replace(/\)$/, "");
        
        DOMSerializer._getImageData(src, {
          ok: function(dataURL) {
            $(node).css(cssRule.rule, dataURL);
            thisObj.tail(node, cssRules, callback);
          },
          err: function(msg) {
            console.error("Failed css rule.");
            thisObj.tail(node, cssRules, callback);
          }
        });
      }
    } else {
      console.log("callback!")
      callback();
    }
  }
  this.tail(node, cssImgRules, callback);
}  
*/


DOMSerializer.prototype.walkDOM = function(node, func, depth) {
  depth = ++depth || 0;
  func(node);

  node = node.firstChild;
    while (node) {
      this.walkDOM(node, func, depth);
      node = node.nextSibling;
    }
  };

// http://snipplr.com/view/19815/walking-the-dom
// TODO: This is stil bullshit!
DOMSerializer.prototype.flattenDOMTree = function(node, callback) {
  var nodeId = 1; // TIDY: To prevent a race condition (this is poor coding!)

  // Walk the dom.
  var thisObj = this;
  this.walkDOM(node, function(node) {
    nodeId++;
    thisObj.processNode(node, function() {
      nodeId--;
      if(nodeId == 0) {
        callback();
      }
    });
  });
  
  // TIDY: This is again some poor coding to support the above poor coding!
  nodeId--;
  if(nodeId == 0) {
    callback();
  }
}

DOMSerializer.prototype.cloneChildren = function(fromNode, toNode) {
  // Copy all child nodes.
  for (var n=0; n<fromNode.childNodes.length; n++) {
    toNode.appendChild(
      fromNode.childNodes[n].cloneNode(true)
    )
  }
}

DOMSerializer.prototype.flatten = function(callback) {
  var tmpNode = document.createElement('div');
  this.cloneChildren(this.node, tmpNode);

  this.flattenDOMTree(tmpNode, function() {    
    callback(tmpNode.innerHTML);
  });
}