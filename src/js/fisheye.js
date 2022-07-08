import * as THREE from 'three';
import {OrbitControls, MapControls} from './MyControls';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import fs from './fs.glsl'
import skyTexture from '/assets/textures/royal_esplanade_1k.hdr'
import DamagedHelmetPath from '/assets/gltf/DamagedHelmet/DamagedHelmet.gltf'
import {greaterThan} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {DragControls} from "./MYDragControls";
import {Vector3} from "three";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min";

let SkyMesh, renderer, scene, camera, cube, uniforms, renderCanvas, settings;
let ind = 0;
init();

let gltfscene = null;

function init() {

    renderCanvas = document.getElementById("renderCanvas")


    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(renderCanvas.devicePixelRatio);
    renderer.setSize(renderCanvas.offsetWidth, renderCanvas.offsetHeight);
    renderCanvas.appendChild(renderer.domElement);

    // tone mapping
    renderer.toneMapping = THREE.NoToneMapping;

    // renderer.outputEncoding = THREE.LinearEncoding;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(90, renderCanvas.offsetWidth / renderCanvas.offsetHeight, 0.1, 1000);
    camera.position.z = 0.01;
    camera.rotation.value = new THREE.Euler(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0;
    controls.maxDistance = 200;
    controls.enablePan = false;
    controls.rotateSpeed = 0.2;
    controls.enableZoom = false;
    controls.target.set(0, 0, 0);

    window.addEventListener('resize', onWindowResize);

    // const geometry = new THREE.SphereGeometry(500, 60, 40);
    // // invert the geometry on the x-axis so that all of the faces point inward
    // geometry.scale(-1, 1, 1);

    const SkyTexture = new THREE.TextureLoader().load('/assets/textures/custom-skyboxes-img-01.jpeg', () => {

    });

    SkyTexture.wrapS = THREE.RepeatWrapping;
    SkyTexture.wrapT = THREE.RepeatWrapping;


    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        -1, -1, 0,
        1, -1, 0,
        -1, 1, 0,

        -1, 1, 0,
        1, -1, 0,
        1, 1, 0]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const vs = `
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
attribute vec4 position;
void main()	{

                vec4 Hs = vec4(1,1,0.5,1);
                Hs*= projectionMatrix;
                
  gl_Position = position;
}
`;

    uniforms = {
        iGlobalTime: {type: "f", value: 1.0},
        value01: {type: "f", value: 1.0},
        value02: {type: "f", value: 1.0},
        iResolution: {type: "v3", value: new THREE.Vector3()},
        texture1: {type: "t", value: SkyTexture},
        projectionMatrixInverse: {type: "mat4", value: camera.projectionMatrixInverse},
        viewMatrixInverse: {type: "mat4", value: camera.projectionMatrixInverse},
    };

    uniforms.iResolution.value.x = renderer.domElement.width;
    uniforms.iResolution.value.y = renderer.domElement.height;

    const material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        // blending : THREE.AdditiveBlending
    });

    // const material = new THREE.MeshBasicMaterial({map: SkyTexture});
    SkyMesh = new THREE.Mesh(geometry, material);


    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshBasicMaterial({color: 0x002000, alpha: 0.2});
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotateX(-3.1415926 / 2);
    ground.position.y = -1;
    // scene.add(ground);


    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    cube = new THREE.Mesh(cubeGeo, planeMat);
    cube.position.copy(new Vector3(-1.9223491145264011, -0.20982945849902454, 0.9106574124212634))
    cube.rotateY(2.6400000000000)
    cube.scale.copy(new Vector3(0.18644382951210073, 0.18644382951210073, 0.18644382951210073))

    scene.add(cube);
    scene.add(SkyMesh);

    new RGBELoader().load(skyTexture, function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
            // render();
        }
    )

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(DamagedHelmetPath, function (gltf) {

        scene.add(gltf.scene);

        gltfscene = gltf.scene;
        gltfscene.parent = cube;
        onWindowResize();
        // render();
    });

    const dcontrols = new DragControls([cube], camera, renderer.domElement);

    renderer.domElement.onclick = () => {
        console.log("click")
    }

    dcontrols.addEventListener('dragstart', function (event) {
        controls.enabled = false;

    });

    dcontrols.addEventListener('dragend', function (event) {

        controls.enabled = true;
        console.log("end")

    });

    const panel = new GUI({width: 310});

    const folder3 = panel.addFolder('Visibility');


    settings = {
        'show model': true,
        'show skeleton': false,
        'modify step size': 0.05,
        'from walk to idle': function () {

            prepareCrossFade(walkAction, idleAction, 1.0);

        },
        'from idle to walk': function () {

            prepareCrossFade(idleAction, walkAction, 0.5);

        },
        'from walk to run': function () {

            prepareCrossFade(walkAction, runAction, 2.5);

        },
        'from run to walk': function () {

            prepareCrossFade(runAction, walkAction, 5.0);

        },
        'use default duration': true,
        'set custom duration': 3.5,
        'modify idle weight': 0.0,
        'modify walk weight': 1.0,
        'modify run weight': 0.0,
        'modify time scale': 1.0,
        'value01': 1.0,
        'value02': 1.0,
    };

    folder3.add(settings, 'value01', 0.01, 10, 0.001).listen().onChange(function (weight) {
        console.log(weight);
            uniforms.value01.value = weight
        }
    );
    folder3.add(settings, 'value02', 0.01, 10, 0.001).listen().onChange(function (weight) {
        console.log(weight);
            uniforms.value02.value = weight
        }
    );


    // render();
}

function onWindowResize() {

    camera.aspect = renderCanvas.offsetWidth / renderCanvas.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(renderCanvas.offsetWidth, renderCanvas.offsetHeight);

    render();

}

function render() {

    requestAnimationFrame(render);
    uniforms.viewMatrixInverse.value = camera.matrixWorldInverse
    SkyMesh.position.copy(camera.position);

    // console.log(cube.position)
    // console.log(cube.rotation)
    // console.log(cube.scale)


    renderer.render(scene, camera);

    // console.log(SkyMesh.position)
    // console.log(camera.position)
}