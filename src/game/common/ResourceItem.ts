class ResourceItem extends game.BaseItem{

    private barBG: eui.Image;
    private barMask: eui.Image;
    private txt: eui.Label;



    //public showBar = true//是否显示bar
    public showValue = -1;
    public constructor() {
        super();
        this.skinName = "ResourceItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.barBG.mask = this.barMask
        //this.addBtnEvent(this,()=>{
        //    CollectInfoUI.getInstance().show(this.data)
        //})
    }

    public dataChanged(){
        this.showValue = this.data;
        this.renew();
    }

    public setText(txt){
        this.txt.text = txt;
        this.txt.textColor = 0xFFFFFF
        this.barBG.visible = false;
    }

    public renew():void {
        var WM = WorkManager.getInstance();
        var showValue = this.showValue
        var currentValue = 0
        var maxValue = 0
       switch(this.currentState)
       {
           case 'coin':
               currentValue = UM.coin
               break;
           case 'blood':
               currentValue = UM.blood
               break;
           case 'food':
               currentValue = UM.food
               maxValue = WM.foodMax
               break;
           case 'wood':
               currentValue = UM.wood
               maxValue = WM.woodMax
               break;
           case 'diamond':
               currentValue = UM.diamond
               maxValue = WM.diamondMax
               break;
           case 'grass':
               currentValue = UM.grass
               maxValue = WM.grassMax
               break;
       }

        if(showValue == -1)//显示玩家资源
        {
            this.showBar(currentValue,maxValue)
            this.txt.textColor = (!maxValue || currentValue< maxValue)?0xFFFFFF:0x00ff00;
            this.txt.text = NumberUtil.addNumSeparator(currentValue)
        }
        else //显示需求
        {
            this.txt.textColor = 0xFFFFFF
            this.showBar(showValue,currentValue)
            this.txt.text = NumberUtil.addNumSeparator(showValue)
        }


    }

    public showBar(current,total){
        if(current == 0){
            this.barBG.visible = false;
            return;
        }
         this.barBG.visible = true;
        if(current >= total)
        {
            this.barBG.source = 'border_bar2_png'
            this.barMask.width = (this.width-8)*total/current
        }
        else
        {
            this.barBG.source = 'border_bar1_png'
            this.barMask.width = (this.width-8)*current/total
        }
    }


}