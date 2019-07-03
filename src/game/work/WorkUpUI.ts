class WorkUpUI extends game.BaseWindow {

    private static _instance:WorkUpUI;
    public static getInstance() {
        if (!this._instance) this._instance = new WorkUpUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "WorkUpUISkin";
    }

    private woodItem: ResourceItem;
    private desText: eui.Label;
    private upBtn: eui.Button;
    private icon: WorkIcon;





    private type;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.upBtn,()=>{
            var oo = {}
            oo['wood'] = WorkManager.getInstance().getUpCost(this.type)
            if(!UM.checkResource(oo))
                return;
            WorkManager.getInstance().levelUpType(this.type);
            this.hide()
        })

    }

    public show(type?){
        this.type = type;
        super.show();
    }

    public onShow(){
        var WM = WorkManager.getInstance();
        this.setTitle(WM.title[this.type])
        this.icon.currentState = this.type;
        var maxValue
        var maxNumValue
        var maxValue2
        var maxNumValue2
        var upObj = WM.getNextLevelValue()
        switch(this.type)
        {
            case 'food':
                maxValue = WM.foodMax;
                maxNumValue = WM.foodNumMax;
                maxValue2 = upObj.foodMax;
                maxNumValue2 = upObj.foodNumMax;
                break;
            case 'wood':
                maxValue = WM.woodMax;
                maxNumValue = WM.woodNumMax;
                maxValue2 = upObj.woodMax;
                maxNumValue2 = upObj.woodNumMax;
                break;
            case 'diamond':
                maxValue = WM.diamondMax;
                maxNumValue = WM.diamondNumMax;
                maxValue2 = upObj.diamondMax;
                maxNumValue2 = upObj.diamondNumMax;
                break;
            case 'grass':
                maxValue = WM.grassMax;
                maxNumValue = WM.grassNumMax;
                maxValue2 = upObj.grassMax;
                maxNumValue2 = upObj.grassNumMax;
                break;
        }

        this.desText.text = '工作人数：' + maxNumValue + ' -> ' + maxNumValue2 +
            '\n储量上限：' + maxValue + ' -> ' + maxValue2
        this.onCoinChange();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){
        this.woodItem.data =  WorkManager.getInstance().getUpCost(this.type)
    }
}