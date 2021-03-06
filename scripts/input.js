let input = {
    mouse: new MouseEvent('mousemove'),
    
    updateMouse: function(e)
    {
        input.mouse = e;
    },
    
    addListenerTo: function(obj)
    {
        obj.addEventListener('mousemove', this.updateMouse);
        obj.addEventListener('mousedown', this.updateMouse);
        obj.addEventListener('mouseup', this.updateMouse);
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkProximity(pointA, pointB, margin)
{
    return (pointA.x >= pointB.x - margin && pointA.x < pointB.x + margin) && (pointA.y >= pointB.y - margin && pointA.y < pointB.y + margin);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let buttons = {DOM: null, states: []};
buttons.DOM = document.getElementsByClassName("button");
for(let i = 0; i < buttons.DOM.length; ++i)
{
    buttons.DOM[i].addEventListener('click', buttonListClick);
    buttons.states.push(false);
}

buttons.DOM[0].style.borderColor = "white";
buttons.DOM[0].style.backgroundColor = "black";
buttons.DOM[0].style.color = "white";
buttons.states[0] = true;

function buttonListClick(e)
{
    this.style.borderColor = "white";
    this.style.backgroundColor = "black";
    this.style.color = "white";

    for(let i = 0; i < buttons.DOM.length; ++i)
    {
        if(buttons.DOM[i] !== this)
        {
            buttons.DOM[i].style.borderColor = "black";
            buttons.DOM[i].style.backgroundColor = "white";
            buttons.DOM[i].style.color = "black";
            buttons.states[i] = false;
        }
        else
        {
            buttons.states[i] = true;
        }
    }
}

let runButton = document.getElementById("run");
run.addEventListener("click", runButtonClick);

function runButtonClick(e)
{
    if(this.innerHTML === "<b>Run</b>")
        this.innerHTML = "<b>Stop</b>"
    else
        this.innerHTML = "<b>Run</b>";
}
