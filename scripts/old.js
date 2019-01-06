
let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");
let map = new Graph();
let vertexRadius = 7;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function drawGraph(graph, pointRadius = 5)
{
    buffer.strokeStyle = "#ffffff";
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        let current = graph.nodeList[i];

        for(let j = 0; j < current.edges.length; ++j)
        {
            buffer.beginPath();
            buffer.moveTo(current.data.x - pointRadius / 2, current.data.y);
            buffer.lineTo(current.edges[j].data.x - pointRadius / 2, current.edges[j].data.y);
            buffer.lineWidth = 2;
            buffer.stroke();
        }
    }
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        let current = graph.nodeList[i];

        buffer.fillStyle = "#ffffff";
        if(graph.nodeStates[i].selectedAs === "start")
        {
            buffer.fillStyle = "#00ff00";
        }
        else if(graph.nodeStates[i].selectedAs === "end")
        {
            buffer.fillStyle = "#80aaff";
        }

        if(checkProximity(mousePos.x, current.data.x - pointRadius / 2, 11) && checkProximity(mousePos.y, current.data.y - document.documentElement.scrollTop, 11))
        {
            if(graph.nodeStates[i].selectedAs === "none")
                buffer.fillStyle = "#ff0000";
            else
                buffer.fillStyle = "#ff872b";
        }

        buffer.beginPath();
        buffer.arc(current.data.x - pointRadius / 2, current.data.y, pointRadius, 0, 2 * Math.PI);
        buffer.fill();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function NodeState()
{
    this.selectedAs= "none";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Vector(nx = 0, ny = 0)
{
    this.x = nx;
    this.y = ny;
}

function getVecMagnitude(a)
{
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function subtractVec(i, j)
{
    return new Vector(i.x - j.x, i.y - j.y);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

canvas.addEventListener("click", select);

function checkProximity(a, b, r)
{
    return a > b - r && a < b + r; 
}

function select(e)
{
    let xpos = e.clientX - canvas.offsetLeft;
    let ypos = e.clientY - canvas.offsetTop;

    for(let i = 0; i < map.nodeCount; ++i)
    {
        if(checkProximity(xpos, map.nodeList[i].data.x, 11) && checkProximity(ypos, map.nodeList[i].data.y - document.documentElement.scrollTop, 11))
        {
            for(let j = 0; j < map.nodeCount; ++j)
            {
                if(endSelect && map.nodeStates[j].selectedAs !== "start")
                    map.nodeStates[j].selectedAs = "none";

                if(startSelect && map.nodeStates[j].selectedAs !== "end")
                    map.nodeStates[j].selectedAs = "none";
            }

            if(startSelect)
                map.nodeStates[i].selectedAs = "start";
            else if(endSelect)
                map.nodeStates[i].selectedAs = "end";

            buffer.clearRect(0, 0, canvas.width, canvas.height);
            drawGraph(map, vertexRadius);
            return;
        }
    }
}

canvas.addEventListener("mousemove", mouseHover);

let mousePos = new Vector();

function mouseHover(e)
{
    mousePos.x = e.clientX - canvas.offsetLeft;
    mousePos.y = e.clientY - canvas.offsetTop;
    buffer.clearRect(0, 0, canvas.width, canvas.height);
    drawGraph(map, vertexRadius);
}

let buttons = document.getElementsByClassName("button");
let runButton = document.getElementById("run");
let startSelectButton = document.getElementById("startNode");
let endSelectButton = document.getElementById("endNode");
let startSelect = true;
let endSelect = false;

buttons[0].style.borderColor = "white";
buttons[0].style.backgroundColor = "black";
buttons[0].style.color = "white";
runButton.addEventListener("click", runButtonClick);

for(let i = 0; i < buttons.length; ++i)
{
    buttons[i].addEventListener("click", buttonClick);
}

startSelectButton.addEventListener("click", startSelectButtonClick);
endSelectButton.addEventListener("click", endSelectButtonClick);



function runButtonClick(e)
{
    if(this.innerHTML === "<b>Run</b>")
    {
        this.innerHTML = "<b>Stop</b>";
        this.style.color = "white";
        this.style.backgroundColor = "red";
    }
    else
    {
        this.innerHTML = "<b>Run</b>";
        this.style.color = "black";
        this.style.backgroundColor = "white";
    }
}

function startSelectButtonClick()
{
    startSelect = true;
    endSelect = false;
}

function endSelectButtonClick()
{
    endSelect = true;
    startSelect = false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getNextNode(graph, unvisited, distances)
{
    let closest = null;

    for(let i = 0; i < distances.length; ++i)
    {
        if(distances[i] < distances[closest] && unvisited.includes(graph.nodeList[i]) || closest === null && unvisited.includes(graph.nodeList[i]))
            closest = i;
    }

    return closest;
}

function dijkstras(graph, startNode)
{
    let unvisited = [];
    let distances = [];
    let previousNode = [];
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        unvisited[i] = graph.nodeList[i];
        distances[i] = Infinity;
        previousNode[i] = null;
    }

    distances[startNode] = 0;

    while(unvisited.length > 0)
    {
        let currentIndex = getNextNode(graph, unvisited, distances);
        let currentNode = graph.nodeList[currentIndex];

        let unvisistedIndex = unvisited.indexOf(currentNode);
        unvisited.splice(unvisistedIndex, 1);

        for(let i = 0; i < currentNode.edges.length; ++i)
        {
            let newDistance = distances[currentIndex] + getVecMagnitude(subtractVec(currentNode.data, currentNode.edges[i].data));
            
            let edgeIndex = graph.nodeList.indexOf(currentNode.edges[i])
            if(newDistance < distances[edgeIndex])
            {
                distances[edgeIndex] = newDistance;
                previousNode[edgeIndex] = currentIndex;
            }
        }
    }

    return previousNode;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
do
{
    generateGraph(map, 50);
}
while(!map.isConnected())

map.nodeStates = []

for(let i = 0; i < map.nodeCount; ++i)
{
    map.nodeStates[i] = new NodeState();
}

drawGraph(map, vertexRadius);

function getStartNode(graph)
{
    for(let i = 0; i < graph.nodeStates.length; ++i)
    {
        if(graph.nodeStates[i].selectedAs === "start")
            return i;
    }
}

function getEndNode(graph)
{
    for(let i = 0; i < graph.nodeStates.length; ++i)
    {
        if(graph.nodeStates[i].selectedAs === "end")
            return i;
    }
}
    
function drawPath(graph, path)
{
    let startNode = getStartNode(graph);
    let endNode = getEndNode(graph);
    let currentNode = endNode;

    while(currentNode !== startNode)
    {
        buffer.beginPath()
        buffer.moveTo(graph.nodeList[currentNode].data.x - vertexRadius / 2, graph.nodeList[currentNode].data.y);
        buffer.lineTo(graph.nodeList[path[currentNode]].data.x - vertexRadius / 2, graph.nodeList[path[currentNode]].data.y);
        buffer.strokeStyle = "#ff0000";
        buffer.stroke();
        currentNode = path[currentNode];
    }
}
