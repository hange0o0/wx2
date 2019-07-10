class UseResourceUI extends game.BaseWindow {

    private static _instance:UseResourceUI;
    public static getInstance() {
        if (!this._instance) this._instance = new UseResourceUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "UseResourceUISkin";
    }

    private resourceGroup: eui.Group;
    private r0: ResourceItem;
    private r1: ResourceItem;
    private okBtn: eui.Button;
    private desText: eui.Label;







    private itemArr = [];




    public title;
    public des;
    public btnLabel;
    public resourceData;
    public fun;
    public childrenCreated() {
        super.childrenCreated();
        //this.setTitle('加速制蛊')
        this.addBtnEvent(this.okBtn,()=>{
            if(!UM.checkResource(this.resourceData))
                return;
            this.fun && this.fun();
            this.hide();
        })

        this.itemArr.push(this.r0)
        this.itemArr.push(this.r1)
    }

    public show(title?,des?,btnLabel?,resourceData?,fun?){
        this.title = title;
        this.des = des;
        this.btnLabel = btnLabel;
        this.resourceData = resourceData;
        this.fun = fun;
        super.show();
    }

    public onShow(){
        this.renew()
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){
        var index = 0;
        for(var s in this.resourceData)
        {
            this.itemArr[index].data = this.resourceData[s];
            index ++;
        }
    }

    private renew(){
        this.setTitle(this.title)
        this.desText.text = this.des
        this.okBtn.label = this.btnLabel
        this.resourceGroup.removeChildren();

        var index = 0;
        for(var s in this.resourceData)
        {
            this.resourceGroup.addChild(this.itemArr[index])
            this.itemArr[index].currentState = s;
            index ++;
        }
        this.onCoinChange();
    }


}