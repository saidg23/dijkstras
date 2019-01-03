function Vector(x = 0, y = 0)
{
    this.x = x;
    this.y = y;
    
    this.getMagnitude = function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
}

function addVectors(a, b)
{
    return new Vector(a.x + b.x, a.y + b.y);
}

function subtractVectors(a, b)
{
    return new Vector(a.x - b.x, a.y - b.y);
}