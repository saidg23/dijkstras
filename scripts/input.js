let input = {
    mouse: new MouseEvent('mousemove'),
    
    mouseMove: function(e)
    {
        input.mouse = e;
    },
    
    addListenerTo: function(obj)
    {
        obj.addEventListener('mousemove', this.mouseMove);
    }
}

