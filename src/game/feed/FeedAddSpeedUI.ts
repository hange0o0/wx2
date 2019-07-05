class FeedAddSpeedUI extends game.BaseWindow {

    private static _instance:FeedAddSpeedUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedAddSpeedUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedAddSpeedUISkin";
    }

    private boxMC: eui.Image;
    private barMC: eui.Image;
    private timeText: eui.Label;
    private coinItem: ResourceItem;
    private speedBtn: eui.Button;


    public data;
    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('加速制蛊')
        this.addBtnEvent(this.speedBtn,()=>{
            if(!UM.checkResource({coin:FeedManager.getInstance().getSpeedCost(this.data)}))
                return;
            FeedManager.getInstance().speed(this.data)
            FeedManager.getInstance().getAward(this.data)
            this.hide()
        })

        this.addBtnEvent(this.boxMC,()=>{
            this.shake();
            FeedManager.getInstance().data[this.data].endTime -= 10;
            this.onTimer();
        })

    }

    private shake(){
         egret.Tween.removeTweens(this.boxMC)
         egret.Tween.get(this.boxMC).to({y:110-10 + 20*Math.random(),horizontalCenter:-10+20*Math.random()},50).to({y:110,horizontalCenter:0},50)
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.renew()
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        this.coinItem.data = FeedManager.getInstance().getSpeedCost(this.data);
        var FM = FeedManager.getInstance();
        var data = FM.data[this.data];
        var cd = data.endTime - TM.now();
        if(cd < 0)
        {
            this.hide()
            FeedManager.getInstance().getAward(this.data)
            return;
        }
        else
        {
            this.barMC.width =  Math.max(2,204*(data.total - cd)/data.total);
            this.timeText.text = DateUtil.getStringBySecond(cd);
        }
    }

    private renew(){
        this.onTimer();
    }


}