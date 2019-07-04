class FeedUnlockUI extends game.BaseWindow {

    private static _instance:FeedUnlockUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedUnlockUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedUnlockUISkin";
    }

    private list: eui.List;
    private unlockBtn: eui.Button;
    private desText: eui.Label;
    private woodItem: ResourceItem;






    private index
    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = FeedUnlockItem
        this.setTitle('解锁蛊盒')
        this.addBtnEvent(this.unlockBtn,()=>{
            if(this.currentState == 's1')
            {
                if(!UM.checkResource({wood:FeedManager.getInstance().getOpenCost(this.index)}))
                    return;
            }
            else if(this.unlockBtn.label == '邀请好友')
            {
                this.onInvite();
                return
            }
            FeedManager.getInstance().unlock(this.index)
            this.hide();
        })

    }

    public onInvite(){
        ShareTool.share('加入我们，让我们一起割草无双','',{type:1,from:UM.gameid,index:this.index},()=>{
            MyWindow.ShowTips('等待好友加入')
        },true)
    }

    public show(index?){
         this.index = index;
        if(this.index < 4)
        {
            UM.renewFriendNew(()=>{
                super.show()
            })
            return;
        }
        super.show();
    }

    public onShow(){
        if(this.index < 4)
            this.renewGold()
        else
           this.renewNormal();
    }

    public renewGold(){
        this.currentState = 's2'
        var FM = FeedManager.getInstance();
        var arr = FM.goldHelper[this.index] || [];
        if(arr.length >= this.index)
        {
            arr.length = this.index;
            this.unlockBtn.label = '解锁'
        }
        else
        {
             while(arr.length < this.index)
             {
                 arr.push(null)
             }
            this.unlockBtn.label = '邀请好友'
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.desText.text = '黄金蛊盒成蛊质量更高\n邀请'+this.index+'位好友即可获得'
    }

    public renewNormal(){
        this.currentState = 's1'
        this.woodItem.data = FeedManager.getInstance().getOpenCost(this.index)
        this.unlockBtn.label = '解锁'
    }
}