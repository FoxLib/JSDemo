// Ширина и высота окна WebGL
let width  = 320;
let height = 240;

// Создание объектов
let scene  = new THREE.Scene();

// 75 - угол обзора; width / height - пропорции; 0.1 .. 1000 дальность прорисовки
let camera   = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();

// Установка ширины и высоты
renderer.setSize( width, height );

// Добавление на страницу
document.body.appendChild( renderer.domElement );

// Создадим какую-нибудь геометрию
let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00c000 } );
let cube     = new THREE.Mesh( geometry, material );

scene.add( cube );

// Слегка отодвинем камеру
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();
