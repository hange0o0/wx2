class CollectUI extends game.BaseUI {

    private static _instance:CollectUI;
    public static getInstance() {
        if (!this._instance) this._instance = new CollectUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectUISkin";
    }

    private woodItem: ResourceItem;
    private grassItem: ResourceItem;
    private bloodItem: ResourceItem;
    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private upBtn: eui.Button;
    private splitBtn: eui.Button;
    private desText: eui.Label;







    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CollectItem;

        this.addBtnEvent(this.upBtn,()=>{
            UseResourceUI.getInstance().show('升级虫洞','升级虫洞，吸引虫蛊的数量和质量会得到提高','升级',
                CollectManager.getInstance().getUpCost(),
                ()=>{
                    CollectManager.getInstance().levelUp()
                    this.renew();
                })
        })

        this.addBtnEvent(this.splitBtn,()=>{
            var CM = CollectManager.getInstance()
            var list = CM.list
            var arr = []
            var cost = 0
            for(var i=0;i<list.length;i++)
            {
                var oo = list[i];
                if(!oo.isLock)
                {
                    arr.push(oo)
                    cost += CM.getSplitAward(oo.id);
                }
            }
            if(arr.length == 0)
            {
                MyWindow.ShowTips('没有未锁定的昆虫');
                return;
            }
            MyWindow.Confirm('当前可炼化昆虫数量：'+arr.length+'\n可获得血食：'+NumberUtil.addNumSeparator(cost)+'\n是否继续？',(b)=>{
                if(b==1)
                {
                    for(var i=0;i<arr.length;i++)
                    {
                        CM.split(arr[i]);
                    }
                    this.renew();
                }
            },['取消','炼化']);
        })
    }

    public onShow(){
        this.renew();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){
        var CLM = CollectManager.getInstance();

       this.woodItem.renew()
       this.grassItem.renew()
       this.bloodItem.renew()
    }

    public resetList(){
        var scrollV = this.scroller.viewport.scrollV;
        this.renew();
        this.scroller.validateNow()
        this.scroller.viewport.scrollV = scrollV;
    }
    public renewList(){
        MyTool.renewList(this.list);
    }

    public renew(){
        var CLM = CollectManager.getInstance();
        CLM.onTimer();
        this.renewInfo();
        this.list.dataProvider = new eui.ArrayCollection(CLM.list);
        this.onCoinChange();
    }

    public renewInfo(){
        var CLM = CollectManager.getInstance();
        this.setHtml(this.desText,'当前虫洞等级：'+ this.createHtml('LV.' + CLM.level,0xFFFF00) + '，可容纳：' +
            this.createHtml(CLM.list.length + '/' + CLM.maxNum,CLM.list.length < CLM.maxNum?0xFFFF00:0x00ff00))
    }
}