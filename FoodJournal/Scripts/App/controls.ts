//import { ComponentMeasure, Dish, DishIngredient, IIngredientSummaryItem, Ingredient, JournalEntry, JournalItem, Nutrition } from "./data";

//export let WidgetConstructor = function <WidgetOptions, Widget extends Object>
//    (groupData: string, defaults: WidgetOptions, constructor: (e: HTMLElement, o?: WidgetOptions) => Widget):
//    (options?: WidgetOptions) => JQuery<HTMLElement> {

//    return function (this: JQuery, option?: WidgetOptions) {
//        //console.log(this);
//        return this.each(function () {
//            let $this = $(this),
//                data = $this.data(groupData),
//                options = $.extend({}, defaults, data, typeof option == 'object' && option);
//            $this.data(groupData, (data = constructor(this, options)));
//        });
//    }
//}

//// #region MeasureField

//export interface IMeasureField {
//    readonly: boolean;
//    id: string;
//    label: string;
//    measure: ComponentMeasure;
//    units: string[];
//    onChange?: (val: ComponentMeasure) => void;
//}

//interface IMeasureFieldContext {
//    readonly: boolean;
//    id: string;
//    label: string;
//    amount: string;
//    units: string;
//    options: {
//        value: string;
//        label: string;
//    }[];
//}

//export class MeasureField {
//    static CLASS: string = "";
//    static DEFAULTS: IMeasureField = {
//        readonly: false,
//        id: null,
//        label: null,
//        measure: new ComponentMeasure(),
//        units: [],
//    };
//    static GROUP_DATA: string = 'measureField';

//    controlTemplate: (context: IMeasureFieldContext) => string;
//    constructor(private element: HTMLElement, private options?: IMeasureField) {
//        console.log("MeasureField");
//        let self = this,
//            $this = $(element).addClass("field measure");

//        self.controlTemplate = kendo.template($('#field-measure-template').html());

//        let o = [];
//        options.units.forEach(u => o.push({ label: u, value: u, selected: (u == options.measure.units) ? 'selected' : '' }));
//        $this.empty().append(self.controlTemplate({
//            readonly: options.readonly,
//            id: options.id,
//            label: options.label,
//            amount: options.measure.amount as any,
//            units: options.measure.units,
//            options: o
//        }));

//        $this
//            .off()
//            .on('change', `.${self.id}_value`, function (e) {
//                self.measure.amount = Number.parseFloat($(this).val() as string) || 0;

//                if (!!self.options.onChange)
//                    self.options.onChange(self.measure);
//            })
//            .on('change', `.${self.id}_unit`, function (e) {
//                self.measure.units = $(this).val() as string || "";

//                if (!!self.options.onChange)
//                    self.options.onChange(self.measure);
//            })
//            ;
//    }

//    get id(): string { return this.options.id; }
//    get label(): string { return this.options.label; }
//    get units(): string[] { return this.options.units; }
//    get measure(): ComponentMeasure { return this.options.measure; }
//    set measure(val: ComponentMeasure) { this.options.measure = val; }
//}



//$.fn.journalMeasureField = WidgetConstructor(
//    MeasureField.GROUP_DATA,
//    MeasureField.DEFAULTS,
//    (e, o) => new MeasureField(e, o));

//// #endregion

//// #region StringField

//export interface IStringField {
//    readonly: boolean;
//    id: string;
//    label: string;
//    value: string;
//    onChange?: (val: string) => void;
//}

//export class StringField {
//    static CLASS: string = "";
//    static DEFAULTS: IStringField = {
//        readonly: false,
//        id: null,
//        label: null,
//        value: null,
//    };
//    static GROUP_DATA: string = 'stringField';

//    controlTemplate: (context: IStringField) => string;
//    constructor(private element: HTMLElement, private options?: IStringField) {
//        console.log("StringField");
//        let self = this,
//            $this = $(element).addClass("field stringinput");

//        self.controlTemplate = kendo.template($('#field-stringinput-template').html());
//        $this.empty().append(self.controlTemplate({
//            readonly: options.readonly,
//            id: options.id,
//            label: options.label,
//            value: options.value
//        }));

//        $this
//            .off()
//            .on('change', `.${self.id}_value`, function (e) {
//                if (!!self.options.onChange)
//                    self.options.onChange(self.value);
//            })
//            ;
//    }

//    get id(): string { return this.options.id; }
//    get label(): string { return this.options.label; }
//    get value(): string { return $(this.element).val() as string; }
//    set value(val: string) { $(this.element).val(val); }
//}


//$.fn.journalStringField = WidgetConstructor(
//    StringField.GROUP_DATA,
//    StringField.DEFAULTS,
//    (e, o) => new StringField(e, o));

//// #endregion

//// #region SelectField

//export interface ISelectField {
//    id: string;
//    label: string;
//    value: string;
//    options: string[];
//    onChange?: (val: string) => void;
//}

//export class SelectField {
//    static CLASS: string = "";
//    static DEFAULTS: ISelectField = {
//        id: null,
//        label: null,
//        value: null,
//        options: [],
//    };
//    static GROUP_DATA: string = 'selectField';

//    controlTemplate: (context: ISelectField) => string;
//    constructor(private element: HTMLElement, private options?: ISelectField) {
//        console.log("SelectField");
//        let self = this,
//            $this = $(element).addClass("field selectinput");

//        self.controlTemplate = kendo.template($('#field-selectinput-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        $this
//            .off()
//            .on('change', `.${self.id}_value`, function (e) {
//                if (!!self.options.onChange)
//                    self.options.onChange(self.value);
//            })
//            ;
//    }

//    get id(): string { return this.options.id; }
//    get label(): string { return this.options.label; }
//    get listOptions(): string[] { return this.options.options; }
//    get value(): string { return $(this.element).val() as string; }
//    set value(val: string) { $(this.element).val(val); }
//}


//$.fn.journalSelectField = WidgetConstructor(
//    SelectField.GROUP_DATA,
//    SelectField.DEFAULTS,
//    (e, o) => new SelectField(e, o));

//// #endregion

//// #region IngredientControl

//export interface IIngredientControl {
//    readonly: boolean;
//    id: string;
//    ingredient: Ingredient;
//    servingSizeUnits: string[];
//    onChange?: (val: Ingredient) => void;
//}

//export class IngredientControl {
//    static CLASS: string = "";
//    static DEFAULTS: IIngredientControl = {
//        readonly: false,
//        id: null,
//        ingredient: new Ingredient(),
//        servingSizeUnits: [],
//    };
//    static GROUP_DATA: string = 'ingredientControl';

//    controlTemplate: (context: IIngredientControl) => string;
//    constructor(private element: HTMLElement, private options?: IIngredientControl) {
//        console.log("IngredientControl");
//        let self = this,
//            $this = $(element).addClass("form-group ingredient");

//        self.controlTemplate = kendo.template($('#ingredient-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        let servingSizeId = `${self.id}_servingsize`,
//            nameId = `${self.id}_name`;

//        $(`#${servingSizeId}`, $this)
//            .journalMeasureField({
//                readonly: options.readonly,
//                id: servingSizeId,
//                measure: options.ingredient.servingSize,
//                units: options.servingSizeUnits,
//                label: 'Serving Size:',
//                onChange: (servingSize) => {
//                    options.ingredient.servingSize = servingSize;
//                    if (!!self.options.onChange) {
//                        self.options.onChange(self.ingredient);
//                    }
//                }
//            });

//        $(`#${nameId}`, $this)
//            .journalStringField({
//                readonly: options.readonly,
//                id: nameId,
//                label: 'Name:',
//                value: options.ingredient.name,
//                onChange: (name) => {
//                    options.ingredient.name = name;
//                    if (!!self.options.onChange) {
//                        self.options.onChange(self.ingredient);
//                    }
//                }
//            });

//    }

//    get id(): string { return this.options.id; }
//    get ingredient(): Ingredient { return this.options.ingredient; }
//    set ingredient(val: Ingredient) { this.options.ingredient = val; }
//}


//$.fn.journalIngredientControl = WidgetConstructor(
//    IngredientControl.GROUP_DATA,
//    IngredientControl.DEFAULTS,
//    (e, o) => new IngredientControl(e, o));

//// #endregion

//// #region NutritionControl

//export interface INutritionControl {
//    readonly: boolean;
//    id: string;
//    nutrition: Nutrition;
//    units: string[];
//    onChange?: (val: Nutrition) => void;
//}

//export class NutritionControl {
//    static CLASS: string = "";
//    static DEFAULTS: INutritionControl = {
//        readonly: false,
//        id: null,
//        nutrition: new Nutrition(),
//        units: [],
//    };
//    static GROUP_DATA: string = 'nutritionControl';

//    controlTemplate: (context: INutritionControl) => string;
//    constructor(private element: HTMLElement, private options?: INutritionControl) {
//        console.log("NutritionControl");
//        let self = this,
//            $this = $(element).addClass("form-group nutrition");

//        self.controlTemplate = kendo.template($('#nutrition-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        let controls = [
//            { value: self.nutrition.calories, id: `${self.id}_calories`, label: 'Calories:' },
//            { value: self.nutrition.totalFat, id: `${self.id}_totalfat`, label: 'Total Fat:' },
//            { value: self.nutrition.saturatedFat, id: `${self.id}_saturatedfat`, label: 'Saturated Fat:' },
//            { value: self.nutrition.transFat, id: `${self.id}_transfat`, label: 'Trans Fat:' },
//            { value: self.nutrition.cholesterol, id: `${self.id}_cholesterol`, label: 'Cholesterol:' },
//            { value: self.nutrition.sodium, id: `${self.id}_sodium`, label: 'Sodium:' },
//            { value: self.nutrition.totalCarbohydrates, id: `${self.id}_totalcarbohydrates`, label: 'Total Carbohydrates:' },
//            { value: self.nutrition.dietaryFiber, id: `${self.id}_dietaryfiber`, label: 'Dietary Fiber:' },
//            { value: self.nutrition.carbohydrates, id: `${self.id}_carbohydrates`, label: 'Carbohyrates:' },
//            { value: self.nutrition.sugar, id: `${self.id}_sugar`, label: 'Sugar:' },
//            { value: self.nutrition.sugarAlcohol, id: `${self.id}_sugaralcohol`, label: 'Sugar Alchohol:' },
//            { value: self.nutrition.protein, id: `${self.id}_protein`, label: 'Protein:' },
//            { value: self.nutrition.vitaminA, id: `${self.id}_vitamin_a`, label: 'Vitamin A:' },
//            { value: self.nutrition.vitaminB1, id: `${self.id}_vitamin_b1`, label: 'Vitamin B1' },
//            { value: self.nutrition.vitaminB2, id: `${self.id}_vitamin_b2`, label: 'Vitamin B2:' },
//            { value: self.nutrition.vitaminB6, id: `${self.id}_vitamin_b6`, label: 'Vitamin B6:' },
//            { value: self.nutrition.vitaminB12, id: `${self.id}_vitamin_b12`, label: 'Vitamin B12:' },
//            { value: self.nutrition.vitaminC, id: `${self.id}_vitamin_c`, label: 'Vitamin C:' },
//            { value: self.nutrition.vitaminD, id: `${self.id}_vitamin_d`, label: 'Vitamin D:' },
//            { value: self.nutrition.vitaminE, id: `${self.id}_vitamin_e`, label: 'Vitamin E:' },
//            { value: self.nutrition.calcium, id: `${self.id}_calcium`, label: 'Calcium:' },
//            { value: self.nutrition.iron, id: `${self.id}_iron`, label: 'Iron:' },
//            { value: self.nutrition.potassium, id: `${self.id}_potassium`, label: 'Potassium:' },
//            { value: self.nutrition.phosporus, id: `${self.id}_phosporus`, label: 'Phosporus:' },
//            { value: self.nutrition.magnesium, id: `${self.id}_magnesium`, label: 'Magnesium:' },
//        ];

//        controls.forEach(control => {
//            $(`#${control.id}`, $this)
//                .journalMeasureField({
//                    readonly: options.readonly,
//                    id: control.id,
//                    measure: control.value,
//                    units: options.units,
//                    label: control.label,
//                    onChange: (value) => {
//                        control.value = value;
//                        if (!!self.options.onChange) {
//                            self.options.onChange(self.nutrition);
//                        }
//                    }
//                });
//        });
//    }

//    get id(): string { return this.options.id; }
//    get nutrition(): Nutrition { return this.options.nutrition; }
//    set nutrition(val: Nutrition) { this.options.nutrition = val; }
//}


//$.fn.journalNutritionControl = WidgetConstructor(
//    NutritionControl.GROUP_DATA,
//    NutritionControl.DEFAULTS,
//    (e, o) => new NutritionControl(e, o));

//// #endregion

//// #region DishIngredientControl

//export interface IDishIngredientControl {
//    readonly: boolean;
//    id: string;
//    ingredient: DishIngredient;
//    onChange?: (val: DishIngredient) => void;
//}

//export class DishIngredientControl {
//    static CLASS: string = "";
//    static DEFAULTS: IDishIngredientControl = {
//        readonly: false,
//        id: null,
//        ingredient: new DishIngredient(),
//    };
//    static GROUP_DATA: string = 'dishIngredientControl';

//    controlTemplate: (context: IDishIngredientControl) => string;
//    constructor(private element: HTMLElement, private options?: IDishIngredientControl) {
//        console.log("DishIngredientControl");
//        let self = this,
//            $this = $(element).addClass("form-group dish-ingredient");

//        self.controlTemplate = kendo.template($('#dish-ingredient-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        let servingsId = `${self.id}_servings`;

//        $(`#${servingsId}`, $this)
//            .journalStringField({
//                readonly: options.readonly,
//                id: servingsId,
//                value: options.ingredient.servings.toString(),
//                label: 'Servings:',
//                onChange: (servings) => {
//                    options.ingredient.servings = servings as any;
//                    if (!!self.options.onChange) {
//                        self.options.onChange(self.ingredient);
//                    }
//                }
//            });
//    }

//    get id(): string { return this.options.id; }
//    get ingredient(): DishIngredient { return this.options.ingredient; }
//    set ingredient(val: DishIngredient) { this.options.ingredient = val; }

//}


//$.fn.journalDishIngredientControl = WidgetConstructor(
//    DishIngredientControl.GROUP_DATA,
//    DishIngredientControl.DEFAULTS,
//    (e, o) => new DishIngredientControl(e, o));

//// #endregion

//// #region DishControl

//export interface IDishControl {
//    readonly: boolean;
//    id: string;
//    dish: Dish;
//    onChange?: (val: Dish) => void;
//}

//export class DishControl {
//    static CLASS: string = "";
//    static DEFAULTS: IDishControl = {
//        readonly: false,
//        id: null,
//        dish: new Dish(),
//    };
//    static GROUP_DATA: string = 'dishControl';

//    controlTemplate: (context: IDishControl) => string;
//    constructor(private element: HTMLElement, private options?: IDishControl) {
//        console.log("DishControl");
//        let self = this,
//            $this = $(element).addClass("form-group dish");

//        self.controlTemplate = kendo.template($('#dish-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        let nameId = `${self.id}_name`;

//        $(`#${nameId}`, $this)
//            .journalStringField({
//                readonly: options.readonly,
//                id: nameId,
//                value: options.dish.name,
//                label: 'Name:',
//                onChange: (name) => {
//                    options.dish.name = name;
//                    if (!!self.options.onChange) {
//                        self.options.onChange(self.dish);
//                    }
//                }
//            });


//    }

//    get id(): string { return this.options.id; }
//    get ingredients(): DishIngredient[] { return this.options.dish.ingredients; }
//    get dish(): Dish { return this.options.dish; }
//    set dish(val: Dish) { this.options.dish = val; }

//}


//$.fn.journalDishControl = WidgetConstructor(
//    DishControl.GROUP_DATA,
//    DishControl.DEFAULTS,
//    (e, o) => new DishControl(e, o));

//// #endregion

//// #region JournalItemControl

//export interface IJournalItemControl {
//    readonly: boolean;
//    id: string;
//    journalItem: JournalItem;
//    onChange?: (val: JournalItem) => void;
//}

//export class JournalItemControl {
//    static CLASS: string = "";
//    static DEFAULTS: IJournalItemControl = {
//        readonly: false,
//        id: null,
//        journalItem: new JournalItem(),
//    };
//    static GROUP_DATA: string = 'journalItemControl';

//    controlTemplate: (context: IJournalItemControl) => string;
//    constructor(private element: HTMLElement, private options?: IJournalItemControl) {
//        console.log("JournalItemControl");
//        let self = this,
//            $this = $(element).addClass("form-group journal-item");

//        self.controlTemplate = kendo.template($('#journal-item-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        let nameId = `${self.id}_name`,
//            servingsId = `${self.id}_servings`;

//        $(`#${nameId}`, $this)
//            .journalStringField({
//                readonly: options.readonly,
//                id: nameId,
//                value: options.journalItem.name,
//                label: 'Name:',
//                onChange: (name) => {
//                    options.journalItem.name = name;
//                    if (!!self.options.onChange) {
//                        self.options.onChange(self.journalItem);
//                    }
//                }
//            });

//        $(`#${servingsId}`, $this)
//            .journalStringField({
//                readonly: options.readonly,
//                id: servingsId,
//                value: options.journalItem.servings as any,
//                label: 'Servings:',
//                onChange: (servings) => {
//                    options.journalItem.servings = servings as any;
//                    if (!!self.options.onChange) {
//                        self.options.onChange(self.journalItem);
//                    }
//                }
//            });


//    }

//    get id(): string { return this.options.id; }

//    get ingredients(): DishIngredient[] { return this.options.journalItem.ingredients; }
//    get journalItem(): JournalItem { return this.options.journalItem; }
//    set journalItem(val: JournalItem) { this.options.journalItem = val; }

//}


//$.fn.journalJournalItemControl = WidgetConstructor(
//    JournalItemControl.GROUP_DATA,
//    JournalItemControl.DEFAULTS,
//    (e, o) => new JournalItemControl(e, o));

//// #endregion

//// #region JournalEntryControl

//export interface IJournalEntryControl {
//    readonly: boolean;
//    id: string;
//    journalEntry: JournalEntry;
//    units: string[];
//    onChange?: (val: JournalEntry) => void;
//}

//export class JournalEntryControl {
//    static CLASS: string = "";
//    static DEFAULTS: IJournalEntryControl = {
//        readonly: false,
//        id: null,
//        units: [],
//        journalEntry: new JournalEntry(),
//    };
//    static GROUP_DATA: string = 'journalEntryControl';

//    controlTemplate: (context: IJournalEntryControl) => string;
//    itemTemplate: (context: IJournalItemControl) => string;

//    constructor(private element: HTMLElement, private options?: IJournalEntryControl) {
//        console.log("JournalEntryControl");
//        let self = this,
//            $this = $(element).addClass("form-group journal-entry");

//        self.controlTemplate = kendo.template($('#journal-entry-template').html());
//        $this.empty().append(self.controlTemplate(options));

//        let timestampId = `${self.id}_timestamp`,
//            itemsId = `${self.id}_items`,
//            nutritionId = `${self.id}_nutrition`;

//        $(`#${timestampId}`, $this)
//            .journalStringField({
//                readonly: true,
//                id: timestampId,
//                value: options.journalEntry.timestamp.toDateString(),
//                label: 'DateTime:',
//            });
//        self.refreshItems();
//        self.refreshNutrition();

//    }

//    refreshItems() {
//        let self = this,
//            $this = $(this.element),
//            itemsId = `${self.id}_items`,
//            $items = $(`#${itemsId}`, $this);

//        $items.empty();
//        self.journalEntry.items.forEach((item, i) => {
//            let itemId = `${itemsId}_${i}`;
//            $('<div>', {})
//                .journalJournalItemControl({
//                    readonly: self.options.readonly,
//                    id: itemId,
//                    journalItem: item,
//                    onChange: (journalItem) => {
//                        self.refreshNutrition();
//                    }
//                })
//                .appendTo($items);
//        });
//    }

//    refreshNutrition() {
//        let self = this,
//            $this = $(this.element),
//            nutritionId = `${self.id}_nutrition`,
//            $nutrition = $(`#${nutritionId}`, $this);

//        $nutrition
//            .journalNutritionControl({
//                readonly: self.options.readonly,
//                id: nutritionId,
//                nutrition: self.options.journalEntry.getNutrition(),
//                units: self.options.units,

//            });
//    }

//    get id(): string { return this.options.id; }
//    get items(): JournalItem[] { return this.options.journalEntry.items; }
//    get journalEntry(): JournalEntry { return this.options.journalEntry; }
//    set journalEntry(val: JournalEntry) { this.options.journalEntry = val; }


//}


//$.fn.journalJournalEntryControl = WidgetConstructor(
//    JournalEntryControl.GROUP_DATA,
//    JournalEntryControl.DEFAULTS,
//    (e, o) => new JournalEntryControl(e, o));

//// #endregion

//// #region JournalReportControl

//export interface IJournalReportControl {
//    id: string;
//    allJournalEntries: JournalEntry[],

//    units: string[],
//    startDate: Date,
//    endDate: Date,
//    ingredients: DishIngredient[],
//    nutrition: Nutrition,
//    onChange?: (val: Dish) => void;
//}
//interface IJournalReportControlItemContext {
//    id: string;
//    name: string;
//    amount: number;
//    units: string;
//}
//export class JournalReportControl {
//    static CLASS: string = "";
//    static DEFAULTS: IJournalReportControl = {
//        id: null,
//        allJournalEntries: [],
//        units: [],
//        startDate: new Date(),
//        endDate: new Date(),
//        ingredients: [],
//        nutrition: new Nutrition()
//    };
//    static GROUP_DATA: string = 'journalReportControl';

//    controlTemplate: (context: IJournalReportControl) => string;
//    itemTemplate: (context: IJournalReportControlItemContext) => string;

//    constructor(private element: HTMLElement, private options?: IJournalReportControl) {
//        console.log("JournalReportControl");
//        let self = this,
//            $this = $(this.element).addClass("form-group journal-report");

//        self.controlTemplate = kendo.template($('#journal-report-template').html());
//        self.itemTemplate = kendo.template($('#ingredients-summary-item-template').html());

//        $this.empty().append(self.controlTemplate(options));

//        let dateRangeId = `${self.id}_daterange`;
//        let dateRange = $(`#${dateRangeId}`, $this);
//        dateRange
//            //.kendoDateRangePicker({
//            //    range: { start: self.options.startDate, end: self.options.endDate },
//            //    labels: true,
//            //    change: (e) => {
//            //        let range = (e.sender as kendo.ui.DateRangePicker).range();
//            //        self.startDate = range.start;
//            //        self.endDate = range.end;
//            //        self.refreshIngredients();
//            //        self.refreshNutrition();
//            //    }
//            //});
//            .kendoDatePicker({
//                change: (e) => {
//                    let startDate = (e.sender as kendo.ui.DatePicker).value();
//                    self.startDate = startDate;
//                    self.refreshIngredients();
//                    self.refreshNutrition();
//                }
//            });



//        self.refreshIngredients();
//        self.refreshNutrition();
//    }

//    refreshIngredients() {
//        let self = this,
//            $this = $(this.element),
//            ingredientsId = `${self.id}_ingredients`,
//            $ingredients = $(`#${ingredientsId}`, $this),
//            journalRange = JournalEntry.getRange(self.options.allJournalEntries, self.startDate, self.endDate);
//        self.ingredients = JournalEntry.getIngredients(journalRange);
//        self.#journalRange = journalRange;

//        let amounts = DishIngredient.getAmounts(self.ingredients);
//        $ingredients.empty();
//        amounts.forEach((item, i) => {
//            let itemId = `${ingredientsId}_${i}`;
//            $(self.itemTemplate({
//                id: itemId,
//                name: item.name,
//                amount: item.amount,
//                units: item.units
//            }))
//                .appendTo($ingredients);
//        });
//    }

//    refreshNutrition() {
//        let self = this,
//            $this = $(this.element),
//            nutritionId = `${self.id}_nutrition`,
//            $nutrition = $(`#${nutritionId}`, $this);

//        self.nutrition = JournalEntry.getNutrition(this.#journalRange);
//        $nutrition.replaceWith($('<div>')
//            .journalNutritionControl({
//                readonly: true,
//                id: nutritionId,
//                nutrition: self.nutrition,
//                units: self.units,
//            }));
//    }
//    get id(): string { return this.options.id; }
//    get units(): string[] { return this.options.units; }
//    get allEntries(): JournalEntry[] { return this.options.allJournalEntries; }

//    #journalRange: JournalEntry[] = [];

//    get ingredients(): DishIngredient[] { return this.options.ingredients; }
//    set ingredients(val: DishIngredient[]) { this.options.ingredients = val; }

//    get nutrition(): Nutrition { return this.options.nutrition; }
//    set nutrition(val: Nutrition) { this.options.nutrition = val; }

//    get startDate(): Date { return this.options.startDate; }
//    set startDate(val: Date) { this.options.startDate = val; }

//    get endDate(): Date { return this.options.endDate; }
//    set endDate(val: Date) { this.options.endDate = val; }

//}


//$.fn.journalJournalReportControl = WidgetConstructor(
//    JournalReportControl.GROUP_DATA,
//    JournalReportControl.DEFAULTS,
//    (e, o) => new JournalReportControl(e, o));

//// #endregion


//declare global {
//    interface JQuery {
//        journalMeasureField(options?: IMeasureField): JQuery;
//        journalStringField(options?: IStringField): JQuery;
//        journalSelectField(options?: ISelectField): JQuery;
//        journalIngredientControl(options?: IIngredientControl): JQuery;
//        journalNutritionControl(options?: INutritionControl): JQuery;
//        journalDishIngredientControl(options?: IDishIngredientControl): JQuery;
//        journalDishControl(options?: IDishControl): JQuery;
//        journalJournalItemControl(options?: IJournalItemControl): JQuery;
//        journalJournalEntryControl(options?: IJournalEntryControl): JQuery;
//        journalJournalReportControl(options?: IJournalReportControl): JQuery;
//    }
//}