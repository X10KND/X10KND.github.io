let scale = 400;

if (screen.width > screen.height) {
    scale = screen.width / 5;
}
else {
    scale = screen.width / 1.5;
}

let padding = 5;

let n = 3; //Board size n x n
let minSize = 3;
let maxSize = 10;

let animationSteps = 50;

let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");

let boardText = document.getElementById("board-text");

let moveCount = 0;
let startTime = 0;
let totalTime = "";

let pieceWidth = 0;

let pieces = [];
let blocks = [];
let numbers = [];

let prevBlankPosition = 0;
let blankPosition = 0;

let backgroundColour = "#000518";
let matchedPieceColour = "#7F7";
let unmatchedPieceColour = "#FFF"

initialize();

function initialize() {

    canvas = createCanvas(n * Math.floor(scale / n) + (n + 1) * padding);

    pieceWidth = Math.floor(scale / n);

    ctx.font = Math.floor(pieceWidth / 2) + "px Arial";

    boardText.innerText = `Board Size ${n}x${n}`;

    pieces = [];
    for (let i = 1; i < n * n; i++) {
        pieces.push(i);
    }
    pieces.push(0);

    blocks = [];
    numbers = [];

    prevBlankPosition = pieces.length - 1;
    blankPosition = pieces.length - 1;

    addBlocks();
    addNumbers();
    shuffle();
    render();
}

function createCanvas(size, set2dTransform = true) {

    const ratio = Math.ceil(window.devicePixelRatio);
    
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    if (set2dTransform) {
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    return canvas;
}

function increaseSize() {
    if (n < maxSize) {
        n++;
        initialize();
    }
}

function decreaseSize() {
    if (n > minSize) {
        n--;
        initialize();
    }
}

function newGame() {
    if (confirm("Are you sure you want to start a new game?")) {
        shuffle();
        render();
    }
}

function declareWin() {

    let timeTaken = new Date().getTime() - startTime;
    timeTaken = Math.floor(timeTaken / 1000);

    let minutes = Math.floor(timeTaken / 60);
    let seconds = timeTaken % 60;
    
    totalTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (confirm(`You completed a ${n}x${n} board\nTime: ${totalTime}\nMoves: ${moveCount}\nWould a like to try a larger board?`)) {
        increaseSize();
    }
}

canvas.addEventListener('click', function(event) {

    let canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    let canvasTop = canvas.offsetTop + canvas.clientTop;

    let xPos = event.pageX - canvasLeft;
    let yPos = event.pageY - canvasTop;

    blocks.forEach(function(block) {
        if (yPos > block.top && yPos < block.top + block.height && xPos > block.left && xPos < block.left + block.width) {

            let clickY = Math.round((block.top - padding) / (padding + pieceWidth));
            let clickX = Math.round((block.left - padding) / (padding + pieceWidth));

            let blankY = Math.floor(blankPosition / n);
            let blankX = blankPosition % n;

            if (clickX == blankX) {
                let diff = clickY - blankY;
                if (diff < 0) {
                    for (let i = 1; i <= Math.abs(diff); i++) {
                        move(40, false);
                    }
                    render();
                }
                else if (diff > 0) {
                    for (let i = 1; i <= diff; i++) {
                        move(38, false);
                    }
                    render();
                }
            }
            else if (clickY == blankY) {
                let diff = clickX - blankX;
                if (diff < 0) {
                    for (let i = 1; i <= Math.abs(diff); i++) {
                        move(39, false);
                    }
                    render();
                }
                else if (diff > 0) {
                    for (let i = 1; i <= diff; i++) {
                        move(37, false);
                    }
                    render();
                }
            }

        }
    });

}, false);

function move(key, slide) {

    let y = Math.floor(blankPosition / n);
    let x = blankPosition % n;

    movedFlag = false;
    
    if (key == 40) {
        if (y > 0) {
            pieces[blankPosition] = pieces[(y - 1) * n + x];
            prevBlankPosition = blankPosition;
            blankPosition = (y - 1) * n + x;
            pieces[blankPosition] = 0;
            movedFlag = true;
        }
    }
    else if (key == 38) {
        if (y < n - 1) {
            pieces[blankPosition] = pieces[(y + 1) * n + x];
            prevBlankPosition = blankPosition;
            blankPosition = (y + 1) * n + x;
            pieces[blankPosition] = 0;
            movedFlag = true;
        }
    }
    else if (key == 39) {
        if (x > 0) {
            pieces[blankPosition] = pieces[y * n + (x - 1)];
            prevBlankPosition = blankPosition;
            blankPosition = y * n + (x - 1);
            pieces[blankPosition] = 0;
            movedFlag = true;
        }
    }
    else if (key == 37) {
        if (x < n - 1) {
            pieces[blankPosition] = pieces[y * n + (x + 1)];
            prevBlankPosition = blankPosition;
            blankPosition = y * n + (x + 1);
            pieces[blankPosition] = 0;
            movedFlag = true;
        }
    }

    if (movedFlag) {

        moveCount++;

        if (moveCount == 1) {
            startTime = new Date().getTime();
        }

        let new_y = Math.floor(prevBlankPosition / n);
        let new_x = prevBlankPosition % n;

        let old_y = Math.floor(blankPosition / n);
        let old_x = blankPosition % n;

        let blankBlock = (pieces[blankPosition] + (n * n) - 1) % (n * n);
        let prevBlankBlock = (pieces[prevBlankPosition] + (n * n) - 1) % (n * n);

        if (slide) {

            blocks[blankBlock].top = old_y * (padding + pieceWidth) + padding;
            blocks[blankBlock].left = old_x * (padding + pieceWidth) + padding;

            let metrics = ctx.measureText(numbers[prevBlankBlock].text);
            let fontHeight = metrics.actualBoundingBoxAscent  + metrics.actualBoundingBoxDescent;
            let fontWidth = metrics.width;

            let current_number_top = numbers[prevBlankBlock].top;
            let current_number_left = numbers[prevBlankBlock].left;

            let current_block_top = blocks[prevBlankBlock].top;
            let current_block_left = blocks[prevBlankBlock].left;

            let number_target_top = new_y * (padding + pieceWidth) + padding + (pieceWidth + fontHeight) * 0.5;
            let number_target_left = new_x * (padding + pieceWidth) + padding + (pieceWidth - fontWidth) * 0.5;

            let block_target_top = new_y * (padding + pieceWidth) + padding;
            let block_target_left = new_x * (padding + pieceWidth) + padding;

            let number_top_steps = (number_target_top - current_number_top) / animationSteps;
            let number_left_steps = (number_target_left - current_number_left) / animationSteps;

            let block_top_steps = (block_target_top - current_block_top) / animationSteps;
            let block_left_steps = (block_target_left - current_block_left) / animationSteps;

            blocks[prevBlankBlock].colour = unmatchedPieceColour;

            for (let i = 1; i <= animationSteps; i++) {
                setTimeout(function() {
                    numbers[prevBlankBlock].top += number_top_steps;
                    numbers[prevBlankBlock].left += number_left_steps;

                    blocks[prevBlankBlock].top += block_top_steps;
                    blocks[prevBlankBlock].left += block_left_steps;
                    render(true);
                }, i);
            }

            if (pieces[prevBlankBlock] == prevBlankBlock + 1) {
                blocks[prevBlankBlock].colour = matchedPieceColour;
            }

            render();

        }
        else {

            let metrics = ctx.measureText(numbers[prevBlankBlock].text);
            let fontHeight = metrics.actualBoundingBoxAscent  + metrics.actualBoundingBoxDescent;
            let fontWidth = metrics.width;

            numbers[prevBlankBlock].top = new_y * (padding + pieceWidth) + padding + (pieceWidth + fontHeight) * 0.5;
            numbers[prevBlankBlock].left = new_x * (padding + pieceWidth) + padding + (pieceWidth - fontWidth) * 0.5;


            blocks[blankBlock].top = old_y * (padding + pieceWidth) + padding;
            blocks[blankBlock].left = old_x * (padding + pieceWidth) + padding;

            blocks[prevBlankBlock].colour = unmatchedPieceColour;

            blocks[prevBlankBlock].top = new_y * (padding + pieceWidth) + padding;
            blocks[prevBlankBlock].left = new_x * (padding + pieceWidth) + padding;

            if (pieces[prevBlankBlock] == prevBlankBlock + 1) {
                blocks[prevBlankBlock].colour = matchedPieceColour;
            }

        }
    }
}

function shuffle() {
    for (let i = 0; i < 10000; i++) {
        let randomMove = Math.floor(Math.random() * 4) + 37;
        move(randomMove, false);
    }
    for (let i = 0; i < n; i++) {
        move(37, false);
        move(38, false);
    }
    moveCount = 0;
    canvas.style.border = `3px solid ${unmatchedPieceColour}`
}

function addBlocks() {

    for (let i = 0; i < n * n; i++) {

        let y = Math.floor(i / n);
        let x = i % n;

        let colour = (pieces[i] == i + 1) ? matchedPieceColour : unmatchedPieceColour;

        if (pieces[i] == 0) {
            colour = backgroundColour;
        }

        blocks.push({
            colour: colour,
            width: pieceWidth,
            height: pieceWidth,
            top: y * (padding + pieceWidth) + padding,
            left: x * (padding + pieceWidth) + padding,
        });
        
    }
}

function addNumbers() {

    for (let i = 0; i < n * n; i++) {

        let y = Math.floor(i / n);
        let x = i % n;

        let metrics = ctx.measureText(pieces[i]);
        let fontHeight = metrics.actualBoundingBoxAscent  + metrics.actualBoundingBoxDescent;
        let fontWidth = metrics.width;

        numbers.push({
            colour: backgroundColour,
            text: (pieces[i]) == 0 ? "" : pieces[i],
            top: y * (padding + pieceWidth) + padding + (pieceWidth + fontHeight) * 0.5,
            left: x * (padding + pieceWidth) + padding + (pieceWidth - fontWidth) * 0.5,
        });
        
    }
}

function render(slide=false) {

    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    blocks.forEach(function(block) {

        if (block.colour != backgroundColour) {
            ctx.fillStyle = block.colour;
            ctx.fillRect(block.left, block.top, block.width, block.height);
        }
    });

    numbers.forEach(function(number) {
        ctx.fillStyle = number.colour;
        ctx.fillText(number.text, number.left, number.top);
    });

    if(!slide) {
        winFlag = true;
        for (let i = 0; i < pieces.length - 1; i++) {
            if(pieces[i] != i + 1) {
                winFlag = false;
                break;
            }
        }

        if (winFlag) {
            canvas.style.border = `3px solid ${matchedPieceColour}`
            setTimeout(declareWin, 500);
        }
    }

}

document.addEventListener('keydown', function(event) {
    move(event.keyCode, true);
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            move(37, true);
        }
        else {
            move(39, true);
        }
    } else {
        if (yDiff > 0) {
            move(38, true);
        }
        else { 
            move(40, true);
        } 
    }
    
    xDown = null;
    yDown = null;
}