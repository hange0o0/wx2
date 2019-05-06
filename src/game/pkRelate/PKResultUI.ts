class PKResultUI extends game.BaseWindow {

    private static _instance: PKResultUI;
    public static getInstance(): PKResultUI {
        if(!this._instance)
            this._instance = new PKResultUI();
        return this._instance;
    }

    private cancelBtn: eui.Button;
    private goBtn: eui.Button;
    private desText: eui.Label;

    private isWin

    private count = 1
    public constructor() {
        super();
        this.skinName = "PKResultUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.goBtn,()=>{
            var wx = window['wx'];
            if(!wx)
            {
                MyWindow.ShowTips('只在公网生效')
                return;
            }
            wx.navigateToMiniProgram({
                appId: 'wxe066524f2972cb1a',
                success(res) {
                    // 打开成功
                }
            })
        })

        var monsterMV = new MonsterMV();
        this.addChildAt(monsterMV,1);
        monsterMV.scaleX = -1.5
        monsterMV.scaleY = 1.5
        monsterMV.x = 240
        monsterMV.y = 160
        monsterMV.load(65)
        monsterMV.stand()
    }



    public show(isWin?){
        if(Math.random()>this.count)
            return;
        this.count = this.count/2
        this.isWin = isWin;
        super.show()
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        if(this.isWin)
            this.desText.text = '打得不错，来我这里共同发展吧！'
        else
            this.desText.text = '小有失误，但难掩你的大将之才，来我这里争霸天下吧！'
    }
}