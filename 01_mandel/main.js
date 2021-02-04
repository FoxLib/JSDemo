screen()(2);

function mandel(x, y) {
    
    var a = x, b = y, u, v; 
    for (var i = 1; i < 255; i++) {
        
        if (a*a + b*b > 4)
            return i;
        
        u = a*a - b*b + x;
        v = 2*a*b + y;
        
        a = u; b = v;
    }
    
    return 255;
}

var u = 1/320;
var x0 = -1, y0 = 0;

for (var y = -120; y < 120; y++)
for (var x = -160; x < 160; x++) {
    
    var cl = mandel(x*u + x0, y*u + y0);
    pset(160 + x, 120 + y, 256*(cl));
}
