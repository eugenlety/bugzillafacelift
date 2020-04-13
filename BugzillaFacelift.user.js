// ==UserScript==
// @name         BugzillaFacelift
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  Stylování Bugzilly - Trade
// @author       Eugen Letý
// @grant        none
// @match        https://bugzilla.abra.eu/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==


// *** Barva horní položky Status ***

if( $( "span#static_bug_status:contains('VERIFIED')" ).length > 0) {
    $( "span#static_bug_status" ).css({"color": "#17984e", "font-weight": "bold"});
} else {
    $( "span#static_bug_status" ).css({"color": "red", "font-weight": "bold"});
};

// *** Barví komentáře, které mají tagy help nebo tohelp. ***
$( "span:contains('Comment hidden (help)')" ).parents( ".bz_comment" ).css( "background-color", "khaki" );
$( "span:contains('tohelp')" ).parents( ".bz_comment" ).css( "background-color", "lightblue" );
$( "span:contains('totest')" ).parents( ".bz_comment" ).css( "background-color", "lightblue" );
$( "span:contains('err')" ).parents( ".bz_comment" ).css( "background-color", "#ffcdd2" );
$( "span:contains('test')" ).parents( ".bz_comment" ).css( "background-color", "#b2dfdb" );
$( "span:contains('todo_code_review')" ).parents( ".bz_comment" ).css( "background-color", "#ffe082" );

// *** Barva borderů položky Typ ***
function oType(type, color) {
    this.type = type;
    this.color = color;
};

// *** Zvětší okno s textem releaseinfo ***
$("#cf_releaseinfo_readonly").css({"max-width": "1000px", "max-height": "1000px", "font-size": "11px", "bacground-color": "#e7e7e7"});
// *** Barví řádky v seznamu ***
var myTypeRow1 = new oType("VERIa", "#a5d6a7");
var myTypeRow2 = new oType("IN_P", "#d0d6e2");
var myTypeRow3 = new oType("TEST", "#fff176");
var myTypeRow4 = new oType("FIXE", "#fff9c4");
// Stav OK
var myTypeRow5 = new oType("WONT", "#a5d6a7");
var myTypeRow6 = new oType("VERI", "#a5d6a7");
var myTypeRow7 = new oType("DUPL", "#a5d6a7");
var myTypeRow8 = new oType("INVA", "#a5d6a7");
var myTypeRow9 = new oType("WORK", "#a5d6a7");

var arrTypeRow = [myTypeRow1, myTypeRow2, myTypeRow3, myTypeRow4, myTypeRow5, myTypeRow6, myTypeRow7, myTypeRow8, myTypeRow9];
var lenTypeRow = arrTypeRow.length;
var j;


var trs = document.querySelectorAll('tbody tr');
for (var i=0; i<trs.length; i++) {
    $(tr).css('border-bottom', '1px solid #b4bfff');
    var tr = trs[i];
    var orig_est_column = tr.querySelector('.bz_estimated_time_column');
    var actual_hours_column = tr.querySelector('.bz_actual_time_column');
    var hours_left_column = tr.querySelector('.bz_remaining_time_column');
    var status_column = tr.querySelector('.bz_bug_status_column');
    var resolution_column = tr.querySelector('.bz_resolution_column');
    var flags_column = tr.querySelector('.bz_flagtypes.name_column');
    var summary_column = tr.querySelector('.bz_short_desc_column');
    var real_time = 0;
    var difference_time = 0;

    if(orig_est_column !== null){
        var percentage = 100
        if (actual_hours_column !== null && hours_left_column !== null){
            var fullH = parseFloat($(hours_left_column).text(), 10) + parseFloat($(actual_hours_column).text(), 10)
            percentage = ((0.1 + (parseFloat($(actual_hours_column).text(), 10))/fullH) / 1.1)*100
        }
        var bgcol = "#fafafa";
        for (j = 0; j < lenTypeRow ; j++) {
            if($(status_column).is(":contains('" + arrTypeRow[j].type + "')")){
                bgcol = arrTypeRow[j].color
            }
            if($(resolution_column).is(":contains('" + arrTypeRow[j].type + "')")){
                bgcol = arrTypeRow[j].color
            }
        }

        // Zobrazení BUGů bez Orig. Est.
        if(parseFloat($(orig_est_column).text(), 10) == 0){
          percentage = (0.04 / 1.1) * 100;
          bgcol = '#ffcdd2';
        }
        real_time = parseFloat($(actual_hours_column).text(), 10) + parseFloat($(hours_left_column).text(), 10);
        difference_time = Math.floor(real_time - parseFloat($(orig_est_column).text(), 10));
        if(difference_time > 0){

            $(hours_left_column).css({"font-weight": "bold"});
            $(hours_left_column).append("<br><span style=\"font-weight: normal; font-size: x-small\">(+" + difference_time + ")</span>");
        }

        tr.style.background = "linear-gradient(to right," + bgcol + " " + percentage + "%,white "+ 0 +"%)";
    }
}

$("td.bz_short_desc_column:contains('režie')").css({"font-weight": "bold"});

// *** Zobrazuje ikony pro keywordy L10N_SK, L10N_CZ, L10N_CH, Reviewed, Published, InHelp a HelpInProcess. ***
function oKey(keyword, icon, height, width) {
    this.keyword = keyword;
    this.icon = icon;
    this.height = height;
    this.width = width;
};

var myKey1 = new oKey("L10N_SK", "Flag_of_Slovakia.svg", 15, 20);
var myKey2 = new oKey("L10N_CZ", "Flag_of_the_Czech_Republic.svg", 15, 20);
var myKey3 = new oKey("L10N_CH", "Flag_of_Switzerland.svg", 15, 15);
var myKey4 = new oKey("InHelp", "InHelp.svg", 15, 15);
var myKey5 = new oKey("HelpInProcess", "in_process.png", 15, 15);
var myKey6 = new oKey("Reviewed", "magnifying-glass1.png", 15, 15);
var myKey7 = new oKey("Published", "rocket_red1_cut.png", 15, 15);

var arrKey = [myKey1, myKey2, myKey3, myKey4, myKey5, myKey6, myKey7];
var lenKey = arrKey.length;

for (i = 0; i < lenKey ; i++) {
	$( "input[value*=" + arrKey[i].keyword + "]" ).parents(':eq(1)')
		.after( "<td valign=\"bottom\"style=\"padding-left:5px;width:20px\"><img src=\"https://help.abra.eu/icons/"
			   + arrKey[i].icon + "\" height=\""
			   + arrKey[i].height + "\" width=\""
			   + arrKey[i].width + "\"></td>" );
};

var myType1 = new oType("Error (chyba)", "#ff9933");
var myType2 = new oType("---", "#ff0000");
var myType3 = new oType("Improvement (zlepšení)", "#33cc33");
var myType4 = new oType("Development (rozvoj)", "#0099ff");
var myType5 = new oType("Legislation (legislativa)", "#cc0099");

var arrType = [myType1, myType2, myType3, myType4, myType5];
var lenType = arrType.length;

for (j = 0; j < lenType ; j++) {
	$("#cf_statistictype option[value=\"" + arrType[j].type + "\"][selected='selected']").parent().css({"border-color": arrType[j].color, "border-width": "2px"});
};

// *** Barva textu pro flag ToHelp a ToPubl v závislosti na hodnotě ***
function oFlagValue(value, color) {
	this.value = value;
	this.color = color;
};

var myFlagValue1 = new oFlagValue("+", "#009933");
var myFlagValue2 = new oFlagValue("-", "red");
var myFlagValue3 = new oFlagValue("?", "#cc00cc");

var arrFlag = ["ToHelp", "ToPubl", "To_Help"];
var arrFlagValue = [myFlagValue1, myFlagValue2, myFlagValue3];

var lenFlag = arrFlag.length;
var lenFlagValue = arrFlagValue.length;

var k;
var l;

for (l = 0; l < lenFlag ; l++) {
	for (k = 0; k < lenFlagValue ; k++) {
		$("option[value=\"" + arrFlagValue[k].value + "\"][selected]:contains(\"" + arrFlagValue[k].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrFlag[l] + "\")" ).css({"color": arrFlagValue[k].color, "font-weight": "bold"});
	};
};


// *** Barva textu pro flag ToHelp a ToPubl v závislosti na hodnotě ***
function oStatusValue(value, color) {
	this.value = value;
	this.color = color;
};

var myStatusValue1 = new oStatusValue("+", "#009933");
var myStatusValue2 = new oStatusValue("-", "red");
var myStatusValue3 = new oStatusValue("?", "#cc00cc");

var arrStatus = ["VERI", "ToPubl", "To_Help", "ToTest", "To_Test"];
var arrStatusValue = [myStatusValue1, myStatusValue2, myStatusValue3];

var lenStatus = arrStatus.length;
var lenStatusValue = arrStatusValue.length;

var ks;
var ls;

for (ls = 0; ls < lenStatus ; ls++) {
	for (ks = 0; ks < lenStatusValue ; ks++) {
		$("option[value=\"" + arrStatusValue[ks].value + "\"][selected]:contains(\"" + arrStatusValue[ks].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrStatus[l] + "\")" ).css({"color": arrStatusValue[ks].color, "font-weight": "bold"});
        $("option[value=\"" + arrStatusValue[ks].value + "\"][selected]:contains(\"" + arrStatusValue[ks].value + "\")").parent().parent().prev().children( "label:contains(\"" + arrStatus[l] + "\")" ).css({"color": arrStatusValue[ks].color, "font-weight": "bold"});
	};
};

// Funkce pro označení elementu s id čísla bugu, pokud obsahuje požadovaný keyword
function isKeywordFull(bug, keyword) {
		$('<div>').load("https://bugzilla.abra.eu/show_bug.cgi?id=" + bug + " #keywords", function(){
		var myAjaxKeywords = $(this).children().val();
		var re = /\s*,\s*/;
		var myKeyArr = myAjaxKeywords.split(re);
		var n = myKeyArr.includes(keyword);
		if (n == true) {
			$("#" + bug).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/green_dot.png'></img>" );
		} else {
			$("#" + bug).after( "<img style=\"padding-left:5px\" height=\"10\" width=\"10\" src='https://help.abra.eu/icons/red_dot.png'></img>" );
		};
	});
};

/*
if( $( "select#static_bug_status:contains('RESOLVED FIXED')" ).length > 0 )
{
    $( "input#remaining_time[value='0.0']").css({"font-weight": "bold"});
}
*/
// *** Semafory u bugů v See Also
$( "#field_container_see_also ul li a" ).each(function() {
  		var myBug = $( this ).text();
		$( this ).attr("id", myBug);
		isKeywordFull( myBug, "InHelp" );
});
