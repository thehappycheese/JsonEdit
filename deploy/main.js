var fs = require("fs");

var currentFile = null;
var t;
var ed;


//var gui = require('nw.gui');
//gui.App.argv

onload=function(){
	JSONeditor.start('tree','jform',false,false)
	Opera=(navigator.userAgent.toLowerCase().indexOf("opera")!=-1)
	Safari=(navigator.userAgent.toLowerCase().indexOf("safari")!=-1)
	Explorer=(document.all && (!(Opera || Safari)))
	Explorer7=(Explorer && (navigator.userAgent.indexOf("MSIE 7.0")>=0))
	
	
	
	
	t = document.querySelector("#jvalue");
	
	t.style.display="none";
	window.editor = ace.edit("jeditor");
	//editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
	
	editor.getSession().on('change', function () {
		t.value =editor.getSession().getValue();
	});
	
	editor.getSession().setValue(t.value);
	editor.setOptions({wrap:true})
	
}

function JSON_stringify(s){
   return JSON.stringify(s,null,"\t").replace(/[\u007f-\uffff]/g,
      function(c) { 
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
      }
   );
}


function textarea_changed(){
	try{
		editor.getSession().setValue(t.value);
	}catch(e){
		
	}
}
function domode(e){
	editor.getSession().setMode(e.target.value);
}

function doopen(e){
	var filepath = e.target.value;
	e.target.value = "";
	if(filepath == currentFile){
		return;
	}
	fs.exists(filepath,function(exists){
		if(exists){
			fs.readFile(filepath,{encoding:"utf8"},function(err,data){
				if(!err){
					try{
						var jsd = JSON.parse(data);
						currentFile = filepath;
						console.log("Current File", currentFile);
						JSONeditor.treeBuilder.JSONbuild(JSONeditor.treeDivName,jsd);
					}catch(e){
						console.log("failed to parse the contents of that file. File was not loaded.")
						doclose()
					}
				}else{
					console.log("Failed to open",err);
				}
			});
		}else{
			alert("File does not exist!")
		}
	});
	
}
function dosaveas(e){
	var filepath = e.target.value;
	e.target.value = "";
	if(filepath){
		var data = JSON_stringify(JSONeditor.treeBuilder.json,null,"\t");
		fs.writeFile(filepath,data,{encoding:"utf8"},function(err){
			if(!err){
				JSONeditor.treeBuilder.setJsonMessage('Saved!')
				currentFile = filepath;
				console.log("Current File", currentFile);
			}else{
				alert("Failed to save file!")
				console.log("Failed to save",err);
			}
		});
	}else{
		console.log("No path provided?")
	}
	
}
function dosave(){
	var data = JSON_stringify(JSONeditor.treeBuilder.json,null, "\t");
	console.log("try save as", currentFile);
	fs.writeFile(currentFile,data,{encoding:"utf8"},function(err){
		if(!err){
			JSONeditor.treeBuilder.setJsonMessage('Saved!')
		}else{
			alert("Failed to save file!")
			console.log("Failed to save",err);
		}
	});
}
function doclose(){
	currentFile = null;
	console.log("Current File", currentFile);
	JSONeditor.treeBuilder.JSONbuild(JSONeditor.treeDivName,{});
	editor.getSession().setValue();
}