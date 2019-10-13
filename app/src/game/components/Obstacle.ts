import {ActionManager, Color4, ExecuteCodeAction, int, Mesh, MeshBuilder, Scene} from "@babylonjs/core";
import Ball from "@/game/components/Ball";

export default class Obstacle{

    private _mesh: Mesh;

    private _registeredActionList = [] as Array<ExecuteCodeAction>;
    private readonly _obstacleHeight = 6;

    constructor(index: int, size: int, parent: Mesh, scene: Scene){

        const obstacleMesh =  MeshBuilder.CreateBox('obstacle'+ index,
            {size, height: this._obstacleHeight}, scene);
        obstacleMesh.enableEdgesRendering();
        obstacleMesh.edgesWidth = 10.0;
        obstacleMesh.edgesColor = new Color4(0, 0, 0, 1);
        obstacleMesh.parent = parent;
        obstacleMesh.position.y = 4;
        // obstacleMesh.material = boxMaterial;
        obstacleMesh.actionManager = new ActionManager(scene);
        this._mesh = obstacleMesh

    }

    get mesh(): Mesh{
        return this._mesh;
    }

    public registerCollisionDetection(ball: Ball): void{
        const registeredActions = [] as Array<ExecuteCodeAction>;
        //@ts-ignore
        registeredActions.push(this.mesh.actionManager.registerAction(new ExecuteCodeAction({
            trigger: ActionManager.OnIntersectionEnterTrigger,
            parameter: ball.mesh
        }, ball.onObstacleTriggerEnter.bind(ball))));
        //@ts-ignore
        registeredActions.push(this.mesh.actionManager.registerAction(new ExecuteCodeAction({
            trigger: ActionManager.OnIntersectionExitTrigger,
            parameter: ball.mesh
        },ball.onObstacleTriggerExit.bind(ball))));
        this._registeredActionList = registeredActions;
    }

    public unregisterCollisionDetection(){
        this._registeredActionList.forEach(action => {
            //@ts-ignore
            this.mesh.actionManager.unregisterAction(action);
        });
        delete this.mesh.actionManager
    }

    destroy() {
        this.unregisterCollisionDetection();
        this.mesh.dispose(false, true);
    }
}