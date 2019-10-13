import {
    Animation, BezierCurveEase, float,
    int,
    TransformNode,
} from "@babylonjs/core";
import Ball from "@/game/components/Ball";
import Box from "@/game/components/Box";

export default class Path extends TransformNode {

    private childList = [] as any;
    private _speed = 0.2;
    private _endPathPosition = 10;
    private _lastIndex = -1;
    private _positionOffsetX = 20;
    private _cubeDimension = 2;
    private _targetRotation = 0;

    constructor(name: string, private ball: Ball) {
        super(name);
        this._initializePath();
    }

    public update(){
        this._moveForward();
        this.ball.update();
    }

    private _initializePath(){
        const totalSpheresLength = 35;
        for(let i = 0; i < totalSpheresLength; i++){
            this._addChild(this._createBox(i))
        }
    }

    private _addChild(child: any) {
        child.mesh.parent = this
        this.childList.push(child);
    }

    private _moveForward() {
        this.position.x += this._speed;
        if(this.position.x >= this._endPathPosition){
            this._dequeueElement();
            this._enqueueElement();
            this._endPathPosition += this._cubeDimension;
        }

    }

    private _enqueueElement(){
        this._addChild(this._createBox(this._lastIndex + 1))
    }

    private _dequeueElement(){
        const lastElement = this.childList.shift() as Box;
        lastElement.destroy();
    }

    private _createBox(index: int): Box {
        const box = new Box(index, this._cubeDimension, this._positionOffsetX, this._scene, this.ball)
        this._lastIndex++;
        return box;
    }

    public rotatePath(nextRotation: float): void{
        //Create a Vector3 animation at 30 FPS
        this._targetRotation = nextRotation;
        const pathAnimation = new Animation("pathEasingAnimation", "rotation.x", 60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_RELATIVE);

        // the torus destination position

        // Animation keys
        const keysSphere = [];
        const totalFrames = 25;
        keysSphere.push({ frame: 0, value: this.rotation.x });
        keysSphere.push({ frame: totalFrames, value: nextRotation });
        pathAnimation.setKeys(keysSphere);

        // Adding easing function to my animation
        pathAnimation.setEasingFunction(new BezierCurveEase(0.331, 0.441, 0.444, 1.649));

        // Adding animation to my torus animations collection
        this.animations.push(pathAnimation);

        //Finally, launch animations on sphere, from key 0 to key 120 with loop activated
        this._scene.beginAnimation(this, 0, totalFrames, false);
    }

    get targetRotation(): float{
        return this._targetRotation;
    }
}