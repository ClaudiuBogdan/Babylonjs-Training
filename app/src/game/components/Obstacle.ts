import {
    ActionManager, Animation, BezierCurveEase,
    Color4,
    ExecuteCodeAction, float,
    int,
    Matrix,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3
} from "@babylonjs/core";
import Ball from "@/game/components/Ball";

export default class Obstacle {

    private _mesh: Mesh;
    private _boxSize: number;

    private _registeredActionList = [] as Array<ExecuteCodeAction>;
    private readonly _obstacleHeight = Math.floor(3 + Math.random() * 3);

    constructor(index: int, boxSize: int, parent: Mesh, scene: Scene) {

        const obstacleMesh = MeshBuilder.CreateBox('obstacle' + index,
            {size: boxSize * 0.99, height: boxSize}, scene);
        obstacleMesh.enableEdgesRendering();
        obstacleMesh.edgesWidth = 10.0;
        obstacleMesh.edgesColor = new Color4(0, 0, 0, 1);
        obstacleMesh.parent = parent;
        this._boxSize = boxSize;

        // obstacleMesh.position.y = 0;
        // obstacleMesh.material = boxMaterial;
        obstacleMesh.actionManager = new ActionManager(scene);
        this._mesh = obstacleMesh;

        this._setObstacleScale(0.01);
        this._mesh.position.y -= 0.01;

        this._startScaleAnimation(scene);
    }

    get mesh(): Mesh {
        return this._mesh;
    }

    public registerCollisionDetection(ball: Ball): void {
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
        }, ball.onObstacleTriggerExit.bind(ball))));
        this._registeredActionList = registeredActions;
    }

    public unregisterCollisionDetection() {
        this._registeredActionList.forEach(action => {
            //@ts-ignore
            this.mesh.actionManager.unregisterAction(action);
        });
        delete this.mesh.actionManager
    }

    private _setObstacleScale(scale: float) {
        this.mesh.scaling.y = scale;
        this.mesh.position.y = this.mesh.scaling.y + this._boxSize / 2;
    }

    destroy() {
        this.unregisterCollisionDetection();
        this.mesh.dispose(false, true);
    }

    private _startScaleAnimation(scene: Scene) {
        const animationDelay = 2000;
        setTimeout(() => {
            const scaleObstacle = () => {
                const scaleSpeed = 0.05
                this._setObstacleScale(this.mesh.scaling.y + scaleSpeed)
                if (this.mesh.scaling.y > this._obstacleHeight) {
                    scene.unregisterBeforeRender(scaleObstacle);
                }
            };
            scene.registerBeforeRender(scaleObstacle);
        }, animationDelay)

        // scene.unregisterAfterRender(unregister);
    }
}