class FeedInfoUI extends game.BaseWindow {

    private static _instance:FeedInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedInfoUISkin";
    }

    private upBtn: eui.Button;
    private startBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private woodItem: ResourceItem;
    private diamondItem: ResourceItem;
    private desText: eui.Label;






    private index
    private chooseList = []
    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = FeedChooseItem;

        this.addBtnEvent(this.upBtn,()=>{

        })

        this.addBtnEvent(this.startBtn,()=>{
            if(this.startBtn.label == '开始制蛊')
            {
                FeedManager.getInstance().startFeed(this.index,this.chooseList)
                this.hide();
            }
            else
            {
                FeedChooseUI.getInstance().show(this.chooseList)
            }
        })

    }

    public show(index?){
        this.index = index;
        this.chooseList.length = 0;
        super.show();
    }



    public onShow(){
        if(this.index < 4)
            this.setTitle('黄金蛊盒' + this.index)
        else
            this.setTitle('蛊盒' + (this.index - 3))
        this.renewCoin();
        this.rennewList();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewCoin)
    }

    private renewCoin(){
        var need = FeedManager.getInstance().getLevelUpCost(this.index);
        this.woodItem.data =  need.wood
        this.diamondItem.data =  need.diamond
    }

    private rennewList(){
        var FM = FeedManager.getInstance();
        var data = FM.data[this.index];
        var num = FM.getNumByIndex(this.index);
        this.desText.text = '当前等级：LV' + data.level + '，可投入数量：' + num +
            '，成蛊时间：' + DateUtil.getStringBySecond(FM.getTimeByIndex(this.index));
        this.list.dataProvider = new eui.ArrayCollection(this.chooseList)
        if(this.chooseList.length >= num)
        {
            this.startBtn.label = '开始制蛊'
        }
        else
        {
            this.startBtn.label = '投入虫蛊'
        }
    }

    public setChoose(list){
        this.chooseList = list;
        this.rennewList();
    }

    public removeItem(data){
        var index = this.chooseList.indexOf(data);
        this.chooseList.splice(index,1)
        var scrollV = this.scroller.viewport.scrollV;
        this.list.dataProvider = new eui.ArrayCollection(this.chooseList)
        this.scroller.viewport.validateNow();
        this.scroller.viewport.scrollV = scrollV;
    }
}