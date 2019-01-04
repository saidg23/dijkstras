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