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

    public update(){
        this._moveForward();
    }

    private _initializePath(){
        const totalSpheresLength = 35;
        for(let i = 0; i < totalSpheresLength; i++){
            this._addChild(this._createBox(i))
        }
    }

    private _addChild(child: TransformNode) {
        child.parent = this
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
        const lastElement = this.getChildTransformNodes(true).shift() as Mesh;
        lastElement.parent = null;
        lastElement.dispose();
    }

    private _createBox(index: int): Mesh {
        const box = MeshBuilder.CreateBox('box'+ index,
            {size: this._cubeDimension}, this._scene);
        box.enableEdgesRendering();
        box.edgesWidth = 10.0;
        box.edgesColor = new Color4(0, 0, 0, 1);
        box.position.x = this._positionOffsetX - index * this._cubeDimension;

        if(index % 2 == 0){
            const obstacleHeight = 6;
            const obstacle =  MeshBuilder.CreateBox('box'+ index,
                {size: this._cubeDimension, height: obstacleHeight}, this._scene);
            obstacle.enableEdgesRendering();
            obstacle.edgesWidth = 10.0;
            obstacle.edgesColor = new Color4(0, 0, 0, 1);
            obstacle.parent = box;
            obstacle.position.y = 4;
            box.rotation.x = Math.PI * [0, 0.5, 1, 1.5][Math.floor(Math.random() * 4)];
        }


        this._lastIndex++;
        return box;
    }
}