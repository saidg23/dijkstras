let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");
let map = new Graph();
let vertexRadius = 7;

function getOrientation(a, b, c)
{
    let value = ((b.y + 0.001) - (a.y - 0.001)) * ((c.x + 0.001) - (b.x - 0.001)) - ((b.x + 0.001) - (a.x - 0.001)) * ((c.y + 0.001) - (b.y - 0.001));

    if(value === 0)
        return 0;
    if(value > 0)
        return 1;
    else
       return 2;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkIntersection(nodeA, nodeB, graph, maxDistance)
{
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        if(getVecMagnitude(subtractVec(nodeA, graph.nodeList[i].data)) < maxDistance && (nodeB.x !== graph.nodeList[i].data.x && nodeB.y !== graph.nodeList[i].data.y))
        {
            for(let j = 0; j < graph.nodeList[i].edges.length; ++j)
            {
                let orientationA = getOrientation(nodeA, nodeB, graph.nodeList[i].data);
                let orientationB = getOrientation(nodeA, nodeB, graph.nodeList[i].edges[j].data);
                let orientationC = getOrientation(graph.nodeList[i].data, graph.nodeList[i].edges[j].data, nodeA);
                let orientationD = getOrientation(graph.nodeList[i].data, graph.nodeList[i].edges[j].data, nodeB);

                if(orientationA !== orientationB && orientationC !== orientationD)
                {
                    return true;
                }
            }
        }
    }

    return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateGraph(graph, separationDistance)
{
    let attempt = 0;
    while(attempt < 90)
    {
        let newNode = new Vector();
        newNode.x = Math.floor(20 + Math.random() * (canvas.width - 40));
        newNode.y = Math.floor(20 + Math.random() * (canvas.height - 40));

        let valid = true;
        for(let i = 0; i < graph.nodeCount; ++i)
        {
            if(getVecMagnitude(subtractVec(newNode, graph.nodeList[i].data)) < separationDistance)
            {
                valid = false;
                break;
            }
        }
        
        if(valid)
        {
            graph.push(newNode);
            attempt = 0;
        }
        else
        {
            attempt++;
        }
    }

    let maxDistance = separationDistance / 0.5417;
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        for(let j = 0; j < graph.nodeCount; ++j)
        {
            if(getVecMagnitude(subtractVec(graph.nodeList[j].data, graph.nodeList[i].data)) < maxDistance)
            {
                let intersects = checkIntersection(graph.nodeList[i].data, graph.nodeList[j].data, graph, maxDistance);

                if(Math.random() < 0.90 && !intersects)
                {
                    graph.link(i, j);
                }
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawGraph(pointRadius = 5)
{
    buffer.strokeStyle = "#ffffff";
    for(let i = 0; i < map.nodeCount; ++i)
    {
        let current = map.nodeList[i];

        for(let j = 0; j < current.edges.length; ++j)
        {
            buffer.beginPath();
            buffer.moveTo(current.data.x - pointRadius / 2, current.data.y);
            buffer.lineTo(current.edges[j].data.x - pointRadius / 2, current.edges[j].data.y);
            buffer.lineWidth = 2;
            buffer.stroke();
        }
    }
    for(let i = 0; i < map.nodeCount; ++i)
    {
        let current = map.nodeList[i];

        buffer.fillStyle = "#ffffff";
        if(map.nodeStates[i].selectedAs === "start")
        {
            buffer.fillStyle = "#00ff00";
        }
        else if(map.nodeStates[i].selectedAs === "end")
        {
            buffer.fillStyle = "#80aaff";
        }

        if(checkProximity(mousePos.x, current.data.x - pointRadius / 2, 11) && checkProximity(mousePos.y, current.data.y - document.documentElement.scrollTop, 11))
        {
            if(map.nodeStates[i].selectedAs === "none")
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

function Graph()
{
    this.nodeCount = 0;
    this.nodeList = [];
    
    this.Node = function(data = null)
    {
        this.data = data;
        this.edges = [];
    };
    
    this.push = function(data)
    {
        this.nodeList.push(new this.Node(data));
        this.nodeCount = this.nodeList.length;
    };
    
    this.link = function(node, targetNode)
    {
        if(this.nodeList[node] === this.nodeList[targetNode])
            return;

        for(let i = 0; i < this.nodeList[node].edges.length; ++i)
        {
            if(this.nodeList[targetNode] === this.nodeList[node].edges[i])
                return;
        }

        this.nodeList[node].edges.push(this.nodeList[targetNode]);
        this.nodeList[targetNode].edges.push(this.nodeList[node]);
    };

    this.DFS = function(current, visited)
    {
        for(let i = 0; i < visited.length; ++i)
        {
            if(current === visited[i])
                return;
        }

        visited.push(current);
        let childNode = current.edges.length - 1;
        let count = 0;
        while(childNode >= 0)
        {
            this.DFS(current.edges[childNode], visited);
            childNode--;
        }

        return;
    }

    this.isConnected = function()
    {
        let visited = [];
        this.DFS(this.nodeList[0], visited);

        return visited.length === this.nodeCount;
    }

}

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
            drawGraph(vertexRadius);
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
    drawGraph(vertexRadius);
}

let buttons = document.getElementsByClassName("button");
let runButton = document.getElementById("run");
let startSelectButton = document.getElementById("startNode");
let endSelectButton = document.getElementById("endNode");
let startSelect = true;
let endSelect = false;

buttons[0].style.borderColor = "#1e527a";
runButton.addEventListener("click", runButtonClick);
for(let i = 0; i < buttons.length; ++i)
{
    buttons[i].addEventListener("click", buttonClick);
}

startSelectButton.addEventListener("click", startSelectButtonClick);
endSelectButton.addEventListener("click", endSelectButtonClick);

function buttonClick(e)
{
    this.style.borderColor = "#1e527a";
    for(let i = 0; i < buttons.length; ++i)
    {
        if(buttons[i] !== this)
            buttons[i].style.borderColor = "#000000";
    }
}

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

drawGraph(vertexRadius);
