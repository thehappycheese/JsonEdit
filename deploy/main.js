var fs = require("fs");

var currentFile = null;
var t;
var ed;
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
function textarea_changed(){
	try{
		editor.getSession().setValue(t.value);
	}catch(e){
		
	}
}
function domode(e){
	editor.getSession().setMode(e.target.value);
}

function fopen(e){
	console.log(e.target.value);
	fs.exists(e.target.value,function(exists){
		if(exists){
			fs.readFile(e.target.value,{encoding:"string"},function(err,data){
				console.log(data);
			});
		}
	});
}
function doclose(){
	
}