{ //definieren von Variablen
function Tier(num, Name, Unterart, Art, Unterserie, Serie, Untersektion, Sektion, Untergattung, Gattung, Subtribus, Tribus, Unterfamilie, Familie, Überfamilie, Teilordnung, Unterordnung, Ordnung, Überordnung, Teilklasse, Unterklasse, Klasse, Reihe, Überklasse, Unterstamm, Stamm, Überstamm, Stammgruppe, Abteilung, Unterreich, Reich, Domäne, Gruppe, BildLink, BildInfo, Merkmale, Info, Link) {
	this.num = num;
	this.Name = Name;
	this.Unterart = Unterart;
	this.Art = Art;
	this.Unterserie = Unterserie;
	this.Serie = Serie;
	this.Untersektion = Untersektion;
	this.Sektion = Sektion;
	this.Untergattung = Untergattung;
	this.Gattung = Gattung;
	this.Subtribus = Subtribus;
	this.Tribus = Tribus;
	this.Unterfamilie = Unterfamilie;
	this.Familie = Familie;
	this.Überfamilie = Überfamilie;
	this.Teilordnung = Teilordnung;
	this.Unterordnung = Unterordnung;
	this.Ordnung = Ordnung;
	this.Überordnung = Überordnung;
	this.Teilklasse = Teilklasse;
	this.Unterklasse = Unterklasse;
	this.Klasse = Klasse;
	this.Reihe = Reihe;
	this.Überklasse = Überklasse;
	this.Unterstamm = Unterstamm
	this.Stamm = Stamm;
	this.Überstamm = Überstamm;
	this.Stammgruppe = Stammgruppe;
	this.Abteilung = Abteilung;
	this.Unterreich = Unterreich;
	this.Reich = Reich;
	this.Domäne = Domäne;
	this.Gruppe = Gruppe;
	this.BildLink = BildLink;
	this.BildInfo = BildInfo;
	this.Merkmale = Merkmale;
	this.Info = Info;
	this.Link = Link;
};

var dummyTier = new Tier();
var timeout = 500;
var dataversion = '1.3'; //Daten-Format Version
var defaultId1 = "3"; //Werte der Default-Liste
var defaultId2 = "7"; //Werte der Default-Liste
}

if(localStorage.TiereMeta && localStorage.Tiere && localStorage.delTiere && JSON.parse(localStorage.TiereMeta).Id2 <= 1){ //Daten einlesen von localStorage...
	var Tiere = JSON.parse(localStorage.Tiere);
	var delTiere = JSON.parse(localStorage.delTiere);
	var TiereMeta = JSON.parse(localStorage.TiereMeta);
	checkVersion();
} else{ //...oder von default-Liste
	var TiereMeta, Tiere, delTiere;
	defaultlist();
}

if(localStorage.firstvisit){ //erstmaligen Besuch laden bzw erstellen
	var firstvisit = JSON.parse(localStorage.firstvisit);
} else{
	var firstvisit = {index:true, verwalten:true};
}


if(localStorage.FilterAr){ //gewählte Filter laden
	var FilterAr = JSON.parse(localStorage.FilterAr);
} else{
	var FilterAr = [];
}

if(localStorage.RightA && localStorage.FalseA){ //Prozentsatz laden
	var richtigeA = JSON.parse(localStorage.RightA);
	var falscheA = JSON.parse(localStorage.FalseA);
} else{
	var richtigeA = 0;
	var falscheA = 0;
}

function checkVersion() {

if(parseFloat(TiereMeta.dv) < 1.3){  //Daten-Format Update Zusätzliche Felder und .Info ist vorheriges .Link
	
	if(!TiereMeta.dv){  //Daten-Format Update
		TiereMeta.v = 0;
	};
	
	if(parseFloat(TiereMeta.dv) < 1.3){
		if(parseFloat(TiereMeta.dv) < 1.25){
			function LinkToInfo(elem){
				elem.Info = elem.Link;
				elem.Link = "";
			};
			Tiere.forEach(LinkToInfo);
			delTiere.forEach(LinkToInfo);
		}
		
		function fillit(elem){
			for(el in dummyTier){
				if(!elem[el]){ 
					elem[el] = ""; 
				}
			};
		}
		Tiere.forEach(fillit);
		delTiere.forEach(fillit);
	}
	TiereMeta.dv = dataversion;
}
}

function smallMenu() { //Klasse von navbar Elementen zum ein- und ausklappen ändern bei klick auf das Menüsymbol bei kleinem Bildschirm
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
} 

function MenuIcon(x) { //Menüsymbol ändern bei klicken
    x.classList.toggle("change");
} 

function loaddata(url){ //Laden von Daten 
	delTiere = [];
	fetch(url)
		.then((response) => response.json())
		.then(function(TierSource) {
			var danger=false;
			TierSource.Tiere.forEach(function(Tier){ //überprüfen aus script tags
				for(el in Tier){
					Tier[el].replace(/<script/g, function(x) {x = "&lt;script"; danger=true; return x;});
					Tier[el].replace(/script>/g, function(x) {x = "script&gt;"; danger=true; return x;});
				}
			});
			if (danger==true){
				alert("Die Datei wurde untersucht und enthält verdächtige Elemente, die Verwendung dieser Datei auf BioQuis stellt möglicherweise eine Gefahr für deinen Computer und/oder deine Privatsphäre dar. Die Datei wurde deshalb nicht geladen. Du kannst die Datei mit einem Texteditor öffnen und die potentiell gefährlichen Script Elemente entfernen.");
			}
			if (danger==false){
				Tiere = TierSource.Tiere;
				delete TierSource.Tiere;
				TiereMeta = TierSource;
				checkVersion();
			}
		});
}

function defaultlist(){ //Laden der default-Liste
	loaddata("Tierliste.json");
	if(document.getElementById("dellist")){
		document.getElementById("dellist").style.display = "none";
	}
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
	localStorage.RightA = JSON.stringify(richtigeA);
	localStorage.FalseA = JSON.stringify(falscheA);
	localStorage.firstvisit = JSON.stringify(firstvisit);
}

function filter(gTiere, lTiere, filterarr){ //Anwenden des Filterarrays auf die Tierliste
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

function dellistdisplay(){ //die Anzeige des Zurücksetzen button wird der Bildschirmgröße angepasst
	document.getElementById("dellist").style.display = document.getElementById("Help").style.display;
}

function init (){ //Prüfen auf eigene Liste
	if (!(localStorage.TiereMeta && localStorage.Tiere && localStorage.delTiere) || JSON.parse(localStorage.TiereMeta).Id2>1) {// || (TiereMeta.Id1 == defaultId1 && TiereMeta.Id2 == defaultId2)){ //Wenn man das erste mal die Seite besucht, oder die Default Liste eingestellt hat
		document.getElementById("dellist").style.display = "none";
	}
	
	document.getElementById("nichtVerstanden").onclick = function(){ //Begrüßungstext ausblenden
		document.getElementById("firstInfoIndex").style.display = "none";
	}
}

function quiz(){ //Code für die Quiz-Seite
	
	if(firstvisit.index){
		document.getElementById("firstInfoIndex").style.display = "block";
	}
	
	var randnum;
	var darwinLinne = false;
	
	//Die inertiale Filterliste generieren
	//filter(delTiere,Tiere,FilterAr);	
	FilterAr.forEach(function(el){
		var span = document.createElement("SPAN");
		span.innerText = el;
		span.className = "filters";
		span.title = "Zum entfernen des Filters klicken";
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
		
		//während laden des Bildes Ladesymbol anzeigen
		var loadsymbol = document.getElementById("loadsymbol");
		loadsymbol.style.display = "initial";
		
		
		if (Tiere.length == 0){ //zurücksetzten wenn alle Bilder richtig bestimmt wurden
			Tiere = delTiere;
			delTiere = [];
			if (Tiere.length == 0){ //wenn neue Liste mit nur einem leeren Eintrag (neue Liste bei bearbeiten)
				loadsymbol.style.display = "none";
				if(confirm("Die Liste enthält keine Einträge. Liste bearbeiten?")){
					window.location.href = "Verwalten.html";
				}
			}
			filter(delTiere,Tiere,FilterAr);
			if (Tiere.length == 0){ //wenn nach laden eigener Liste der Filter nicht mehr passt weil Einträge weg sind
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
		
		//Bild und Bildinfo während dem Laden ausblenden
		var image = document.getElementById("bild");
		image.style.display ="none"; 
		document.getElementById("bildinfo").style.display = "none";
		
		{ //Prüfen auf fehler im Bildlink bzw. image.src=BildLink wenn richtig
		darwinLinne = false;
		if (!randel.BildLink){ //Prüfen auf fehlenden Bildlink, dann Darwin
			image.src = "graphics/Darwin.jpg";
			document.getElementById("bildinfo").innerHTML = "Charles Darwin persönlich ist von dir enttäuscht, weil du bei ID#"+randel.num+" die Bildadresse vergessen hast! <a href='Help.html#HDarwin' target='_blank'>Hilfe<a>";
			darwinLinne = true;
		} else{
			image.src = randel.BildLink;
		}
		
		image.onerror = function(){ //Prüfen auf fehlerhaften Bildlink, dann Linne
			image.src = "graphics/Linne.jpg";
			document.getElementById("bildinfo").innerHTML = "Hier ist Carl von Linné weil die Bildadresse von ID#"+randel.num+" falsch, das Bild an dieser Adresse nicht mehr existiert oder die Internetverbindung unterbrochen ist. <a href='Help.html#HLinne' target='_blank'>Hilfe<a>";
			darwinLinne = true;
		}
		}
		
		image.onload = function(){ //Bildgröße anpassen und Bild und Bildinfo anzeigen
			var imW = image.naturalWidth;
			var imH = image.naturalHeight;
			var ratio = Math.min(windowW / imW, windowH / imH);
			if(ratio <1){
				image.width = ratio*imW;
				image.height = ratio*imH;
			}else{
				image.width = imW;
				image.height = imH;
			}
			image.style.display = "block";
			loadsymbol.style.display = "none";
			
			if (randel.BildInfo || darwinLinne){
				if (!darwinLinne) { //Bilduntertext anzeigen
					document.getElementById("bildinfo").innerHTML = urlcheck(randel.BildInfo);
				}
				document.getElementById("bildinfo").style.display = "block";
			}
			
			if (image.width > 350){ //Bestimmt wie Bilduntertext angepasst wird
				document.getElementById("bildinfo").style.width = (image.width-2)+"px";
			} else{
				document.getElementById("bildinfo").style.bottom = "0px";
			}
		}
		
		document.getElementById("number").innerHTML = randel.num;
		
		var ges = richtigeA + falscheA; //Prozentsatz richtiger Antworten anzeigen
		if(ges > 0){
			document.getElementById("prozent").innerHTML = Math.floor((richtigeA/ges)*10000)/100+"%";
		}
		
		var atable = document.getElementById("antworttext");
		atable.innerHTML = ""; //Antworttext zurücksetzen
		
		for (el in dummyTier){ //Antworttext anpassen
			if(randel[el] && el!="BildInfo" && el!="BildLink" && el!="num"){ 
				var row = atable.insertRow(-1) //last position also for Safari
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				cell1.className = "leftcolumn";
				cell2.className = "rightcolumn";
				cell1.innerHTML = el+":";
				cell2.innerHTML = randel[el];
				
				switch (el){
					case "Info":
						cell1.innerHTML = "Weitere Informationen:"
						break;
					case "Link":
						var splited = randel[el].split(" & ");
						cell2.innerHTML = "";
						for (var elem of splited){
							elem = elem.trim();
							var link = document.createElement("a");
							var splitted = elem.split("");
							var iHtml = "";
							for (var ch of splitted){ // zero-with-space nach jedem char einfügen damit linebreak ei langen links
								iHtml = iHtml+ch+"&#8203;";
							}
							link.innerHTML = iHtml;
							link.href = elem;
							link.target ="_blank"
							cell2.appendChild(link);
							var span = document.createElement("SPAN");
							span.innerHTML = " & ";
							cell2.appendChild(span);
						}
						cell2.removeChild(cell2.lastChild);
				}
			}
		}
		return randnum;
	};
	
	function urlcheck(text) {
		var aRegex = /<a.{1,}?>.*?<\/\s*a\s*>/ig;
		alink = text.match(aRegex);
		text = text.replace(aRegex,"2eorertzkgfcxxsyrtkrgjvndjdeif23424SDGFGFewrtjhgd5");
		var urlRegex = /\bhttps?:\S*[^\.<>]/ig;
		text = text.replace(urlRegex, function(url) {
			return '<a href="' + url + '" target="_blank">' + url + '</a>';
		})
		if(alink){
			for(el of alink){
				text = text.replace("2eorertzkgfcxxsyrtkrgjvndjdeif23424SDGFGFewrtjhgd5",el);
			}
		}
		return text;
	}
	
	document.getElementById("bild").addEventListener("click", function(event) { //Anzeigen der Antwort bei Click auf bild
		document.getElementById('popup').style.display='block'
		event.preventDefault();
	});
	
	{//Antwortbuttons richtig/falsch
	var richtigbuttons = document.querySelectorAll("button[name='richtig']");
	for (i=0;i<richtigbuttons.length;i++){
		richtigbuttons[i].onclick = function(){
			delTiere.push(Tiere[randnum]);
			Tiere.splice(randnum,1);
			if (!darwinLinne){
				richtigeA++;
			}
			nextround();
		}
	}
	var falschbuttons = document.querySelectorAll("button[name='falsch']");
	for (i=0;i<falschbuttons.length;i++){
		falschbuttons[i].onclick = function(){
			if (!darwinLinne){
				falscheA++;
			}
			nextround();
		}
	}
	}
	
	function nextround(){ //nächstes Bild wird geladen
		document.getElementById('popup').style.display='none';
		randnum=randIm();
	}
	
	document.getElementById("prozent").onclick = function(){//Prozent zurücksetzen
		richtigeA = 0;
		falscheA = 0;
		document.getElementById("prozent").innerHTML = "0%";
	}
	
	document.getElementById("loadlist").onchange = function() { //Eigene liste laden
		var file = this.files[0];
		loaddata(window.URL.createObjectURL(file));
		startquiz();
		window.URL.revokeObjectURL(file);
		dellistdisplay();
	};
	
	document.getElementById("dellist").onclick = function(){ //Default liste laden nach zurücksetzen
		if (confirm("Sollten alle Einträge in dieser Liste unwiderruflich gelöscht und die Standardliste wiederhergestellt werden?")){
			defaultlist();
			startquiz();
		}
	}
	
	document.getElementById("Verstanden").onclick = function(){//Begrüßungstext Index nicht mehr anzeigen
		firstvisit.index = false;
		document.getElementById("firstInfoIndex").style.display = "none";
	}
	 
	{ //Filter anwenden
	var searchfield = document.getElementById("searchfield");
	var nTiere, filtera;
	searchfield.onfocus = function(){
		nTiere = Tiere.concat(delTiere);
		filtera = document.getElementById("filteranswers");//filterantwortfeld
	}
	searchfield.onkeyup = function(){
		var hits = [];
		filtera.innerHTML="";
		if(searchfield.value.length>=1){
			var expr = searchfield.value;
			var patt = new RegExp(expr,"i");
			nTiere.forEach(function(el){
				for(elem in el){
					if(elem!="Merkmale" && elem!="Info" &&elem!="Link" && elem!="BildLink" && elem!="BildInfo" && patt.test(el[elem])){
						if(elem=="num"){
							hits.push("ID: "+el[elem]);
						}else{
							hits.push(elem+": "+el[elem]);
						}
					}
				}
			});
			hits = [...new Set(hits)];// Macht die Werte in hits einzigartig
			if(hits.length == 0){
				newAnswer("Keine Übereinstimmung");
				return;
			}
		}
		
		function newAnswer(string){
			var li = document.createElement("SPAN");
			li.innerText = string;
			li.style.display = "Block";
			filtera.appendChild(li);
			return li;
		}
		
		hits.forEach(function(el){
			var li = newAnswer(el);
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
				span.className = "filters";
				span.title = "Zum entfernen des Filters klicken";
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
	}
};

function DataInput(){ // Code für die Verwalten-Seite

	if(firstvisit.verwalten){
		document.getElementById("firstInfoIndex").style.display = "block";
	}
	var tbl = document.getElementById("tiere");
	var th = Array.from(document.getElementsByTagName("th")); //Alle th Elemente in Array
	th.shift(); //Leeres Platzhalterfeld für +/- Button entfernen
	//var sorters = ["num","Art","Gattung","Unterfamilie","Familie","Unterordnung","Ordnung","Klasse","Stamm","Gruppe","bildlink","bildinfo","Merkmale","link"];
	var sorters = th.map(elem => elem.className);
	var currentsorter = "num";
	var tableready = false;
	
	Inputlist(true);
	
	sorters.forEach(function(el){ //Aufbau der Optionen im Bedingungs Menüpunkt
		var option = document.createElement("option");
		option.value = el;
		switch (el) {
			case "num":
				option.innerHTML = "ID#";
				option.selected = "true";
				break;
			case "BildLink":
				option.innerHTML = "Grafik-/Bildadresse";
				break;
			case "BildInfo":
				option.innerHTML = "Bildinformation";
				break;
			case "Info":
				option.innerHTML = "Weitere Informationen";
				break;
			default:
				option.innerHTML = el;
		}
		
		var option2 = option.cloneNode(true);
		if (el != "num"){
			document.getElementById("queryselector1").appendChild(option2); //option2 weil option.selected nicht geklont wird und bei queryselector2 benötigt wird
		}
		
		document.getElementById("queryselector2").appendChild(option); //option weil option.selected nicht geklont wird und bei queryselector2 benötigt wird
	});
	
	function Inputlist(initial = true, alleTiere, sorter = "num"){ 
		currentsorter = sorter;
		setTimeout(function() {
			alleTiere = alleTiere || Tiere.concat(delTiere); //wenn alleTiere gegeben, dann alleTiere sonst alleTiere = Tiere.concat(delTiere)
			if(initial){
				alleTiere.sort(sortBy(sorter));
				th.forEach(function(elm,idx){ //th grau markieren nach dem sortiert wurde
					if(sorter != sorters[idx]){
						elm.style.background="#ffffff";
					}else{
						elm.style.background="#f2f2f2";
					}
				});
			}
			for(var i=0; i<alleTiere.length; i++){ //aufbau der Tabelle
				var tr = tbl.tBodies[0].insertRow();
				tr.id = i+1;
				buttons(tr);
				for(el in dummyTier){
					var td = tr.insertCell();
					var input = document.createElement("input");
					var iValue = alleTiere[i][el];
					if (iValue != null){ //Damit bei älteren Listen mit weniger Feldern nicht "undefined" im Input angezeigt wird;
					input.value = iValue;
					}
					input.className = el;
					td.className = el;
					input.title = "Zum Ändern klicken";
					switch (el){
						case "num":	
							input.readOnly = true;
							if(!initial) {
								TiereMeta.Maxid++;
								input.value = TiereMeta.Maxid;
								alleTiere[i].num = TiereMeta.Maxid.toString();
								Tiere.push(alleTiere[i]);
							}
							break;
						case "BildLink":
							input.title = 'Rechtsklick -> "Bildadresse/Grafikadresse kopieren",\nauf das im Internetbrowser geöffnete Bild um die Bildadresse/Grafikadresse zu erhalten';
							break;
					}
					input.type = "text";
					input.name = "ip";
					input.onchange = function(){
						this.style.color = "#B22222";
						change(this);
					}
					if (!initial){
						if(el != "num"){
							input.style.color = "#808080";
						}
						else{
							input.style.color = "#1344a0";
						}
						input.ondblclick = function(){
							this.style.color = "#1344a0";
						}
					}
					input.onfocus = function(){ //ganze Zeile markieren wenn ein Input on focus
						var tds = this.parentNode.parentNode.children;
						for(var j=1; j<tds.length; j++){
							var tip = tds[j].firstChild;
							tip.classList.add("rowfocused");
						}
					}
					input.onblur = function(){ //ganze Zeile demarkieren wenn focus weg von input
						var tds = this.parentNode.parentNode.children;
						for(var j=1; j<tds.length; j++){
							var tip = tds[j].firstChild;
							tip.classList.remove("rowfocused");
						}
					}
					td.appendChild(input);
				}
			} tableready = true;
		},timeout);
	}
	
	function change(field){ //Im Input vorgenommene Änderung wird in Tiere bzw delTiere übernommen
		changedList();
		var id = field.parentNode.parentNode.children[1].firstChild.value
		try{
			Tiere[Tiere.map(function(el){return el.num}).indexOf(id)][field.classList[0]] = field.value;
		} catch(err){
			delTiere[delTiere.map(function(el){return el.num}).indexOf(id)][field.classList[0]] = field.value;
		}
	}
	
	function changedList() { //Änderung von Id2 bei Änderung der Standardliste
		if(TiereMeta.Id2 == defaultId2){
			dellistdisplay();
			TiereMeta.Id2 = Math.random();
		}
	}
	
	var backup = [];
	var forwardup = [];
	function backupupdate(array,scroll=false,forward = false){ //Der derzeitige Zustand wird zum array hinzugefügt. Array wird auf 5 Einträge begrenzt.
		var tempTiere = Tiere.map(function(el){return {...el};}); //der ...irgendwas move heist spread syntax und ist notwendig um die objekte zu klonen anstatt nur referenzen zu erzeugen.
		var tempdelTiere = delTiere.map(function(el){return {...el};});
		var last = {Tiere: [...tempTiere], delTiere: [...delTiere], scroll: scroll};
		array.unshift(last);
		array.splice(10);
		if(array === backup){
			document.getElementById("backward").firstChild.style.filter = "brightness(1)";
			if(!forward) {
				forwardup = [];
				document.getElementById("forward").firstChild.style.filter = "brightness(0.4)";
			}
		}else if(array ===forwardup){
			document.getElementById("forward").firstChild.style.filter = "brightness(1)";
		}
	}
	
	function restore(fromarray, toarray, forward = false){ //Der derzeitige Zustand wird im fromarray gespeichert, der erste Eintrag des toarray wird wiederhergestellt
		if(toarray[0]){
			backupupdate(fromarray,toarray[0].scroll,forward);
			Tiere = toarray[0].Tiere;
			delTiere = toarray[0].delTiere;
			if(toarray[0].scroll){
				var yscroll = window.scrollY;
				var xscroll = window.scrollX;
				tableready = false;
			}
			newtable();
			Inputlist(true,Tiere.concat(delTiere),currentsorter);
			if(toarray[0].scroll){
				doscroll(1);
				function doscroll(counter){
					setTimeout(function(){
					if(!tableready && counter <= 15){
						counter++;
						doscroll(counter);
					}else{
						window.scrollTo(xscroll,yscroll);	
					}
					},250);
				}
			}
			toarray.shift();
			if (toarray.length == 0){
				if(toarray === backup){
					document.getElementById("backward").firstChild.style.filter = "brightness(0.4)";
				}else if(toarray ===forwardup){
					document.getElementById("forward").firstChild.style.filter = "brightness(0.4)";
				}
			}
		}
	}
	
	document.getElementById("backward").onclick = function(){restore(forwardup,backup);};
	document.getElementById("forward").onclick = function() {restore(backup,forwardup,true);};
	
	function buttons(row) { //Zeile löschen und hinzufügen Button
		var delbutton = document.createElement("button");
		delbutton.type = "button";
		delbutton.className = "dabuttons delbutton";
		delbutton.title = "Diese Zeile löschen"
		delbutton.addEventListener("click", function(event) {
			backupupdate(backup,true);
			changedList();
			var row= this.parentNode.parentNode
			var id = row.children[1].firstChild.value
			
			var idx = Tiere.map(function(el){return el.num}).indexOf(id);
			if (idx >= 0){
				Tiere.splice(idx,1);
			}else{
				delTiere.splice(delTiere.map(function(el){return el.num}).indexOf(id),1);
			}
			row.parentNode.removeChild(row);
			
			event.preventDefault();
		});
		
		var addbutton = document.createElement("button");
		addbutton.type = "button";
		addbutton.className = "dabuttons addbutton";
		addbutton.title = "Neue Zeile unter dieser Zeile hinzufügen"
		addbutton.addEventListener("click", function(event) {
			backupupdate(backup,true);
			Tiere.push(new Tier);
			var newrow = tbl.tBodies[0].insertRow(row.rowIndex);
			newrow.id = newrow.previousSibling.rowIndex +1;
			buttons(newrow);
			for (i=1; i<tbl.rows[0].cells.length; i++){
				var cell = newrow.insertCell();
				var input = document.createElement("input");
				input.type = "text";
				input.name = "ip";
				input.className = newrow.previousSibling.cells[i].firstChild.classList[0];
				if(input.className != "BildLink"){
					input.value = newrow.previousSibling.cells[i].firstChild.value;
				}
				input.title = newrow.previousSibling.cells[i].firstChild.title;
				cell.className = input.className;
				input.style.color = "#808080";
				switch (i){
					case 1:
						input.readOnly = true;
						TiereMeta.Maxid++;
						Tiere[Tiere.length-1].num = TiereMeta.Maxid.toString();
						input.value = TiereMeta.Maxid;
						input.style.color = "#1344a0";
						break;
				}
				
				input.onchange = function(){
					this.style.color = "#B22222";
					change(this);
				}
				input.ondblclick = function(){
					this.style.color = "#1344a0";
				}
				
				input.onfocus = function(){ //ganze Zeile markieren wenn ein Input on focus
					var tds = this.parentNode.parentNode.children;
					for(var j=1; j<tds.length; j++){
						var tip = tds[j].firstChild;
						tip.classList.add("rowfocused");
					}
				}
				input.onblur = function(){ //ganze Zeile demarkieren wenn focus weg von input
					var tds = this.parentNode.parentNode.children;
					for(var j=1; j<tds.length; j++){
						var tip = tds[j].firstChild;
						tip.classList.remove("rowfocused");
					}
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
	
	function sortBy(sorter) { //Sortieren der Einträge
		if(sorter == "num"){
			return function (a,b) {
				return parseInt(a[sorter])-parseInt(b[sorter]);
			}
		}else{
			return function (a, b){
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
	
	document.getElementById("loadlist").onclick = function() {//Eigene Liste laden
		var rnewlist = true;
			
		if (!(defaultId1 == TiereMeta.Id1 && defaultId2 == TiereMeta.Id2)){
			rnewlist = confirm("Sollten alle Einträge in dieser Liste gelöscht und eine andere eigene Liste geladen werden?");
		}
		
		if(rnewlist){
			document.getElementById("loadlist").onchange = function() {
				backupupdate(backup);
				var file = this.files[0];
				newtable();
				loaddata(window.URL.createObjectURL(file));
				Inputlist(true);
				window.URL.revokeObjectURL(file);
				dellistdisplay();
			};
		}else{
			return false;
		}
	};
	
	document.getElementById("newlist").onclick = function(){//Neue leere Liste
	
		var rnewlist = true;
	
		if (!(defaultId1 == TiereMeta.Id1 && defaultId2 == TiereMeta.Id2)){
			rnewlist = confirm("Sollten alle Einträge in der Liste gelöscht und eine neue leere Liste erstellt werden?");
		}
		
		if (rnewlist){
			TiereMeta.Id1 = Math.random();
			changedList();
			TiereMeta.Maxid = 0;
			TiereMeta.v = 0;
			backupupdate(backup);
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
				input.title = "Zum Ändern klicken";
				cell.className = el;
				switch (el){
					case "num":
						input.readOnly = true;
						input.value = TiereMeta.Maxid;
						Tiere[0].num = TiereMeta.Maxid.toString();
						break;
					case "BildLink":
						input.title = 'Rechtsklick -> "Bildadresse/Grafikadresse kopieren",\nauf das im Internetbrowser geöffnete Bild um die Bildadresse/Grafikadresse zu erhalten';
						break;
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
				
				input.onfocus = function(){ //ganze Zeile markieren wenn ein Input on focus
					var tds = this.parentNode.parentNode.children;
					for(var j=1; j<tds.length; j++){
						var tip = tds[j].firstChild;
						tip.classList.add("rowfocused");
					}
				}
				input.onblur = function(){ //ganze Zeile demarkieren wenn focus weg von input
					var tds = this.parentNode.parentNode.children;
					for(var j=1; j<tds.length; j++){
						var tip = tds[j].firstChild;
						tip.classList.remove("rowfocused");
					}
				}
				
				cell.appendChild(input);
				change(input);
			}
			var old_tbody = tbl.tBodies[0];
			old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
		}
	}
	
	document.getElementById("queryselector2").onchange = function(){
		if(document.getElementById("queryselector2").value == "Alle"){
			document.getElementById("queryvalue2").disabled = true;
		}else{
			document.getElementById("queryvalue2").disabled = false;
		}
	}
	
	var queryvalue2 = document.getElementById("queryvalue2");
	var nTiere, filtera, queryselector2;
	queryvalue2.onfocus = function(){
		nTiere = Tiere.concat(delTiere);
		filtera = document.getElementById("filteranswers");//filterantwortfeld
		var queryselector2 = document.getElementById("queryselector2").value;
	
		queryvalue2.onkeyup = function(){
			var hits = [];
			filtera.innerHTML="";
			if(queryvalue2.value.length>=3){
				var expr = queryvalue2.value;
				var patt = new RegExp(expr,"i");
				nTiere.forEach(function(el){
					if (patt.test(el[queryselector2])){
						hits.push(el[queryselector2]);
					}
				});
				
				var hits = [...new Set(hits)];// Macht die Werte in hits einzigartig
				if(hits.length == 0){
					newAnswer("Keine Übereinstimmung");
					return;
				}
			}
			function newAnswer(string){
				var li = document.createElement("SPAN");
				li.innerText = string;
				li.style.display = "Block";
				filtera.appendChild(li);
				return li;
			}
			hits.forEach(function(el){
				var li = newAnswer(el)
				li.onclick = function(){
					queryvalue2.value = el;
					filtera.innerHTML = "";
				}
			});
		}
	}
	
	document.getElementById("querysubmit").onclick = function(){
		backupupdate(backup,scroll);
		var queryselector1 = document.getElementById("queryselector1").value;
		var queryselector2 = document.getElementById("queryselector2").value;
		
		for(i=1; i<tbl.rows.length; i++){
			if(queryselector2 == "Alle" || tbl.rows[i].querySelector("."+queryselector2).firstChild.value == document.getElementById("queryvalue2").value){
				var input = tbl.rows[i].querySelector("."+queryselector1).firstChild;
				input.style.color = "#B22222";
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
		a.download = "BioQuis_Liste.json";
		a.href = url;
		a.id = "dload"
		var form = document.getElementById('form');
		try{
			form.removeChild(document.getElementById("dload")); //um a von eventuellen vorherigen Exports zu löschen
		}catch(err){}
		form.appendChild(a);
		document.getElementById("dload").click();
		
		//inputs.forEach(el => el.style.color = "#000000");
	}
	
	document.getElementById("list2").onchange = function(){
			backupupdate(backup);
			var file = this.files[0];
			changedList();
			fetch(window.URL.createObjectURL(file))
				.then((response) => response.json())
				.then(function(data) {
					Inputlist(false, data.Tiere);	
				});
			window.URL.revokeObjectURL(file);			
		
	}
	
	document.getElementById("dellist").onclick = function(){
		if (confirm("Sollten alle Einträge in der Liste gelöscht und die Standardliste wiederhergestellt werden?")){
			backupupdate(backup);
			defaultlist();
			newtable();
			Inputlist();
		}
	}
	
	document.getElementById("Verstanden").onclick = function(){//Begrüßungstext von Verwalten nicht mehr anzeigen
		firstvisit.verwalten = false;
		document.getElementById("firstInfoIndex").style.display = "none";
	}
	
	th.forEach(function(el,idx){ //Liste sorterien denke ich
		el.onclick = function (){
			var nTiere = Tiere.concat(delTiere);
			newtable();
			Inputlist(true, nTiere, sorters[idx]);
		}
	});
	
	function newtable(){
		var new_tbody = document.createElement('tbody');
		new_tbody.id = "tbody";
		var old_tbody = tbl.tBodies[0];
		old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	}
}

function help(){//Hilfe
	
	var arrow = document.getElementById("arrow");
	arrow.onclick = function(){
		arrow.classList.toggle("arrowchange");
		var x = document.getElementById("Ptoclist");
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
	
}

function topscroll(maxwidth) {//Pfeil zum nach oben scrollen maxwidth ist die Breite beim Umschalten zur Smartphone Ansicht
	if(maxwidth >= Math.max(document.documentElement.clientWidth,window.innerWidth)){ 
		window.onscroll = function (){
			//console.log(window.scrollY);
			//console.log(window.scrollX);
			if (document.body.scrollTop>50 || document.documentElement.scrollTop>50){ //erst nach scrollen sichtbar
				var button = document.getElementById("Topbutton");
				button.style.display = "block";
			} else {
				document.getElementById("Topbutton").style.display = "none";
			}
		}
	}
}