import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import skyTexture from '/assets/textures/royal_esplanade_1k.hdr'
import DamagedHelmetPath from '/assets/gltf/DamagedHelmet/DamagedHelmet.gltf'

let mesh, renderer, scene, camera, cube;

init();

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
    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 1;
    controls.maxDistance = 200;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);

    window.addEventListener('resize', onWindowResize);

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
        onWindowResize();
        render();
    });
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function render() {
    console.log(camera.rotation)
    //requestAnimationFrame(render);
    renderer.render(scene, camera);
};