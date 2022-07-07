import * as THREE from 'three';
import {OrbitControls, MapControls} from './MyControls';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import skyTexture from '/assets/textures/royal_esplanade_1k.hdr'
import DamagedHelmetPath from '/assets/gltf/DamagedHelmet/DamagedHelmet.gltf'
import {greaterThan} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {DragControls} from "./MYDragControls";
import {Vector3} from "three";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";

let SkyMesh, renderer, scene, camera, cube;
let ind = 0;
init();

let  gltfscene  = null;
function init() {
    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // tone mapping
    renderer.toneMapping = THREE.NoToneMapping;

    renderer.outputEncoding = THREE.sRGBEncoding;

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 0.01;
    camera.rotation.value = new THREE.Euler(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 0;
    controls.maxDistance = 200;
    controls.enablePan = false;
    controls.rotateSpeed = 0.2;
    controls.enableZoom = false;
    controls.target.set(0, 0, 0);
    controls.update();

// // add event listener to highlight dragged objects
//

    window.addEventListener('resize', onWindowResize);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const SkyTexture = new THREE.TextureLoader().load('/assets/textures/custom-skyboxes-img-01.jpeg', () => {

    });

    const material = new THREE.MeshBasicMaterial({map: SkyTexture});
    SkyMesh = new THREE.Mesh(geometry, material);


    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshBasicMaterial({color: 0x002000, alpha: 0.2});

    const ground = new THREE.Mesh(planeGeo, planeMat);

    ground.rotateX(-3.1415926 / 2);
    // ground.rotateZ(0.2);
    ground.position.y = -1;

    // scene.add(ground);


    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    cube = new THREE.Mesh(cubeGeo, planeMat);


    cube.position.copy(new Vector3( -1.9223491145264011, -0.20982945849902454,0.9106574124212634))
    cube.rotateY( 2.6400000000000)
    cube.scale.copy(new Vector3(0.18644382951210073,0.18644382951210073,0.18644382951210073))

    scene.add(cube);
    scene.add(SkyMesh);

    new RGBELoader().load(skyTexture, function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
            render();
        }
    )

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(DamagedHelmetPath, function (gltf) {

        scene.add(gltf.scene);

        gltfscene = gltf.scene;
        gltfscene.parent = cube;
        onWindowResize();
        render();
    });
    const dcontrols = new DragControls([cube], camera, renderer.domElement);


    dcontrols.addEventListener('click', function (event) {
        console.log("click")
        render();
    });

    dcontrols.addEventListener('drag', function (event) {
        render();
    });


    dcontrols.addEventListener('dragstart', function (event) {
        controls.enabled = false;

    });

    dcontrols.addEventListener('dragend', function (event) {

        controls.enabled = true;
        console.log("end")

    });


    // render();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function render() {

    SkyMesh.position.copy(camera.position);

    // console.log(cube.position)
    // console.log(cube.rotation)
    // console.log(cube.scale)


    renderer.render(scene, camera);

    // console.log(SkyMesh.position)
    // console.log(camera.position)
}