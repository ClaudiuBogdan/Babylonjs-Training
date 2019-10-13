<template>
    <div id="app">

            <div class="close" @click="closeGameModal()"></div>
            <canvas id="renderCanvas" touch-action="none"></canvas>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Scene} from '@babylonjs/core/scene';
    import {Engine} from '@babylonjs/core/Engines/engine';
    import {
        FreeCamera,
        HemisphericLight,
        Light,
        Mesh,
        MeshBuilder,
        PointerEventTypes,
        TransformNode,
        Vector3
    } from "@babylonjs/core";
    import Path from "@/game/components/Path";
    import Ball from "@/game/components/Ball";

    @Component({})

    export default class App extends Vue {

        created() {
            window.onresize = this.setGameContainerDimensions
        }

        mounted() {
            this.setGameContainerDimensions();
            // Create the game using the 'renderCanvas'.
            let game = new Game('renderCanvas');

            // Create the scene.
            game.createScene();

            // Start render loop.
            game.doRender();

        }

        setGameContainerDimensions() {
            const targetAspectRatio = 10.0 / 16.0;
            const windowAspectRation = window.innerWidth / window.innerHeight;
            const gameContainer = document.getElementById('renderCanvas');
            let gameWidth = window.innerWidth;
            let gameHeight = window.innerHeight;
            const isPortrait = window.innerHeight > window.innerWidth;
            if (!(isPortrait && this.isMobile())) {
                if (windowAspectRation > targetAspectRatio)
                    gameWidth = gameHeight * targetAspectRatio;
                if (windowAspectRation < targetAspectRatio)
                    gameHeight = gameWidth / targetAspectRatio;
            }
            //@ts-ignore
            gameContainer.style.width = gameWidth + 'px';
            //@ts-ignore
            gameContainer.style.height = gameHeight + 'px';
        }

        closeGameModal() {
            window.location.reload();
        }

        isMobile() {
            let check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        }
    }

    class Game {
        private readonly _canvas: HTMLCanvasElement;
        private readonly _engine: Engine;
        private readonly _scene: Scene;
        private _camera: FreeCamera;
        private _light: Light;

        constructor(canvasElement: string) {
            // Create canvas and engine.
            this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
            this._engine = new Engine(this._canvas, true);

            // Create a basic BJS Scene object.
            this._scene = new Scene(this._engine);

            // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
            this._camera = new FreeCamera('camera1', new Vector3(20, 30, 40), this._scene);

            // Create a basic light, aiming 0,1,0 - meaning, to the sky.
            this._light = new HemisphericLight('light1', new Vector3(1, 1, 0), this._scene);
        }

        createScene(): void {
            this._scene.collisionsEnabled = true;

            // Target the camera to scene origin.
            this._camera.setTarget(Vector3.Zero());

            // Attach the camera to the canvas.
            this._camera.attachControl(this._canvas, false);
            this._camera.inputs.clear();

            this.createMovingContainer();
        }

        async createMovingContainer(){

            const ball = new Ball(this._scene);
            const path = new Path('path_main', ball);

            this._scene.registerBeforeRender(function(){
                path.update();
            });

             const createTouchEvents = () => {
                const scene = this._scene;
                scene.onPointerObservable.add((pointerInfo) => {
                    if(pointerInfo.type == PointerEventTypes.POINTERDOWN){
                        console.log("POINTER TAP");
                        path.rotatePath(path.targetRotation - Math.PI/2);
                    }
                });
            };
            createTouchEvents();

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


    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #renderCanvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
    }

    .close {
        position: fixed;
        top: 10px;
        right: 10px;
        border-radius: 50%;
        background: rgba(255, 0, 0, 0.5);;
        z-index: 10;
        width: 60px;
        height: 60px;
    }

    .close:after {
        content: '';
        height: 30px;
        border-left: 2px solid #fff;
        position: absolute;
        transform: rotate(45deg);
        top: 14px;
        left: 28px;
    }

    .close:before {
        content: '';
        height: 30px;
        border-left: 2px solid #fff;
        position: absolute;
        transform: rotate(-45deg);
        top: 14px;
        left: 28px;
    }
</style>
