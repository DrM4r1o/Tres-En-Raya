"use strict"

let classTurn = "circle";
let elementSelected = null;
let containerCircles = document.getElementById("circles");
let containerCross = document.getElementById("crosses");
let elementsDragables = document.getElementsByClassName("dragable");
let elementsDropables = document.getElementsByClassName("dropTarget");
let elementsPlaced = [];
let positionPlacedCircles = [];
let positionPlacedCross = [];

for (let i = 0; i < elementsDropables.length; i++) {
    if(i < elementsDragables.length)
    {
        elementsDragables[i].addEventListener("dragstart", dragStart);
        elementsDragables[i].addEventListener("dragend", dragEnd);
    }
    elementsDropables[i].addEventListener("dragenter", dragEnter)
    elementsDropables[i].addEventListener("dragover", dragOver);
    elementsDropables[i].addEventListener("dragleave", dragLeave);
    elementsDropables[i].addEventListener("drop", drop);
}


function dragStart(e) {
    elementSelected = e.target;
    if(elementSelected.classList.contains(classTurn) && elementsPlaced.length < 6)
    {
        e.dataTransfer.setData("text/plain", e.target.classList);
        setTimeout(() => {
            elementSelected.classList.add("hide");
        }, 0);
    } else
    {
        elementSelected.setAttribute("draggable", "false");
    }

}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add("dragOver");
}

function dragOver(e) {
    e.preventDefault();
    let incorrect = false;
    if(e.target.tagName == "IMG" || e.target.tagName == "DIV")
    {
        if(e.dataTransfer.getData("text").split("")[1] != e.target.classList[1])
        {
            e.target.classList.add("dragOverIncorrect");
            incorrect = true;
        }

    }
    if(!incorrect)
        e.target.classList.add("dragOver");
        
    elementSelected.setAttribute("draggable", "true");
}

function dragLeave(e) {
    e.preventDefault();
    e.target.classList.remove("dragOver");
    e.target.classList.remove("dragOverIncorrect");
}

function dragEnd(e) {
    e.preventDefault();
    let elementsNotPlaced = [...containerCircles.children, ...containerCross.children];
    let totalElements = 6;

    let numCirclesHiden = countContainsClass(containerCircles.children, "hide");
    let numCrossHiden = countContainsClass(containerCross.children, "hide");
    let numPlacedHidden = countContainsClass(elementsPlaced, "hide");
    let elementsRemainVisible = totalElements - numCirclesHiden - numCrossHiden;
    
    if(elementsPlaced.length <= elementsRemainVisible)
    {
        let elementsNotPlacedHidden = getElementsWith(elementsNotPlaced, "hide")
        for(let i = 0; i < elementsNotPlacedHidden.length; i++)
            elementsNotPlacedHidden[i].classList.remove("hide");
    }
    if(numPlacedHidden > 0)
    {
        let elementsPlacedHidden = getElementsWith(elementsPlaced, "hide")
        for(let i = 0; i < numPlacedHidden; i++)
            elementsPlacedHidden[i].classList.remove("hide");
    }
}

function drop(e) {
    let arrow = document.getElementById("arrow");
    let classElementDragged = e.dataTransfer.getData("text").split(" ")[1];
    let dropObjective = e.target;
    let animationSelected = "";
    let gameWin = false;
    let titleWin = document.getElementById("win");
    let titleTie = document.getElementById("tie");

    arrow.classList = "";
    dropObjective.classList.remove("dragOver");
    dropObjective.classList.remove("dragOverIncorrect");
    if( dropObjective.classList.contains("dropValid") 
        && classElementDragged == classTurn 
        && dropObjective.children.length == 0 
    )
    {
        dropObjective.appendChild(elementSelected);
        elementsPlaced.push(elementSelected);
        if(classTurn == "circle")
        {
            animationSelected = "animatedArrowRigth";
            positionPlacedCircles.push(getPositionElement(elementSelected));
        }
        else
        {
            animationSelected = "animatedArrowLeft";
            positionPlacedCross.push(getPositionElement(elementSelected));
        }
        arrow.classList.add(animationSelected);
        classTurn = (classTurn == "circle") ? "cross" : "circle";
        gameWin = checkEndGame();
    }
    elementSelected.classList.remove("hide");
    if(gameWin || elementsPlaced.length == 6)
    {
        if(gameWin) titleWin.classList.add("titlesVisible");	
        if(elementsPlaced.length == 6 && !gameWin)
            titleTie.classList.add("titlesVisible");	
        document.getElementsByTagName("main")[0].classList.add("bluredBackground");
        document.getElementsByTagName("header")[0].classList.add("bluredBackground");
    }

}

function checkEndGame() {
    if(elementsPlaced.length > 4)
    {
        let elementLastPlaced = elementsPlaced[elementsPlaced.length - 1];
        let typeLastPlaced = elementLastPlaced.classList[1];
        let ordenatedElements = ordenateElements(typeLastPlaced);

        console.log(ordenatedElements);
        let lastPos = ordenatedElements[0];
        let countCorrect = 0;
        for(let i = 0; i < ordenatedElements.length - 1; i++)
        {
            if( lastPos[0] == ordenatedElements[i + 1][0] && 
                (lastPos[1] + 1) == ordenatedElements[i + 1][1]
            ) 
            {
                lastPos = ordenatedElements[i + 1];
                countCorrect++;
            }
            if( (lastPos[0] + 1) == ordenatedElements[i + 1][0] &&
                lastPos[1] == ordenatedElements[i + 1][1]
            )
            {
                lastPos = ordenatedElements[i + 1];
                countCorrect++;
            }
            if( (lastPos[0] + 1) == ordenatedElements[i + 1][0] &&
                (lastPos[1] + 1) == ordenatedElements[i + 1][1]
            )
            {
                lastPos = ordenatedElements[i + 1];
                countCorrect++;
            }

            if(countCorrect == 2)
            {
                return true;
            }
        }
    }
}

function ordenateElements(typeLastPlaced) {
    let oldArray = [];
    let arrayOrdenated = [];
    if(typeLastPlaced == "circle")
        oldArray = positionPlacedCircles;
    else
        oldArray = positionPlacedCross;

    let minor = oldArray[0];
    for (let i = 0; i < oldArray.length - 1; i++) {
        if(minor[0] > oldArray[i + 1][0])
        {
            arrayOrdenated.unshift(minor);
            minor = oldArray[i + 1];
        } else
        {
            arrayOrdenated.push(oldArray[i + 1]);
        }
    }
    arrayOrdenated.unshift(minor);
    return arrayOrdenated;
}

function countContainsClass(array, classSearched) {
    let count = 0;
    for(let i = 0; i < array.length; i++)
    {
        if(array[i].classList.contains(classSearched))
            count++;
    }
    return count;
}

function getElementsWith(array, classSearched) {
    let elem = [];
    for(let i = 0; i < array.length; i++)
    {
        if(array[i].classList.contains(classSearched))
            elem.push(array[i]); 
    }
    return elem;
}

function getPositionElement(element) {
    let table = document.getElementsByTagName("tbody")[0];
    let parentElement = element.parentElement.parentElement;
    let positionX = Array.from(table.children).indexOf(parentElement);
    let positionY = Array.from(parentElement.children).indexOf(element.parentElement);
    return [positionX, positionY];
}

function makeNewElement(typeElement) {
    let imgElement = document.createElement("img");
    let routeName = "";
    let className = "";

    if(typeElement == "circle")
    {
        routeName = "circle";
        className = "circle";
    }
    else {
        routeName = "x";
        className = "cross";
    }

    imgElement.setAttribute("draggable", "true");
    imgElement.setAttribute(`class", "dragable ${className}`);
    imgElement.setAttribute(`src", "../Medios/${routeName}.svg`);

    return imgElement
}



