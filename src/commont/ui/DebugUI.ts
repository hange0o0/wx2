class DebugUI extends game.BaseUI {

    private static _instance:DebugUI;

    public static getInstance() {
        if (!this._instance) this._instance = new DebugUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private backBtn: eui.Button;
    private con: eui.Group;

    public debugTime = 0
    public debugOpen = false


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn,this.hide)
        var wx = window['wx'];

        this.addB('清号',()=>{
            SharedObjectManager.getInstance().removeMyValue('localSave')
            if(!wx)
                return;
            const db = wx.cloud.database();
            db.collection('user').doc(UM.dbid).remove({
                success(res) {

                    wx.exitMiniProgram();
                }
            })
        })
    }

    private addB(label,fun){
        var btn = new eui.Button();
        btn.skinName = 'Btn1Skin'
        btn.width = 190
        btn.label = label;
        this.con.addChild(btn);
        this.addBtnEvent(btn,fun);
    }

}