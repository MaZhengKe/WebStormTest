import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import skyTexture from '/assets/textures/royal_esplanade_1k.hdr'
import DamagedHelmetPath from '/assets/gltf/DamagedHelmet/DamagedHelmet.gltf'

let mesh, renderer, scene, camera, cube;
let ind = 0;
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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 1;
    controls.maxDistance = 200;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(- 1, 1, 1);

    const SkyTexture = new THREE.TextureLoader().load('/assets/textures/360.jpeg',()=>{
        render();
    });
    const material = new THREE.MeshBasicMaterial({ map: SkyTexture });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position = camera.position;
    scene.add( mesh );
    render();
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        render();

    }

    function render() {

        mesh.position.x += 0.01;
        mesh.position.y += 0.01;
        //mesh.rotation = camera.position;
        renderer.render(scene, camera);
    }
}
