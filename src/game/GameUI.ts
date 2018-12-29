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

    private team1: TeamUI;
    private team2: TeamUI;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private bottomGroup: eui.Group;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    private rankBtn: eui.Group;
    private mailBtn: eui.Group;
    private mailRed: eui.Image;
    private settingBtn: eui.Group;
    private mainPKUI: MainPKUI;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.settingBtn,this.onClick)
        this.addBtnEvent(this.mailBtn,this.onMail)
    }

    public onClick(){
        this.mainPKUI.show();
    }
    public onMail(){
        this.mainPKUI.hide();
    }

    public onShow(){
        this.mainPKUI.visible = false;
        this.team1.dataChanged()
        this.team2.dataChanged()

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        this.team1.onTimer();
        this.team2.onTimer();
    }


}