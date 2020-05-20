
function showSidebar(){

    document.getElementById("sidebar").style.width="16%";
    document.getElementById("sidebarImages").style.width="4.5%";

}

function hideSidebar(){

    document.getElementById("sidebar").style.width="0";
    document.getElementById("sidebarImages").style.width="0";

}

function bringSneakers(){
    document.getElementById("shoeContainer").style.backgroundColor = "rgb(253, 242, 0)";
    document.getElementById("snkrimg").style.marginLeft="63px";
}

function afiseazaNume(){
    var txt = event.srcElement.alt;
    document.getElementById("sneakerName").textContent = txt;
}