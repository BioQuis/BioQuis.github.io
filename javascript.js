

function Tier(num, Art, Gattung, Unterfamilie, Familie, Unterordnung, Ordnung, Klasse, Stamm, Gruppe, bildlink, bildinfo, Merkmale, link) {
	this.num = num;
	this.Art = Art;
	this.Gattung = Gattung;
	this.Unterfamilie = Unterfamilie;
	this.Familie = Familie;
	this.Unterordnung = Unterordnung;
	this.Ordnung = Ordnung;
	this.Klasse = Klasse;
	this.Stamm = Stamm;
	this.Gruppe = Gruppe;
	this.BildLink = bildlink;
	this.BildInfo = bildinfo;
	this.Merkmale = Merkmale;
	this.Link = link;
};
var dummyTier = new Tier();
var timeout = 500;
var dataversion = '1.2'; //Daten-Format Version
var defaultId1 = "0.8554224974327433"; //Werte der Default-Liste
var defaultId2 = "0.5857847995500236"; //Werte der Default-Liste
var WinW = window.innerWidth;

if(localStorage.TiereMeta && localStorage.Tiere && localStorage.delTiere){ //Daten einlesen von localStorage...
	var Tiere = JSON.parse(localStorage.Tiere);
	var delTiere = JSON.parse(localStorage.delTiere);
	var TiereMeta = JSON.parse(localStorage.TiereMeta);
} else{ //...oder von default-Liste
	var TiereMeta, Tiere, delTiere;
	defaultlist();
}

if(localStorage.FilterAr){ //gewählte Filter laden
	var FilterAr = JSON.parse(localStorage.FilterAr);
} else{
	var FilterAr = [];
}

if(!TiereMeta.dv){  //Daten-Format Update
	TiereMeta.dv = dataversion;
	TiereMeta.v = 0;
};

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function smallMenu() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
} 

function MenuIcon(x) {
    x.classList.toggle("change");
} 

function loaddata(url){ //Laden von Daten 
	delTiere = [];
	fetch(url)
		.then((response) => response.json())
		.then(function(TierSource) {
			Tiere = TierSource.Tiere;
			delete TierSource.Tiere;
			TiereMeta = TierSource;
		});
}

function defaultlist(){ //Laden der default-Liste
	loaddata("Tierliste.json");
	if(document.getElementById("dellist")){
		document.getElementById("dellist").style.display = "none";
	}
}

function init (){ //Prüfen auf eigene Liste
	if(!(localStorage.TiereMeta && localStorage.Tiere && localStorage.delTiere) || (TiereMeta.Id1 == defaultId1 && TiereMeta.Id2 == defaultId2)){ //Wenn man das erste mal die Seite besucht, oder die Default Liste eingestellt hat
		document.getElementById("dellist").style.display = "none";
	}
	/*console.log(RealWindowW);
	console.log(document.getElementById("icon").getComputedStyle);
	document.getElementById("icon").style.left = RealWindowW;
	console.log(document.getElementById("icon"));*/
}


function save() {  //Speichern im local Storage (bei verlassen der Seite)
	var date = new Date();
	TiereMeta.Date = date.toUTCString();
	localStorage.TiereMeta = JSON.stringify(TiereMeta);
	localStorage.Tiere = JSON.stringify(Tiere);
	localStorage.delTiere = JSON.stringify(delTiere);
	if(FilterAr){
		localStorage.FilterAr = JSON.stringify(FilterAr);
	}
}

function filter(gTiere, lTiere, filterarr){
	filterarr.forEach(function(elm) {
		var qu = elm.split(": ");
		for (var n = 0; n<lTiere.length; n++){
			if (lTiere[n][qu[0]] != qu[1]){
				gTiere.push(lTiere[n]);
				lTiere.splice(n,1);
				n--;
			}
		}
	});
}

function dellistdisplay(){
	document.getElementById("dellist").style.display = document.getElementById("Kontakt").style.display;
}

function quiz(){ //Code für die Quiz-Seite

	var randnum;
	
	filter(delTiere,Tiere,FilterAr);	//Die inertiale Filterliste generieren
	FilterAr.forEach(function(el){
		var span = document.createElement("SPAN");
		span.innerText = el;
		span.style.display = "Block";
		filters = document.getElementById("filters");
		filters.appendChild(span);
		span.onclick = function(){ //entfernen des Filters
			FilterAr.splice(FilterAr.indexOf(el),1);
			filter(Tiere,delTiere,[el]);
			span.parentNode.removeChild(span);
		}
	});
	
	startquiz();
	
	function startquiz(){ //laden des 1. Bildes nach dem Laden der Liste (deshalb Timeout)
		setTimeout(function() {
			filter(delTiere,Tiere,FilterAr);
			randnum = randIm();	
		},timeout);
	}
	
	function randIm(){ //zufälliges Bild wird angezeigt
	
		var loadsymbol = document.getElementById("loadsymbol");
		loadsymbol.style.display = "initial";
		
		
		if (Tiere.length == 0){ //zurücksetzten wenn alle Bilder richtig bestimmt wurden
			Tiere = delTiere;
			delTiere = [];
			if (Tiere.length == 1 && !Tiere.Bildlink){
				loadsymbol.style.display = "none";
				if(confirm("Die Liste enthält keine Einträge. Liste bearbeiten?")){
					window.location.href = "Verwalten.html";
				}
			}
			filter(delTiere,Tiere,FilterAr);
			if (Tiere.length == 0){
				loadsymbol.style.display = "none";
				if(confirm("Der Filter liefert kein Ergebnis. Filter entfernen?")){
					FilterAr = [];
					var filters = document.getElementById("filters");
					filters.removeChild(filters.childNodes[0]); 
					randIm();
				}
			}
		}
		
		var randnum = Math.floor(Math.random() * Tiere.length);
		var randel = Tiere[randnum];
		
		var windowW = window.innerWidth;
		var windowH = window.innerHeight-22;
		
		var image = document.getElementById("bild");
		image.style.display ="none";
		image.src = randel.BildLink;
		image.alt = "Error 404: Bild ist nicht mehr abrufbar. \nEintrag #: "+randel.num;
		
		image.onload = function(){ //Bildgröße anpasseen
			imW = image.naturalWidth;
			imH = image.naturalHeight;
			var ratio = Math.min(windowW / imW, windowH / imH);
			if(ratio <1){
				image.width = ratio*imW;
				image.height = ratio*imH;
			}
			image.style.display = "block";
			loadsymbol.style.display = "none";
			
			if (image.width > 350){ //Bestimmt wie Bilduntertext angepasst wird
				document.getElementById("bildinfo").style.width = (image.width-2)+"px";
			} else{
				document.getElementById("bildinfo").style.bottom = "0px";
			}
		}
		
		document.getElementById("number").innerHTML = randel.num;
		
		if (randel.BildInfo) { //Bilduntertext
			document.getElementById("bildinfo").innerHTML = randel.BildInfo;
			document.getElementById("bildinfo").style.display = "block";
		}
		
		var atable = document.getElementById("antworttext");
		atable.innerHTML = ""; //Antworttext zurücksetzen
		
		for (el in randel){ //Antworttext anpassen
			if(randel[el] && el!="BildInfo" && el!="BildLink" && el!="num"){ 
				var row = atable.insertRow(-1) //last position also for Safari
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				if(el != "Link"){
				cell1.innerHTML = el+":";
				} else {
					cell1.innerHTML = "Weitere Informationen:";
				}
				cell2.innerHTML = randel[el];
			}
		}
		
		return randnum;
	};
	
	document.getElementById("bild").addEventListener("click", function(event) { //Anzeigen der Antwort bei Click auf bild
		document.getElementById('popup').style.display='block'
		event.preventDefault();
	});
	
	//Antwortbuttons richtig/falsch
	document.getElementById("richtig").onclick = function(){
		delTiere.push(Tiere[randnum]);
		Tiere.splice(randnum,1);
		nextround();
	}
	document.getElementById("falsch").onclick = function(){ 
		nextround();
	}
	
	function nextround(){ //nächstes Bild wird geladen
		document.getElementById('popup').style.display='none';
		/*var image = document.getElementById("bild");
		image.src = "graphics/loader.gif";
		image.width = "64px";
		image.height = "64px";
		image.style.display = "block";*/
		randnum=randIm();
	}
	
	document.getElementById("loadlist").onchange = function() { //Eigene liste laden
		var file = this.files[0];
		loaddata(window.URL.createObjectURL(file));
		startquiz();
		window.URL.revokeObjectURL(file);
		dellistdisplay();
	};
	
	document.getElementById("dellist").onclick = function(){ //Default liste laden
		if (confirm("Sollten alle Einträge in der Liste unwiderruflich gelöscht und die Standardliste wiederhergestellt werden?")){
			defaultlist();
			startquiz();
		}
	}
	
	//Filter anwenden
	var searchfield = document.getElementById("searchfield");
	var nTiere, filtera;
	searchfield.onfocus = function(){
		nTiere = Tiere.concat(delTiere);
		filtera = document.getElementById("filteranswers");//filterantwortfeld
	}
	searchfield.onkeyup = function(){
		var hits = [];
		filtera.innerHTML="";
		if(searchfield.value.length>=3){
			var expr = searchfield.value;
			var patt = new RegExp(expr,"i");
			nTiere.forEach(function(el){
				for(elem in el){
					if(elem!="Merkmale" && elem!="Link" && elem!="BildLink" && patt.test(el[elem])){
						hits.push(elem+": "+el[elem]);
					}
				}
			});
			var hits = [...new Set(hits)]; // Macht die Werte in hits einzigartig
		}
		hits.forEach(function(el){
			var li = document.createElement("SPAN");
			li.innerText = el;
			li.style.display = "Block";
			filtera.appendChild(li);
			var span = li;
			li.onclick = function(){ //hinzufügen des Filters
				var actualTier = Tiere[randnum];
				filter(delTiere,Tiere,[el]);
				
				filters = document.getElementById("filters");
				if (FilterAr.length > 0){
					filters.replaceChild(span,filters.firstChild); 
				} else {
					filters.appendChild(span);
				}
				
				FilterAr[0] = el; //FilterAr.push(el);
				var elsplit = el.split(": ");
				
				if(actualTier[elsplit[0]] != elsplit[1]){
					randnum = randIm();
				}
				
				//filters = document.getElementById("filters");
				//filters.appendChild(span);
				span.onclick = function(){ //entfernen des Filters
					FilterAr.splice(FilterAr.indexOf(el),1);
					filter(Tiere,delTiere,[el]);
					span.parentNode.removeChild(span);
				}
				filtera.innerHTML ="";
				searchfield.value = "";
			}
		});
	}
};

function DataInput(){ // Code für die Verwalten-Seite
	var tbl = document.getElementById("tiere");
	var th = Array.from(document.getElementsByTagName("th"));
	th.shift();
	var sorters = ["num","Art","Gattung","Unterfamilie","Familie","Unterordnung","Ordnung","Klasse","Stamm","Gruppe","bildlink","bildinfo","Merkmale","link"];
	
	Inputlist(true);
	
	function Inputlist(initial = true, alleTiere, sorter = "num"){ 
		setTimeout(function() {
			alleTiere = alleTiere || Tiere.concat(delTiere); //wenn alleTiere gegeben, dann alleTiere sonst alleTiere = Tiere.concat(delTiere)
			if(initial){
				alleTiere.sort(sortBy(sorter));
				th.forEach(function(elm,idx){
					if(sorter != sorters[idx]){
						elm.style.background="#ffffff";
					}else{
						elm.style.background="#f2f2f2";
					}
				});
			}
			for(var i=0; i<alleTiere.length; i++){
				var tr = tbl.tBodies[0].insertRow();
				tr.id = i+1;
				buttons(tr);
				for(el in dummyTier){
					var td = tr.insertCell();
					var input = document.createElement("input");
					var iValue = alleTiere[i][el];
					if (iValue != null){
						input.value = iValue;
					}
					input.className = el;
					td.className = el;
					switch (el){
						case "Art":
							input.size = 50;
							break;
						case "Merkmale":
						case "Link":
							input.size = 150;
							break;
						case "num":
							input.size = 3;
							input.readOnly = true;
							if(!initial) {
								TiereMeta.Maxid++;
								input.value = TiereMeta.Maxid;
								alleTiere[i].num = TiereMeta.Maxid.toString();
								Tiere.push(alleTiere[i]);
								console.log(Tiere);
							}
					}
					input.type = "text";
					input.name = "ip";
					if (initial){
						input.onchange = function(){
							this.style.color = "#B22222";
							change(this);
						}
					}else{
						input.style.color = "#808080";
						input.onchange = function(){
							this.style.color = "#1344a0";
							change(this);
						}
						input.ondblclick = function(){
							this.style.color = "#1344a0";
						}
					}
					td.appendChild(input);
				}
			}
		},timeout);
	}
	
	function change(field){
		changedList();
		var id = field.parentNode.parentNode.children[1].firstChild.value
		try{
			Tiere[Tiere.map(function(el){return el.num}).indexOf(id)][field.className] = field.value;
		} catch(err){
			delTiere[delTiere.map(function(el){return el.num}).indexOf(id)][field.className] = field.value;
		}
	}
	
	function changedList() {
		if(TiereMeta.Id2 == defaultId2){
			dellistdisplay();
			TiereMeta.Id2 = Math.random();
		}
	}
	
	function buttons(row) {
		var delbutton = document.createElement("button");
		delbutton.type = "button";
		delbutton.className = "dabuttons";
		delbutton.id = "delbutton";
		delbutton.addEventListener("click", function(event) {
			changedList();
			var row= this.parentNode.parentNode
			var id = row.children[1].firstChild.value
			
			try{
				Tiere.splice(Tiere.map(function(el){return el.num}).indexOf(id),1);
			} catch(err){
				Tiere.splice(Tiere.map(function(el){return el.num}).indexOf(id),1);
			}
			row.parentNode.removeChild(row);
			
			event.preventDefault();
		});
		
		var addbutton = document.createElement("button");
		addbutton.type = "button";
		addbutton.className = "dabuttons";
		addbutton.id = "addbutton";
		addbutton.addEventListener("click", function(event) {
			Tiere.push(new Tier);
			var newrow = tbl.tBodies[0].insertRow(row.rowIndex);
			newrow.id = newrow.previousSibling.rowIndex +1;
			buttons(newrow);
			for (i=1; i<tbl.rows[0].cells.length; i++){
				var cell = newrow.insertCell();
				var input = document.createElement("input");
				input.type = "text";
				input.name = "ip";
				input.value = newrow.previousSibling.cells[i].firstChild.value;
				input.className = newrow.previousSibling.cells[i].firstChild.className;
				cell.className = input.className;
				input.style.color = "#808080";
				switch (i){
					case 1:
						input.size = 3;
						input.readOnly = true;
						TiereMeta.Maxid++;
						Tiere[Tiere.length-1].num = TiereMeta.Maxid.toString();
						input.value = TiereMeta.Maxid;
						input.style.color = "#1344a0";
						break;
					case 2:
						input.size = 50;
						break;
					case 11:
						input.value = "";
						break
					case 12:
					case 13:
						input.size = 150;
						break;

				}
				
				input.onchange = function(){
					this.style.color = "#1344a0";
					change(this);
				}
				input.ondblclick = function(){
					this.style.color = "#1344a0";
				}
				cell.appendChild(input);
				change(input);
			}
		});
		
		var cell = row.insertCell();
		cell.className = "tdbutton";
		cell.appendChild(delbutton);
		cell.appendChild(addbutton);
	}
	
	function sortBy(sorter) {
		if(sorter == "num"){
			return function (a,b) {
				return parseInt(a[sorter])-parseInt(b[sorter]);
			}
		}else{
			return function (a, b) {
				var al = a[sorter].toLowerCase();
				var bl = b[sorter].toLowerCase();
				var empty = 1;
				if(!al || !bl){
					empty = -1;
				}
				return empty*((al > bl)-(bl > al));
			} 
		}
	}
	
	document.getElementById("loadlist").onchange = function() {
			var file = this.files[0];
			var new_tbody = document.createElement('tbody');
			var old_tbody = tbl.tBodies[0];
			old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
			loaddata(window.URL.createObjectURL(file));
			Inputlist(true);
			window.URL.revokeObjectURL(file);
			//localStorage.owndata = true;
			dellistdisplay();
	};
	
	document.getElementById("newlist").onclick = function(){
		TiereMeta.Id1 = Math.random();
		changedList();
		TiereMeta.Maxid = 0;
		TiereMeta.v = 0;
		Tiere = [new Tier];
		delTiere = [];
		
		var new_tbody = document.createElement('tbody');
		var newrow = new_tbody.insertRow();
		newrow.id = 1;
		buttons(newrow);
		for (el in dummyTier){
			var cell = newrow.insertCell();
			var input = document.createElement("input");
			input.type = "text";
			input.name = "ip";
			input.style.color = "#808080";
			input.className = el;
			cell.className = el;
			switch (el){
				case "Art":
					input.size = 50;
					break;
				case "Merkmale":
				case "Link":
					input.size = 150;
					break;
				case "num":
					input.size = 3;
					input.readOnly = true;
					input.value = TiereMeta.Maxid;
					Tiere[0].num = TiereMeta.Maxid.toString();
			}
			input.type = "text";
			input.name = "ip";
			
			input.onchange = function(){
				this.style.color = "#1344a0";
				change(this);
			}
			input.ondblclick = function(){
				this.style.color = "#1344a0";
			}
			cell.appendChild(input);
			change(input);
		}
		var old_tbody = tbl.tBodies[0];
		old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	}
	
	document.getElementById("querysubmit").onclick = function(){
		var queryselector1 = document.getElementById("queryselector1").value;
		var queryselector2 = document.getElementById("queryselector2").value;
		
		for(i=1; i<tbl.rows.length; i++){
		
			if(tbl.rows[i].cells[queryselector2].firstChild.value == document.getElementById("queryvalue2").value){
				var input = tbl.rows[i].cells[queryselector1].firstChild;
				input.value = document.getElementById("queryvalue1").value;
				change(input);
			}
		}
	}
	
	document.getElementById("Submit").onclick = function(){
		var date = new Date();
		TiereMeta.Date = date.toUTCString();
		TiereMeta.v++;
		
		var TierSource = {
			dv: dataversion,
			Id1: TiereMeta.Id1,
			Id2: TiereMeta.Id2,
			v: TiereMeta.v,
			Date: TiereMeta.Date,
			Maxid: TiereMeta.Maxid,
			Tiere: Tiere.concat(delTiere),
		};
			
		var JSONTiere = JSON.stringify(TierSource);
		
		var blob = new Blob([JSONTiere], {type: "application/json"});
		var url  = URL.createObjectURL(blob);
		
		var a = document.createElement('a');
		a.download = "Tierliste.json";
		a.href = url;
		a.id = "dload"
		document.getElementById('form').appendChild(a);
		document.getElementById("dload").click();
		
		//inputs.forEach(el => el.style.color = "#000000");
	}
	
	document.getElementById("list2").onchange = function(){
			var file = this.files[0];
			fetch(window.URL.createObjectURL(file))
				.then((response) => response.json())
				.then(function(data) {
					Inputlist(false, data.Tiere);	
				});
			window.URL.revokeObjectURL(file);			
		
	}
	document.getElementById("loadlist").onchange = function() {
			var file = this.files[0];
			var new_tbody = document.createElement('tbody');
			var old_tbody = tbl.tBodies[0];
			old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
			loaddata(window.URL.createObjectURL(file));
			Inputlist(true);
			window.URL.revokeObjectURL(file);
			//localStorage.owndata = true;
			dellistdisplay();
	};
	
	document.getElementById("dellist").onclick = function(){
		if (confirm("Sollten alle Einträge in der Liste unwiderruflich gelöscht und die Standardliste wiederhergestellt werden?")){
			defaultlist();
			newtable();
			Inputlist();
		}
	}
	
	
	th.forEach(function(el,idx){
		el.onclick = function (){
			var nTiere = Tiere.concat(delTiere);
			newtable();
			Inputlist(true, nTiere, sorters[idx]);
		}
	});
	
	function newtable(){
		var new_tbody = document.createElement('tbody');
		var old_tbody = tbl.tBodies[0];
		old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	}
}