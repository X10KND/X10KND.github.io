if (screen.width > screen.height) {
    var scale = screen.width / 5;
}
else {
    var scale = screen.width / 1.5;
}

var padding = 5;

var n = 3; //Board size n x n
var minSize = 3;
var maxSize = 10;

var animationSteps = 50;

var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

var boardText = document.getElementById("board-text");

var moveCount = 0;
var startTime = 0;
var totalTime = "";

var pieceWidth = 0;

var pieces = [];
var blocks = [];
var numbers = [];

var prevBlankPosition = 0;
var blankPosition = 0;

var backgroundColour = "#000518";
var matchedPieceColour = "#7F7";
var unmatchedPieceColour = "#FFF"

initialize();

function initialize() {

    canvas = createCanvas(n * Math.floor(scale / n) + (n + 1) * padding);

    pieceWidth = Math.floor(scale / n);

    ctx.font = Math.floor(pieceWidth / 2) + "px Arial";

    boardText.innerText = `Board Size ${n}x${n}`;

    pieces = [];
    for (var i = 1; i < n * n; i++) {
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
    if (confirm(`You completed a ${n}x${n} board\nTime: ${totalTime}\nMoves: ${moveCount}\nWould a like to try a larger board?`)) {
        increaseSize();
    }
}

canvas.addEventListener('click', function(event) {

    var canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    var canvasTop = canvas.offsetTop + canvas.clientTop;

    var xPos = event.pageX - canvasLeft;
    var yPos = event.pageY - canvasTop;

    blocks.forEach(function(block) {
        if (yPos > block.top && yPos < block.top + block.height && xPos > block.left && xPos < block.left + block.width) {

            var clickY = Math.round((block.top - padding) / (padding + pieceWidth));
            var clickX = Math.round((block.left - padding) / (padding + pieceWidth));

            var blankY = Math.floor(blankPosition / n);
            var blankX = blankPosition % n;

            if (clickX == blankX) {
                var diff = clickY - blankY;
                if (diff < 0) {
                    for (var i = 1; i <= Math.abs(diff); i++) {
                        move(40, false);
                    }
                    render();
                }
                else if (diff > 0) {
                    for (var i = 1; i <= diff; i++) {
                        move(38, false);
                    }
                    render();
                }
            }
            else if (clickY == blankY) {
                var diff = clickX - blankX;
                if (diff < 0) {
                    for (var i = 1; i <= Math.abs(diff); i++) {
                        move(39, false);
                    }
                    render();
                }
                else if (diff > 0) {
                    for (var i = 1; i <= diff; i++) {
                        move(37, false);
                    }
                    render();
                }
            }

        }
    });

}, false);

function move(key, slide) {

    var y = Math.floor(blankPosition / n);
    var x = blankPosition % n;

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

        var new_y = Math.floor(prevBlankPosition / n);
        var new_x = prevBlankPosition % n;

        var old_y = Math.floor(blankPosition / n);
        var old_x = blankPosition % n;

        var blankBlock = (pieces[blankPosition] + (n * n) - 1) % (n * n);
        var prevBlankBlock = (pieces[prevBlankPosition] + (n * n) - 1) % (n * n);

        if (slide) {

            blocks[blankBlock].top = old_y * (padding + pieceWidth) + padding;
            blocks[blankBlock].left = old_x * (padding + pieceWidth) + padding;

            var metrics = ctx.measureText(numbers[prevBlankBlock].text);
            var fontHeight = metrics.actualBoundingBoxAscent  + metrics.actualBoundingBoxDescent;
            var fontWidth = metrics.width;

            var current_number_top = numbers[prevBlankBlock].top;
            var current_number_left = numbers[prevBlankBlock].left;

            var current_block_top = blocks[prevBlankBlock].top;
            var current_block_left = blocks[prevBlankBlock].left;

            var number_target_top = new_y * (padding + pieceWidth) + padding + (pieceWidth + fontHeight) * 0.5;
            var number_target_left = new_x * (padding + pieceWidth) + padding + (pieceWidth - fontWidth) * 0.5;

            var block_target_top = new_y * (padding + pieceWidth) + padding;
            var block_target_left = new_x * (padding + pieceWidth) + padding;

            var number_top_steps = (number_target_top - current_number_top) / animationSteps;
            var number_left_steps = (number_target_left - current_number_left) / animationSteps;

            var block_top_steps = (block_target_top - current_block_top) / animationSteps;
            var block_left_steps = (block_target_left - current_block_left) / animationSteps;

            blocks[prevBlankBlock].colour = unmatchedPieceColour;

            for (var i = 1; i <= animationSteps; i++) {
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

            var metrics = ctx.measureText(numbers[prevBlankBlock].text);
            var fontHeight = metrics.actualBoundingBoxAscent  + metrics.actualBoundingBoxDescent;
            var fontWidth = metrics.width;

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
    for (var i = 0; i < 10000; i++) {
        var randomMove = Math.floor(Math.random() * 4) + 37;
        move(randomMove, false);
    }
    for (var i = 0; i < n; i++) {
        move(37, false);
        move(38, false);
    }
    moveCount = 0;

    var timeNow = new Date().getTime();
    var timeTaken = new Date() - startTime;
    var minutes = Math.floor(timeTaken / 60);
    var seconds = timeTaken % 60;
    
    totalTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    canvas.style.border = `3px solid ${unmatchedPieceColour}`
}

function addBlocks() {

    for (var i = 0; i < n * n; i++) {

        var y = Math.floor(i / n);
        var x = i % n;

        var colour = (pieces[i] == i + 1) ? matchedPieceColour : unmatchedPieceColour;

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

    for (var i = 0; i < n * n; i++) {

        var y = Math.floor(i / n);
        var x = i % n;

        var metrics = ctx.measureText(pieces[i]);
        var fontHeight = metrics.actualBoundingBoxAscent  + metrics.actualBoundingBoxDescent;
        var fontWidth = metrics.width;

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
        for (var i = 0; i < pieces.length - 1; i++) {
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

var xDown = null;
var yDown = null;

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

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

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