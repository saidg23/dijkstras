let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");
drw.bindContext(buffer);

let graphParameters = {density: 35, nodeRadius: 5}

function nodeData()
{
    this.pos = new Vector();
    this.color = '#ffffff';
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        if(subtractVectors(nodeA, graph.nodeList[i].data.pos).getMagnitude() < maxDistance && (nodeB.x !== graph.nodeList[i].data.pos.x && nodeB.y !== graph.nodeList[i].data.pos.y))
        {
            for(let j = 0; j < graph.nodeList[i].edges.length; ++j)
            {
                let orientationA = getOrientation(nodeA, nodeB, graph.nodeList[i].data.pos);
                let orientationB = getOrientation(nodeA, nodeB, graph.nodeList[i].edges[j].data.pos);
                let orientationC = getOrientation(graph.nodeList[i].data.pos, graph.nodeList[i].edges[j].data.pos, nodeA);
                let orientationD = getOrientation(graph.nodeList[i].data.pos, graph.nodeList[i].edges[j].data.pos, nodeB);

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
        let newNode = new nodeData();
        newNode.pos.x = Math.floor(20 + Math.random() * (canvas.width - 40));
        newNode.pos.y = Math.floor(20 + Math.random() * (canvas.height - 40));

        let valid = true;
        for(let i = 0; i < graph.nodeCount; ++i)
        {
            if(subtractVectors(newNode.pos, graph.nodeList[i].data.pos).getMagnitude() < separationDistance)
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
            if(subtractVectors(graph.nodeList[j].data.pos, graph.nodeList[i].data.pos).getMagnitude() < maxDistance)
            {
                let intersects = checkIntersection(graph.nodeList[i].data.pos, graph.nodeList[j].data.pos, graph, maxDistance);

                if(Math.random() < 0.90 && !intersects)
                {
                    graph.link(i, j);
                }
            }
        }
    }
}

function drawGraph(graph, pointRadius)
{
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        let edges = graph.nodeList[i].edges;
        for(let j = 0; j < edges.length; ++j)
        {
            drw.line(graph.nodeList[i].data.pos, edges[j].data.pos, '#ffffff');
        }
    }
    
    for(let i = 0; i < graph.nodeCount; ++i)
    {
        let node = graph.nodeList[i];
        drw.circle(node.data.pos, node.data.color, pointRadius);
    }
}

let test = new Graph();

do
{
    generateGraph(test, graphParameters.density);
}
while(!test.isConnected())
 
drawGraph(test, graphParameters.nodeRadius);