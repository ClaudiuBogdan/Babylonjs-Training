import {Color4, int, Mesh, MeshBuilder, TransformNode} from "@babylonjs/core";

export default class Path extends TransformNode {
    private _speed = 0.1;
    private _endPathPosition = 10;
    private _lastIndex = -1;
    private _positionOffsetX = 20;
    private _cubeDimension = 2;

    constructor(name: string) {
        super(name);
        this._initializePath();
    }

    private _initializePath(){
        const totalSpheresLength = 30;
        for(let i = 0; i < totalSpheresLength; i++){
            this._addChild(this._createBox(i))
        }
    }

    private _addChild(child: TransformNode) {
        child.parent = this
    }

    public moveForward() {
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
        const lastElement = this.getChildTransformNodes(true).shift() as Mesh;
        lastElement.parent = null;
        lastElement.dispose();
    }

    private _createBox(index: int): Mesh {
        const box = MeshBuilder.CreateBox('box'+ index,
            {size: 2}, this._scene);
        box.enableEdgesRendering();
        box.edgesWidth = 8.0;
        box.edgesColor = new Color4(0, 0, 0, 1);
        // Move the box upward 1/2 of its height.
        box.position.x = this._positionOffsetX - index * this._cubeDimension;
        this._lastIndex++;
        return box;
    }
}