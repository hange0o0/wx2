class GameUI extends game.BaseUI {

    private static _instance:GameUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GameUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    private btn0: eui.Group;
    private btn1: eui.Group;
    private btn3: eui.Group;
    private btn4: eui.Group;
    private btn5: eui.Group;
    private btn6: eui.Group;
    private btn7: eui.Group;
    private btn2: eui.Group;
    private foodText: eui.Label;
    private woodText: eui.Label;
    private coinText: eui.Label;
    private diamondText: eui.Label;
    private grassText: eui.Label;
    private bloodText: eui.Image;
    private defBtn: eui.Button;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.soundBtn,this.onSetting)

    }




}