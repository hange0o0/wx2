class CollectInfoUI extends game.BaseWindow {

    private static _instance:CollectInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new CollectInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectInfoUISkin";
    }

    private bloodItem: ResourceItem;
    private mc: eui.Image;
    private lvText: eui.Label;
    private lockBtn: eui.Button;
    private splitBtn: eui.Button;






    public data;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.lockBtn,()=>{
            this.data.isLock = !this.data.isLock
            this.renewLock();
            CollectUI.getInstance().renewList();
            UM.needUpUser = true
        })

        this.addBtnEvent(this.splitBtn,()=>{
            CollectManager.getInstance().split(this.data);
            CollectUI.getInstance().resetList();
            this.hide();
            UM.needUpUser = true
        })

    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.renew()
    }

    private renew(){
        var vo = MonsterVO.getObject(this.data.id)

        this.mc.source = vo.getThumb()
        this.setTitle(vo.name)
        this.lvText.text = 'LV.' + vo.level
        this.bloodItem.setText(NumberUtil.addNumSeparator(CollectManager.getInstance().getSplitAward(this.data.id)));
    }

    private renewLock(){
        if(this.data.isLock)
        {
            this.lockBtn.label = '解锁'
            this.lockBtn.skinName = 'Btn3Skin'
        }
        else
        {
            this.lockBtn.label = '锁定'
            this.lockBtn.skinName = 'Btn2Skin'
        }
    }
}