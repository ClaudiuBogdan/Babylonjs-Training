import {ActionManager, Color3, Color4, int, Mesh, MeshBuilder, Scene, StandardMaterial} from "@babylonjs/core";
import Obstacle from "@/game/components/Obstacle";
import Ball from "@/game/components/Ball";

export default class Box{

    private _mesh: Mesh;
    private _obstacle: Obstacle | undefined;

    constructor(index: int, private _cubeDimension: int, private _positionOffsetX: int, private _scene: Scene, private _ball: Ball){
        const boxMesh = MeshBuilder.CreateBox('boxMesh' + index,
            {size: this._cubeDimension}, this._scene);
        this._mesh = boxMesh;
        boxMesh.enableEdgesRendering();
        boxMesh.edgesWidth = 10.0;
        boxMesh.edgesColor = new Color4(0, 0, 0, 1);
        boxMesh.position.x = this._positionOffsetX - index * this._cubeDimension;
        const boxMaterial = new StandardMaterial("box_material", this._scene);
        boxMaterial.diffuseColor = new Color3(0.8 + Math.random()/8, 0.8 + Math.random()/8, 0.8 +Math.random()/8);
        boxMesh.material = boxMaterial;

        if(index % 2 == 0){
            const obstacle = new Obstacle(index, this._cubeDimension, boxMesh, this._scene);

            obstacle.registerCollisionDetection( this._ball);

            boxMesh.rotation.x = Math.PI * [0, 0.5, 1, 1.5][Math.floor(Math.random() * 4)];
            this._obstacle = obstacle;
        }



        // return boxMesh;
    }

    get mesh(){
        return this._mesh;
    }

    destroy() {
        this.mesh.parent = null;
        this._obstacle ? this._obstacle.destroy() : undefined;
        this.mesh.dispose(false, true);
        delete this._scene;
        delete this._ball;
    }
}