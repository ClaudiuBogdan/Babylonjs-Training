<template>
    <div id="app">
        <canvas id="renderCanvas"></canvas>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Scene} from '@babylonjs/core/scene';
    import {Engine} from '@babylonjs/core/Engines/engine';
    import {FreeCamera, HemisphericLight, Light, Mesh, MeshBuilder, Vector3} from "@babylonjs/core";

    @Component({})

    export default class App extends Vue {

        mounted() {
            // window.addEventListener('DOMContentLoaded', () => {
            //     // Create the game using the 'renderCanvas'.
            //     let game = new Game('renderCanvas');
            //
            //     // Create the scene.
            //     game.createScene();
            //
            //     // Start render loop.
            //     game.doRender();
            // });
            // Create the game using the 'renderCanvas'.
            let game = new Game('renderCanvas');

            // Create the scene.
            game.createScene();

            // Start render loop.
            game.doRender();
        }
    }

    class Game {
        private readonly _canvas: HTMLCanvasElement;
        private readonly _engine: Engine;
        private _scene: Scene;
        private _camera: FreeCamera;
        private _light: Light;

        constructor(canvasElement: string) {
            // Create canvas and engine.
            this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
            this._engine = new Engine(this._canvas, true);

            // Create a basic BJS Scene object.
            this._scene = new Scene(this._engine);

            // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
            this._camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this._scene);

            // Create a basic light, aiming 0,1,0 - meaning, to the sky.
            this._light = new HemisphericLight('light1', new Vector3(1, 1, 0), this._scene);
        }

        createScene(): void {
            // Target the camera to scene origin.
            this._camera.setTarget(Vector3.Zero());

            // Attach the camera to the canvas.
            this._camera.attachControl(this._canvas, false);

            // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
            let sphere = MeshBuilder.CreateSphere('sphere1',
                {segments: 16, diameter: 2}, this._scene);

            // Move the sphere upward 1/2 of its height.
            sphere.position.y = 1;

            // Create a built-in "ground" shape.
            let ground = MeshBuilder.CreateGround('ground1',
                {width: 6, height: 6, subdivisions: 2}, this._scene);
        }

        doRender(): void {
            // Run the render loop.
            this._engine.runRenderLoop(() => {
                this._scene.render();
            });

            // The canvas/window resize event handler.
            window.addEventListener('resize', () => {
                this._engine.resize();
            });
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }

    html, body {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #renderCanvas {
        width: 100%;
        height: 100%;
        touch-action: none;
    }
</style>
