import {
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

    constructor(name: string, private ball: Ball) {
        super(name);
        this._initializePath();
    }

    public update(){
        this._moveForward();
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
}