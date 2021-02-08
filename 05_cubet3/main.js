class application {

    constructor() {

        // Ширина и высота окна WebGL
        [this.width, this.height] = [320, 200];

        // Создание объектов
        this.scene  = new THREE.Scene();

        // 75 - угол обзора; width / height - пропорции; 0.1 .. 1000 дальность прорисовки
        this.camera   = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();

        // Установка ширины и высоты
        this.renderer.setSize( this.width, this.height );

        // Добавление на страницу
        document.body.appendChild( this.renderer.domElement );
    }

    // Создадим какую-нибудь геометрию
    init() {

        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( { color: 0x00c000 } );
        let cube     = new THREE.Mesh( geometry, material );

        const texture = new THREE.TextureLoader().load( "water.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        this.scene.add( cube );
    }

    animate() {

        // Слегка отодвинем камеру
        this.camera.position.x = 1;
        this.camera.position.y = 1;
        this.camera.position.z = 3;

        requestAnimationFrame( this.animate.bind(this) );
        this.renderer.render( this.scene, this.camera );
    }

}
