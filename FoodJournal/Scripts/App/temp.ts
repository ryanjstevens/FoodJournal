


//interface IButtonGroupOptions {
//    data?: IButtonGroupItem[];
//    selected?: IButtonGroupItem;
//    itemTemplate?: string;
//    selectionChanged?: (item: IButtonGroupItem) => void;
//}

//declare global {
//    interface JQuery {
//        transformButtonGroup(options?: IButtonGroupOptions): JQuery
//    }
//}

//$.fn.transformButtonGroup = function (this: JQuery, option?: IButtonGroupOptions) {

//    return this.each(function () {
//        let $this = $(this),
//            data = $this.data(TransformButtonGroup.GROUP_DATA) as TransformButtonGroup,
//            options = $.extend({}, TransformButtonGroup.DEFAULTS, $this.data(TransformButtonGroup.GROUP_DATA), typeof option == 'object' && option);

//        $this.data(TransformButtonGroup.GROUP_DATA, (data = new TransformButtonGroup(this, options)));
//    });
//}

//export interface IButtonGroupItem {
//    id: string;
//    label: string;
//    icon: string;
//    data: any;
//}

//export class TransformButtonGroup {
//    static ITEM_TEMPLATE: string = '<a class="selection-btn icon"><icon class="#=icon#" ></icon><p>#=label#</p></a>';

//    static DEFAULTS: IButtonGroupOptions = {
//        data: [],

//        itemTemplate: TransformButtonGroup.ITEM_TEMPLATE,
//    };

//    static CLASS: string = 'selection-btns';
//    static ITEM_CLASS: string = 'selection-btn';

//    static GROUP_DATA: string = 'transformButtonGroup';
//    static ITEM_DATA: string = 'transformButtonGroupItem';


//    constructor(private element: HTMLElement, private options?: IButtonGroupOptions) {
//        let that = this,
//            $this = $(element).addClass(TransformButtonGroup.CLASS);

//        this.itemTemplate = kendo.template(options.itemTemplate);
//        this.fill();

//        $this
//            .off()
//            .on('click', '.' + TransformButtonGroup.ITEM_CLASS, function (e) {
//                let $this = $(this),
//                    data = $this.data(TransformButtonGroup.ITEM_DATA) as IButtonGroupItem;
//                that.selectItem(data);
//            });
//    }

//    private itemTemplate: (item: IButtonGroupItem) => string;

//    public get selectedItem(): IButtonGroupItem {
//        let $this = $(this.element),
//            $selected = $this.children('.selected'),
//            itemData = $selected.data(TransformButtonGroup.ITEM_DATA);
//        return itemData;
//    }

//    public get items(): IButtonGroupItem[] {
//        return this.options.data;
//    }

//    //public import(items: IButtonGroupItem[], seleted: IButtonGroupItem = undefined) {
//    //    let that = this;
//    //    that.options.data = items;
//    //    if (!!seleted) that.options.selected = seleted;
//    //    that.fill();

//    //}

//    private fill() {
//        let that = this,
//            $this = $(that.element);

//        $this.empty();
//        that.options.data.forEach((item, i) => {
//            let $button = $(that.itemTemplate(item))
//                .addClass(TransformButtonGroup.ITEM_CLASS)
//                .data(TransformButtonGroup.ITEM_DATA, item)
//                .appendTo($this);
//            if (item === that.options.selected) {
//                $button.addClass('selected');
//            }
//        });
//    }

//    public selectItem(item: JQuery | IButtonGroupItem, silent = false) {
//        let that = this,
//            $this = $(this.element),
//            $selected = $this.children('.selected'),
//            itemData = item instanceof jQuery
//                ? item.data(TransformButtonGroup.ITEM_DATA) as IButtonGroupItem
//                : item;

//        if (itemData === that.selectedItem) {
//            if (that.options.selectionChanged) {
//                that.options.selectionChanged(itemData);
//            };
//        } // nothing to do. it is already selected.

//        $selected.removeClass('selected');
//        $this.children().each((i, button) => {
//            let $button = $(button),
//                $buttonData = $button.data(TransformButtonGroup.ITEM_DATA) as IButtonGroupItem;
//            if ($buttonData == itemData) {
//                $button.addClass('selected');
//                that.options.selected = itemData;
//                if (that.options.selectionChanged && !silent) {
//                    that.options.selectionChanged(itemData);
//                }
//                return;
//            }
//        });

//    }
//}