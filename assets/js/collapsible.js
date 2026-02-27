// use one component only per page

let folded;
let titleElement;
let headerElement;
let markElement;
let bodyElement;

function collapsibleInit(){
    titleElement = document.getElementsByClassName("collapsible-title")[0];
    bodyElement = document.getElementsByClassName("collapsible-body")[0];
    if(!checkReference([titleElement, bodyElement])) return;

    folded = bodyElement.hasAttribute("open") ? false : true;
    
    headerElement = titleElement.children[0];
    headerElement.innerHTML = 
    `<span class="collapsible-mark">` + (folded ? `✊` : `🖐`) + `</span>` + headerElement.innerHTML;

    markElement = document.getElementsByClassName("collapsible-mark")[0];

    titleElement.addEventListener("click", collapsibleClick);
}

function collapsibleClick(){
    if(!checkReference([markElement, bodyElement])) return;

    folded = !folded;
    markElement.innerHTML = folded ? '✊' : '🖐';
    bodyElement.style.display = folded ? 'none' : 'block';
}

function checkReference(list){
    for(let item of list){
        if(!item) return false;
    }
    return true;
}