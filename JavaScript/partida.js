"use strict"

let classTurn = "circle";
let elementSelected = null;
let containerCircles = document.getElementById("circles");
let containerCross = document.getElementById("crosses");
let elementsDragables = document.getElementsByClassName("dragable");
let elementsDropables = document.getElementsByClassName("dropTarget");

let titleWin = document.getElementById("win");
let titleTie = document.getElementById("tie");
let buttonRestart = document.getElementById("restart");

let elementsPlaced = [];
let positionPlacedCircles = [];
let positionPlacedCross = [];

addEvents();


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
    let afterAnimation = "";
    let deleteBeforeAnimation = "";
    let gameWin = false;


    arrow.classList = "";
    arrow.parentNode.classList = "";
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
            animationSelected = "slideRigth";
            afterAnimation = "afterRightAnimation";
            deleteBeforeAnimation = "afterLeftAnimation"
            positionPlacedCircles.push(getPositionElement(elementSelected));
        }
        else
        {
            animationSelected = "slideLeft";
            afterAnimation = "afterLeftAnimation";
            deleteBeforeAnimation = "afterRightAnimation";
            positionPlacedCross.push(getPositionElement(elementSelected));
        }
        arrow.style.animation = `0.6s ease-in-out forwards running ${animationSelected}`;
        arrow.addEventListener("animationend", () => {
            arrow.parentNode.classList.add(afterAnimation);
            arrow.parentNode.classList.remove(deleteBeforeAnimation);
            arrow.style.animation = `0.8s ease-in-out infinite running jumping`;
        });
        classTurn = (classTurn == "circle") ? "cross" : "circle";
        gameWin = checkEndGame();
    }
    elementSelected.classList.remove("hide");
    if(gameWin || elementsPlaced.length == 6)
        gameEnd(gameWin);
}

function gameEnd(gameWin) {
    removeEvents()
    document.getElementsByTagName("main")[0].classList.add("bluredBackground");
    document.getElementsByTagName("header")[0].classList.add("bluredBackground");
    buttonRestart.addEventListener("click", restartGame);
    if(gameWin) titleWin.classList.add("afterVisible");	
    if(elementsPlaced.length == 6 && !gameWin)
        titleTie.classList.add("afterVisible");
    buttonRestart.classList.add("afterVisible");

    elementsPlaced.forEach(element => {
        element.classList.add("notClickable");
        element.setAttribute("draggable", "false");
    });

}

function checkEndGame() {
    const minMovesToWin = 5; 
    if(elementsPlaced.length >= minMovesToWin)
    {
        let validMove, lastMove;

        let elementLastPlaced = elementsPlaced[elementsPlaced.length - 1];
        let typeLastPlaced = elementLastPlaced.classList[1];
        let ordenatedElements = ordenateElements(typeLastPlaced);
        let win = false;
        let posNext = 0;
        let lastPos = ordenatedElements[posNext];
        posNext++;

        let returnValues = validMovesInit(lastPos, ordenatedElements, posNext);
        validMove = returnValues[0]; lastMove = returnValues[1];

        if(validMove)
        {
            lastPos = ordenatedElements[posNext];   
            posNext++;
            win = validMovesLast(lastPos, ordenatedElements, posNext, lastMove);
        }
        return win;
    }
}

function validMovesInit(lastPos, ordenatedElements, posNext) {
    let valid = false;
    let moveDone;

    if( lastPos[0] == ordenatedElements[posNext][0] && 
        (lastPos[1] + 1) == ordenatedElements[posNext][1] && 
        !valid
    ) 
    {
        moveDone = "horizontal";
        valid = true;
    }
    if( (lastPos[0] + 1) == ordenatedElements[posNext][0] &&
        lastPos[1] == ordenatedElements[posNext][1] && 
        !valid
    )
    {
        valid = true;
        moveDone = "vertical";
    }
    if( (lastPos[0] + 1) == ordenatedElements[posNext][0] &&
        (lastPos[1] + 1) == ordenatedElements[posNext][1] && 
        !valid
    )
    {
        valid = true;
        moveDone = "crossed";
    }
    if( (lastPos[0] + 1) == ordenatedElements[posNext][0] &&
        (lastPos[1] - 1) == ordenatedElements[posNext][1] && 
        !valid
    )
    {
        valid = true;
        moveDone = "crossedInverted";
    }
    return [valid, moveDone];
}

function validMovesLast(lastPos, ordenatedElements, posNext, lastMove) {
    let valid = false;
    let aviableMoves = ["horizontal","vertical","crossed","crossedInverted"]

    if( lastPos[0] == ordenatedElements[posNext][0] && 
        (lastPos[1] + 1) == ordenatedElements[posNext][1] && 
        aviableMoves[0] == lastMove
    ) 
    {
        valid = true;
    }
    if( (lastPos[0] + 1) == ordenatedElements[posNext][0] &&
        lastPos[1] == ordenatedElements[posNext][1] && 
        aviableMoves[1] == lastMove
    )
    {
        valid = true;
    }
    if( (lastPos[0] + 1) == ordenatedElements[posNext][0] &&
        (lastPos[1] + 1) == ordenatedElements[posNext][1] && 
        aviableMoves[2] == lastMove
    )
    {
        valid = true;
    }
    if( (lastPos[0] + 1) == ordenatedElements[posNext][0] &&
        (lastPos[1] - 1) == ordenatedElements[posNext][1] && 
        aviableMoves[3] == lastMove
    )
    {
        valid = true;
    }
    return valid;
}


function ordenateElements(typeLastPlaced) {
    let oldArray = [];
    let arrayOrdenated = [];
    if(typeLastPlaced == "circle")
        oldArray = positionPlacedCircles;
    else
        oldArray = positionPlacedCross;

    let max = oldArray[0];
    for (let i = 0; i < oldArray.length - 1; i++) {
        if(max[0] > oldArray[i + 1][0])
        {
            arrayOrdenated.push(oldArray[i + 1]);
        } else
        {
            arrayOrdenated.push(max);
            max = oldArray[i + 1];
        }
    }
    arrayOrdenated.push(max);
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
    let positionY = Array.from(table.children).indexOf(parentElement);
    let positionX = Array.from(parentElement.children).indexOf(element.parentElement);
    return [positionY, positionX];
}

function removeEvents() {
    for (let i = 0; i < elementsDropables.length; i++) {
        if(i < elementsDragables.length)
        {
            elementsDragables[i].removeEventListener("dragstart", dragStart);
            elementsDragables[i].removeEventListener("dragend", dragEnd);
        }
        elementsDropables[i].removeEventListener("dragenter", dragEnter)
        elementsDropables[i].removeEventListener("dragover", dragOver);
        elementsDropables[i].removeEventListener("dragleave", dragLeave);
        elementsDropables[i].removeEventListener("drop", drop);
    }
}

function addEvents() {
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
}

function restartGame() {
    location.reload();
}



