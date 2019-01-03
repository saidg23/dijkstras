let drw = {
    ctx: null,
    
    bindContext: function(ctx)
    {
        this.ctx = ctx; 
    },
    
    point: function(point, color = '#000000', radius = 1)
    {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    },
    
    line: function(pointA, pointB, color = '#000000', width = 1)
    {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(pointA.x, pointA.y);
        this.ctx.lineTo(pointB.x, pointB.y);
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    },
}
    