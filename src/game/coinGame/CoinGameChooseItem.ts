class CoinGameChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CoinGameChooseItemSkin";
    }

    private bg: eui.Image;
    private mc: eui.Image;
    private insertMC: eui.Image;
    private changeMC: eui.Image;



    private arrowTW
    private changeTW

    public stopMove=true
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        MyTool.addLongTouch(this,this.onInfo,this)

        DragManager.getInstance().setDrag(this,true);


        MyTool.removeMC(this.insertMC)
        MyTool.removeMC(this.changeMC)
    }

    public initDragItem(){
        this.addChild(this.insertMC)
        this.addChild(this.changeMC)

        var tw = this.arrowTW = egret.Tween.get(this.insertMC,{loop:true});
        tw.to({scaleX:1.1,scaleY:0.8},200).to({scaleX:1,scaleY:1.1,y:this.insertMC.y -10},200).
            to({scaleX:1.1,scaleY:0.8,y:this.insertMC.y},200).to({scaleX:1,scaleY:1},300).wait(200);
        this.arrowTW.setPaused(true)


        var tw = this.changeTW = egret.Tween.get(this.changeMC,{loop:true});
        tw.to({rotation:30},100).to({rotation:-30},200).to({rotation:20},150).to({rotation:-20},150).to({rotation:0},70).wait(200);
        this.changeTW.setPaused(true)
    }

    public showDragState(type){
        this.arrowTW.setPaused(true)
        this.changeTW.setPaused(true)
        this.insertMC.visible = false
        this.changeMC.visible = false
        if(type == 1)
        {
            this.changeTW.setPaused(false)
            this.changeMC.visible = true
        }
        else if(type == 2)
        {
            this.arrowTW.setPaused(false)
            this.insertMC.visible = true
        }
    }




    private onInfo(){
        CoinGameUI.getInstance().stopDrag();
        DragManager.getInstance().endDrag();
        var arr = [];
        for(var i=0;i<this.data.list.length;i++)
        {
            arr.push(this.data.list[i].id)
        }
        CardInfoUI.getInstance().show(this.data.id,arr,this.data.list.indexOf(this.data))
    }

    private onClick(){
         CoinGameUI.getInstance().deleteItem(this.data)
    }

    public dataChanged(){
        //this.indexText.text = this.data.index;
        var vo = MonsterVO.getObject(this.data.id)
        this.bg.source = vo.getBG()
        this.mc.source = vo.getImage()
    }

    public setChoose(b){
        this.alpha = b?0.3:1
    }


}