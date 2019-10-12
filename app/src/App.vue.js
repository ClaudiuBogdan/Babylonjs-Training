import { __decorate } from "tslib";
import { Component, Vue } from 'vue-property-decorator';
import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
let App = class App extends Vue {
};
App = __decorate([
    Component({
        methods: {
            initBabylon: function () {
                const canvas = document.getElementById('renderCanvas');
                // load the 3D engine
                const engine = new Engine(canvas, true);
                // createScene function that creates and return the scene
                const createScene = function () {
                    // create a basic BJS Scene object
                    const scene = new Scene(engine);
                    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
                    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
                    // target the camera to scene origin
                    camera.setTarget(Vector3.Zero());
                    // attach the camera to the canvas
                    camera.attachControl(canvas, false);
                    // create a basic light, aiming 0,1,0 - meaning, to the sky
                    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
                    // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
                    const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene);
                    // move the sphere upward 1/2 of its height
                    sphere.position.y = 1;
                    // create a built-in "ground" shape;
                    const ground = Mesh.CreateGround('ground1', 6, 6, 2, scene);
                    // return the created scene
                    return scene;
                };
                // call the createScene function
                const scene = createScene();
                // run the render loop
                engine.runRenderLoop(function () {
                    scene.render();
                });
                // the canvas/window resize event handler
                window.addEventListener('resize', function () {
                    engine.resize();
                });
            },
        },
        mounted: function () {
            window.addEventListener('DOMContentLoaded', this.initBabylon.bind(this));
        }
    })
], App);
export default App;
//# sourceMappingURL=App.vue.js.map