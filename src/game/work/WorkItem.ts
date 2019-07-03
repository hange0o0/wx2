class WorkItem extends game.BaseItem{

    private woodNeedItem: ResourceItem;
    private upBtn: eui.Button;
    private icon: WorkIcon;
    private nameText: eui.Label;
    private desText: eui.Label;
    private decBtn: eui.Image;
    private addBtn: eui.Image;


    public constructor() {
        super();
        this.skinName = "WorkItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

    }


}