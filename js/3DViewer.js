// All of these variables will be needed later, just ignore them for now.
var container;
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var model;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

window.onload = function(){
  init();
  animate();
}

function init() {
  container = document.getElementById('graphics-viewer');

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set( 0, 6, 11 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  lighting = false;
  ambient = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambient);
  keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
  keyLight.position.set(-100, 0, 100);
  fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);
  backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 45;

  /* Events */
  window.addEventListener('resize', onWindowResize, false);
}

function setObject(mesh, texture) {
  if (model)
    scene.remove(model);

  var textureLoader = new THREE.TextureLoader();
  var map = textureLoader.load('img/textures/' + texture);
  var material = new THREE.MeshBasicMaterial({map: map});

  var loader = new THREE.FBXLoader();
  loader.load('graphics/' + mesh, function (object) {
    object.scale.set(0.01, 0.01, 0.01);
    model = object;

    object.traverse( function (node) {
      if ( node.isMesh )
        node.material = material;
    });
    scene.add(object);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
}

function render() {
  //setTimeout(function() { requestAnimationFrame( animate ); }, 1000 / 30 );
  controls.update();
  renderer.render(scene, camera);
}

function animate() {
  setTimeout(function() { requestAnimationFrame( animate ); }, 1000 );
  controls.update();
  render();
}
