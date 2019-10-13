import {
    Animation,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
    BezierCurveEase,
    ActionEvent
} from "@babylonjs/core";

export default class Ball {

    private _ballMesh: Mesh;
    private _positionOffsetX = 0;
    private _endPathPositionX = 10;
    private _speed = 0;
    private _scene: Scene;

    constructor(scene: Scene){
        this._scene = scene;
        this._ballMesh = MeshBuilder.CreateSphere('ball',
            {segments:16, diameter: 1.9}, scene);
        this._ballMesh.position.y = 2;
        this._ballMesh.position.x = this._positionOffsetX;
        // Add the highlight layer.
        // const highlightLayer = new HighlightLayer("highlight_layer", scene);
        // highlightLayer.addMesh(this._ballMesh, Color3.Teal());
        // highlightLayer.blurVerticalSize = 0.1;
        // highlightLayer.blurHorizontalSize = 0.1;
        // const ballMaterial = new StandardMaterial("ball_material", scene);
        // ballMaterial.diffuseColor = new Color3(0, 1, 1);
        // this._ballMesh.material = ballMaterial;

        this.createAnimation();
        
    }

    public update(){
        this.mesh.position.x += this._speed;
        if(this.mesh.position.x > this._endPathPositionX) this.fall();
    }

    createAnimation(): void{
        //Create a Vector3 animation at 30 FPS
        const animationSphere = new Animation("ballEasingAnimation", "position.y", 60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE);

        // the torus destination position
        const nextPosY = this._ballMesh.position.y + 2;

        // Animation keys
        const keysSphere = [];
        const totalFrames = 35;
        keysSphere.push({ frame: 0, value: this._ballMesh.position.y });
        keysSphere.push({ frame: totalFrames * 0.69, value: nextPosY });
        keysSphere.push({ frame: totalFrames, value: this._ballMesh.position.y });
        animationSphere.setKeys(keysSphere);

        // Adding easing function to my animation
        animationSphere.setEasingFunction(new BezierCurveEase(0.331, 0.441, 0.444, 1.649));

        // Adding animation to my torus animations collection
        this._ballMesh.animations.push(animationSphere);

        //Finally, launch animations on sphere, from key 0 to key 120 with loop activated
        this._scene.beginAnimation(this._ballMesh, 0, totalFrames, true);
    }

    public onObstacleTriggerEnter(actionEvent: ActionEvent){
        console.log("Enter")
        const obstacleMesh = actionEvent.source as Mesh;
        if(obstacleMesh.getAbsolutePosition().x + 1 + 1.5/2 > this.mesh.position.x)
            return this.fall();
        this._speed = 0.2;
    }

    public onObstacleTriggerExit(actionEvent: ActionEvent){
        console.log("Exit")
        this._speed = 0;
    }

    private fall(){
        this.mesh.position.y = 15;
    }

    get mesh(){
        return this._ballMesh;
    }

}