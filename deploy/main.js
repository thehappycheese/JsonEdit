var fs = require("fs");


var currentFile = null;
var t;
var ed;


var path = require('path');
var cwd = path.dirname( process.execPath );

console.log(cwd);
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
		setPreview()
	});
	
	editor.getSession().setValue(t.value);
	setPreview()
	editor.setOptions({wrap:true})
	
	
	
	editor.commands.addCommand({
		name: 'save',
		bindKey: {win: 'Ctrl-S',  mac: 'Command-M'},
		exec: function(editor) {
		  dosave();
		},
		readOnly: true // false if this command should not apply in readOnly mode
	});
	
}

function JSON_stringify(s){
   return JSON.stringify(s,null,"\t").replace(/[\u007f-\uffff]/g,
      function(c) { 
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
      }
   );
}

function setPreview(){
	var pvw = document.querySelector("#preview");
	var sel = document.querySelector("#acemodesel");
	
	pvw.innerHTML = editor.getSession().getValue();
	//if(sel.value == "ace/mode/html"){
	//	pvw.style.display = "";
	//}else{
	//	pvw.style.display = "none";
	//}
	
}

function textarea_changed(){
	try{
		editor.getSession().setValue(t.value);
		setPreview()
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
	dosave()
	doclose()
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
						alert("Invalid JSON file!");
						console.log("failed to parse the contents of that file. File was not loaded.")
					}
				}else{
					alert("Failed to open!");
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
				alert("Failed to save file!");
				console.log("Failed to save",err);
			}
		});
	}else{
		console.log("No path provided?")
	}
	
}
function dosave(){
	if(!currentFile){
		return;
	}
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