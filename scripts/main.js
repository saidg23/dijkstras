let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");

let a = new Vector(10, 10);
let b = new Vector(50, 50);

drw.bindContext(buffer);

drw.line(a, b, '#ffffff');

let c = new Vector(200, 200);

drw.point(c, '#ffffff', 20);

buffer.strokeStyle = '#000000';
buffer.beginPath();
buffer.arc(c.x, c.y, 10, 0, Math.PI * 2);
buffer.stroke();

buffer.strokeStyle = '#ff0000';
buffer.beginPath();
buffer.arc(c.x, c.y, 2, 0, Math.PI * 2);
buffer.stroke();
