<template>
    <div id="app">
        <canvas id="renderCanvas"></canvas>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Scene} from '@babylonjs/core/scene';
    import {Engine} from '@babylonjs/core/Engines/engine';
    import {
        ActionManager,
        Color3, ExecuteCodeAction,
        FreeCamera,
        HemisphericLight,
        Light,
        Mesh,
        MeshBuilder,
        StandardMaterial,
        Vector3
    } from "@babylonjs/core";

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
        private _sphere: Mesh;

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

            // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
            this._sphere = MeshBuilder.CreateSphere('sphere1',
                {segments: 16, diameter: 2}, this._scene);
        }

        createScene(): void {
            // Target the camera to scene origin.
            this._camera.setTarget(Vector3.Zero());

            // Attach the camera to the canvas.
            this._camera.attachControl(this._canvas, false);

            // Move the sphere upward 1/2 of its height.
            this._sphere.position.y = 1;

            // Create a built-in "ground" shape.
            let ground = MeshBuilder.CreateGround('ground1',
                {width: 6, height: 6, subdivisions: 2}, this._scene);

            this.setCollisionScene();
        }

        setCollisionScene(): void{
            const scene = this._scene;
            const sphere = this._sphere;
            scene.collisionsEnabled = true;
            const redMaterial = new StandardMaterial("redMaterial", scene);
            redMaterial.diffuseColor = new Color3(1, 0, 0);

            const blueMaterial = new StandardMaterial("blueMaterial", scene);
            blueMaterial.diffuseColor = new Color3(0, 0, 1);

            const box = Mesh.CreateBox("box", 1, scene);
            box.position = new Vector3(-2, 0.5, 0);
            box.material = redMaterial;

            const box2 = Mesh.CreateBox("box2", 0.5, scene);
            box2.position = new Vector3(2, 0.25, 0);
            box2.material = blueMaterial;

            /* Movement */
            const keys = {
                move: true,
                blocked: false,
                direction: new Vector3(0, 0, 0),
                speed: 0.01
            };

            box.actionManager = new ActionManager(scene);
            const collisionObjectList = [box2, sphere];
            const registeredActionList = this.registerCollisionDetection(box, collisionObjectList, keys);

            setTimeout(()=>{
                this.unregisterCollisionDetection(box, registeredActionList, keys)
                console.log("Remove interactions");
            }, 5000);


            const ground = Mesh.CreateGround("ground", 10, 10, 2, scene);
            ground.checkCollisions = true;

            window.addEventListener("keydown", handleKeyDown, false);
            window.addEventListener("keyup",   handleKeyUp,   false);

            function handleKeyDown(evt: KeyboardEvent) {
                if (evt.key=='a') {
                    keys.direction.x = -10;
                }
                if (evt.key=='d') {
                    keys.direction.x = 10;
                }
                if (evt.key=='w') {
                    keys.direction.z = 10;
                }
                if (evt.key=='s') {
                    keys.direction.z = -10;
                }
            }

            function handleKeyUp(evt: KeyboardEvent) {
                keys.direction = Vector3.Zero();
            }

            scene.registerBeforeRender(function() {
                if (keys.move) {
                    box.position.addInPlace(keys.direction.scale(keys.speed));
                }
            });
        }

        registerCollisionDetection(mainObject: Mesh, collisionObjectList: Array<Mesh>, keys: any): Array<ExecuteCodeAction>{
            const registeredActions = [] as Array<ExecuteCodeAction>;
            collisionObjectList.forEach(object => {
                //@ts-ignore
                registeredActions.push(mainObject.actionManager.registerAction(new ExecuteCodeAction({
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: object
                }, function () {
                    mainObject.position.subtractInPlace(keys.direction.scale(keys.speed));
                    keys.move = false;
                })));
                //@ts-ignore
                registeredActions.push(mainObject.actionManager.registerAction(new ExecuteCodeAction({
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: object
                },function () {keys.move = true})));
            });
            return registeredActions;
        }

        unregisterCollisionDetection(mainObject: Mesh, registeredActionList: Array<ExecuteCodeAction>, keys: any){
            registeredActionList.forEach(action => {
                //@ts-ignore
                mainObject.actionManager.unregisterAction(action);
            });
            keys.move = true
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
