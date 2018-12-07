let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");

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

function drawGraph()
{
    buffer.fillStyle = "#ffffff";
    buffer.strokeStyle = "#ffffff";
    for(let i = 0; i < map.nodeCount; ++i)
    {
        let current = map.nodeList[i];
        
        buffer.beginPath();
        buffer.arc(current.data.x, current.data.y, 5, 0, 2 * Math.PI);
        buffer.fill();

        for(let j = 0; j < current.edges.length; ++j)
        {
            buffer.beginPath();
            buffer.moveTo(current.data.x, current.data.y);
            buffer.lineTo(current.edges[j].data.x, current.edges[j].data.y);
            buffer.stroke();
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let map = new Graph();

function update()
{
    buffer.clearRect(0, 0, canvas.width, canvas.height);
    generateGraph(map, 50);
    drawGraph();
    
    //window.requestAnimationFrame(update);
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
                return 0;
        }

        visited.push(current);
        let childNode = current.edges.length - 1;
        let count = 0;
        while(childNode >= 0)
        {
            count += this.DFS(current.edges[childNode], visited);
            childNode--;
        }

        return count;
    }

    this.isConnected = function()
    {
        let visited = [];

        if(this.DFS(this.nodeList[0], visited) < this.nodeCount)
            return false;
        else
            return true;
    }

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

window.requestAnimationFrame(update);
