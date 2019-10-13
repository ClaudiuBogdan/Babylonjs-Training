import {
    Color3,
    Animation,
    EasingFunction,
    HighlightLayer,
    Material,
    Mesh,
    MeshBuilder, QuadraticEase,
    Scene,
    StandardMaterial, Vector3, BounceEase, PowerEase, CubicEase, ElasticEase, CircleEase, SineEase, BezierCurveEase
} from "@babylonjs/core";

export default class Ball {

    private _ballMesh: Mesh;
    private _positionOffsetX = 5;
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

    createAnimation(): void{
        //Create a Vector3 animation at 30 FPS
        const animationSphere = new Animation("torusEasingAnimation", "position", 60, Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE);

        // the torus destination position
        const nextPos = this._ballMesh.position.add(new Vector3(0, 2, 0));

        // Animation keys
        const keysSphere = [];
        const totalFrames = 35;
        keysSphere.push({ frame: 0, value: this._ballMesh.position });
        keysSphere.push({ frame: totalFrames * 0.69, value: nextPos });
        keysSphere.push({ frame: totalFrames, value: this._ballMesh.position });
        animationSphere.setKeys(keysSphere);

        // Adding easing function to my animation
        animationSphere.setEasingFunction(new BezierCurveEase(0.331, 0.441, 0.444, 1.649));

        // Adding animation to my torus animations collection
        this._ballMesh.animations.push(animationSphere);

        //Finally, launch animations on sphere, from key 0 to key 120 with loop activated
        this._scene.beginAnimation(this._ballMesh, 0, totalFrames, true);
    }

    public onObstacleTriggerEnter(){
        console.log("Enter")
    }

    public onObstacleTriggerExit(){
        console.log("Exit")
    }

    get mesh(){
        return this._ballMesh;
    }

}