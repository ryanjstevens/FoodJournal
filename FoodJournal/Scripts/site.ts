
//import * as $ from 'jquery';
//module FoodJournal {




//declare global {
//    interface Object {
//        getPropertyNamesOnly: (targetClass: any) => string[];
//    }
//}
//Object.prototype.getPropertyNamesOnly = function (targetClass: any) {
//    const properties = Object.getOwnPropertyNames(targetClass);

//    return properties.filter(p => {
//        const desc = Object.getOwnPropertyDescriptor(targetClass, p);
//        return !!desc.get || !!desc.set;
//    });
//};


export module FoodJournal {
    let Units = {
        milligrams: 'mg',
        grams: 'g',
        kilograms: 'kg',
        ounce: 'oz',
        pounds: 'lb',
        pint: 'pt',
        quart: 'qt',
        gallon: 'gal',
        calories: 'calories',
        Calories: 'Calories',
        serving: 'serving',
        tablet: 'tablet',
        softGel: 'soft gel',
        bar: 'bar',
    }


    // #region Local Database
    export interface ISerializable {
        serialize: () => object;
    }
    export interface IJournalTableEntity<RowType extends IJournalTableRow> extends ISerializable {
        serialize: () => RowType;
        id: string;
    }
    export interface IUnit extends IJournalTableRow {
        measure?: string;
    }
    export interface IComponentMeasure {
        amount?: number;
        units?: string;
    }
    export interface INutrition {
        calories?: IComponentMeasure;
        fat?: IComponentMeasure;
        saturatedFat?: IComponentMeasure;
        transFat?: IComponentMeasure;
        cholesterol?: IComponentMeasure;
        sodium?: IComponentMeasure;
        dietaryFiber?: IComponentMeasure;
        carbohydrates?: IComponentMeasure;
        sugar?: IComponentMeasure;
        sugarAlcohol?: IComponentMeasure;
        protein?: IComponentMeasure;
        vitaminA?: IComponentMeasure;
        vitaminB1?: IComponentMeasure;
        vitaminB2?: IComponentMeasure;
        vitaminB6?: IComponentMeasure;
        vitaminB12?: IComponentMeasure;
        vitaminC?: IComponentMeasure;
        vitaminD?: IComponentMeasure;
        vitaminE?: IComponentMeasure;
        calcium?: IComponentMeasure;
        iron?: IComponentMeasure;
        potassium?: IComponentMeasure;
        phosphorus?: IComponentMeasure;
        magnesium?: IComponentMeasure;
    }

    export interface IIngredient extends IJournalTableRow {
        name?: string;
        nutrition?: INutrition;
        servingSize?: IComponentMeasure;
    }

    export interface IDishIngredient extends IJournalTableRow {
        servings?: number;
        //ingredientId?: string;
    }

    export interface IDish extends IJournalTableRow {
        name?: string;
        ingredients?: IDishIngredient[];
    }

    export interface IJournalItem extends IJournalTableRow {
        //dishId?: string;
        servings?: number;
    }
    export interface IJournalEntry extends IJournalTableRow {
        timestamp?: Date;
        items?: IJournalItem[];
    }

    export class JournalDatabase {

        readonly name: string = "JournalDatabase";
        readonly version: number = 1;

        #IndxDb: IDBFactory;
        //#db: IDBDatabase;

        units: JournalTable<IUnit>;
        ingredients: JournalTable<IIngredient>;
        dishes: JournalTable<IDish>;
        journalEntries: JournalTable<IJournalEntry>;

        constructor() {
            this.#IndxDb = window.indexedDB;

        }

        async initialize(): Promise<JournalDatabase> {
            let self = this;
            console.log(`Database.init - ${name}`);
            let upgrading = false;
            return new Promise<JournalDatabase>((resolve, reject) => {
                let self = this,
                    request = self.#IndxDb.open(self.name, self.version);
                request.onerror = (e) => {
                    console.log(`Database.error - ${name}`, e);
                    reject("Failed to Open.");
                };
                request.onupgradeneeded = async (e) => {
                    //console.log(`Database.init.upgrading - ${name}`, e);
                    await self.#initTables(request.result);
                    await Promise.race([
                        self.units.upgrade(e.newVersion, e.oldVersion),
                        self.ingredients.upgrade(e.newVersion, e.oldVersion),
                        self.dishes.upgrade(e.newVersion, e.oldVersion),
                        self.journalEntries.upgrade(e.newVersion, e.oldVersion),
                    ]);
                    await self.importDefaults();
                }
                request.onsuccess = async (e: any) => {
                    //console.log(`Database.success - ${name}`, e);
                    await self.#initTables(request.result);
                    resolve(self);
                }
            });
        }

        async #initTables(db: IDBDatabase): Promise<boolean> {
            let self = this;
            //console.log(`Database.initTables - ${name}`);

            self.units = self.units ||
                await new JournalTable<IUnit>(db, {
                    name: "Units",
                    keyIndex: {
                        name: "id",
                        field: "id",
                        unique: true,
                        autoIncrement: false
                    },
                    indexes: [
                        { name: 'measure', field: 'measure', unique: true },
                    ]
                });

            self.ingredients = self.ingredients ||
                await new JournalTable<IIngredient>(db, {
                    name: "Ingredients",
                    keyIndex: {
                        name: "id",
                        field: "id",
                        unique: true,
                        autoIncrement: false
                    },
                    indexes: [
                        { name: 'name', field: 'name', unique: true },
                    ]
                });

            self.dishes = self.dishes ||
                await new JournalTable<IDish>(db, {
                    name: "Dishes",
                    keyIndex: {
                        name: "id",
                        field: "id",
                        unique: true,
                        autoIncrement: false
                    },
                    indexes: [
                        { name: 'name', field: 'name', unique: true },
                    ]
                });

            self.journalEntries = self.journalEntries ||
                await new JournalTable<IJournalEntry>(db, {
                    name: "JournalEntries",
                    keyIndex: {
                        name: "id",
                        field: "id",
                        unique: true,
                        autoIncrement: false
                    },
                    indexes: []
                });

            return true;
        }


        async importDefaults(): Promise<boolean> {
            let self = this;
            console.log(`Database.importDefaults - ${name}`);

            // Inject default data
            Object.keys(Units).forEach(async k => await self.units.save({ measure: k }));
            InitialIngredients.forEach(async k => await self.ingredients.save(k));
            InitialDishes.forEach(async k => await self.dishes.save(k));
            return true;
        }
    }

    interface IJournalTableConfig {
        name: string;
        keyIndex: IJournalTableIndex;
        indexes: IJournalTableIndex[];
    }

    interface IJournalTableIndex {
        name: string;
        field: string;
        unique?: boolean;
        autoIncrement?: boolean;
    }
    interface IJournalTableRow {
        id?: string;
    }

    export class JournalTable<RowType extends IJournalTableRow> {
        constructor(db: IDBDatabase, configuration: IJournalTableConfig) {
            let self = this;
            console.log(`Table.init - ${name}`);
            self.#db = db;
            self.#name = configuration.name;
            self.#keyIndex = configuration.keyIndex;
            self.#indexes = configuration.indexes || [];
        }

        #db: IDBDatabase;
        #name: string;
        #keyIndex: IJournalTableIndex;
        #indexes: IJournalTableIndex[];

        async upgrade(newVersion: number, oldVersion: number): Promise<boolean> {
            let self = this;

            return new Promise<boolean>((resolve, reject) => {
                if (!self.#db.objectStoreNames.contains(self.#name)) {
                    let options = { keypath: self.#keyIndex.field, autoIncrement: self.#keyIndex.autoIncrement },
                        store = self.#db.createObjectStore(self.#name, options),
                        pk = self.#keyIndex;

                    store.createIndex(pk.name, pk.field, { unique: true });
                    self.#indexes.forEach(i => {
                        store.createIndex(i.name, i.field, { unique: i.unique });
                    });
                    store.transaction.onerror = (e) => {
                        console.log(`Table.init.error`, e);
                        reject(e);
                    }
                    store.transaction.oncomplete = (e) => {
                        console.log(`Table.init.oncomplete - ${name}`, e);
                        resolve(true);
                    }
                } else
                    resolve(true);
            });
        }
        async save(src: RowType): Promise<number> {
            let self = this,
                transaction = self.#db.transaction([self.#name], "readwrite"),
                store = transaction.objectStore(self.#name);

            src.id = src.id || window.uuid.v4();
            return new Promise<number>((resolve, reject) => {
                const key = src[self.#keyIndex.field];
                const request = !!key ? store.put(src, key) : store.add(src);
                request.onsuccess = (e) => { resolve(request.result as any); };
                request.onerror = (e) => { reject("Failed"); };
            });
        }
        async delete(id: string | number): Promise<boolean> {
            let self = this,
                transaction = self.#db.transaction([self.#name], "readwrite"),
                store = transaction.objectStore(self.#name);

            return new Promise<boolean>((resolve, reject) => {
                const request = store.delete(id);
                request.onsuccess = (e) => { resolve(true); };
                request.onerror = (e) => { reject("Failed"); };
            });
        }
        async get(id: string | number): Promise<RowType> {
            let self = this,
                transaction = self.#db.transaction([self.#name], "readwrite"),
                store = transaction.objectStore(self.#name)//,
                //idx = store.index(self.#keyIndex.name)
                ;
            //id = Number.parseInt(id as any);
            return new Promise<RowType>((resolve, reject) => {
                const request = store.get(id);
                request.onsuccess = (e) => {
                    let d = request.result as RowType;
                    d[self.#keyIndex.field] = id;
                    resolve(d);
                };
                request.onerror = (e) => { reject("Failed"); };
            });
        }
        async getAll(): Promise<RowType[]> {
            let self = this,
                transaction = self.#db.transaction([self.#name], "readwrite"),
                store = transaction.objectStore(self.#name);

            return new Promise<RowType[]>((resolve, reject) => {
                const request = store.getAllKeys();
                request.onsuccess = async (e) => {
                    let keys = request.result;
                    let query = [];
                    keys.forEach(k => query.push(self.get(k as number)));
                    resolve(await Promise.all(query));
                };
                request.onerror = (e) => { reject("Failed"); };
            });
        }

    }

    // #endregion

    // #region Data
    class Base {
        getPropertyNamesOnly(targetClass: any) {
            const properties = Object.getOwnPropertyNames(targetClass);

            return properties.filter(p => {
                const desc = Object.getOwnPropertyDescriptor(targetClass, p);
                return !!desc.get || !!desc.set;
            });
        }
    }

    export class ComponentMeasure implements ISerializable {
        constructor(data?) {
            data = data || {};

            this.amount = data.amount;
            this.units = data.units;
        }

        #amount: number;
        get amount(): number { return this.#amount; }
        set amount(val: number) { this.#amount = Number.parseFloat(val as any) || 0; }

        #units: string;
        get units(): string { return this.#units; }
        set units(val: string) { this.#units = val || Units.grams; }


        static sum(components: ComponentMeasure[]): ComponentMeasure {
            let combined = new ComponentMeasure();
            if (!!components && Array.isArray(components)) {
                for (let i = 0; i < components.length; i++) {
                    let comp = components[i];
                    combined.units = combined.units || comp.units;
                    combined.add(comp.units, comp.amount);
                }
            }
            return combined;
        }

        add(units: string, amount: number): number {
            if (amount === 0) return this.amount;
            this.amount += ComponentMeasure.convertMeasureAmount(units, this.units, amount);
            return this.amount;
        }

        serialize(): IComponentMeasure {
            return {
                amount: this.amount,
                units: this.units
            };
        }

        static convertMeasureAmount(sourceMeasure: string, targetMeasure: string, amount: number): number {
            let invalidConversion = "Invalid unit conversion. [" + sourceMeasure + " => " + targetMeasure + "]";
            if (!sourceMeasure || !targetMeasure) return 0;
            if (sourceMeasure === targetMeasure) return amount;

            switch (targetMeasure) {
                case Units.grams:
                    switch (sourceMeasure) {
                        case Units.grams: return amount;
                        case Units.milligrams: return amount * .001;
                        case Units.kilograms: return amount * 1000;
                        default: throw invalidConversion;
                    }
                case Units.kilograms:
                    switch (sourceMeasure) {
                        case Units.grams: return amount * .001;
                        case Units.milligrams: return amount * .001 * .001;
                        case Units.kilograms: return amount;
                        default: throw invalidConversion;
                    }
                case Units.milligrams:
                    switch (sourceMeasure) {
                        case Units.grams: return amount * 1000;
                        case Units.milligrams: return amount;
                        case Units.kilograms: return amount * 1000 * 1000;
                        default: throw invalidConversion;
                    }
                default: throw invalidConversion;
            }
        }
    };

    ComponentMeasure.prototype.toString = function () {
        return Intl.NumberFormat().format(this.amount) + this.units;
    };

    export class Nutrition extends Base implements ISerializable {
        constructor(data?) {
            super();
            data = data || {};

            this.calories = data.calories;
            this.fat = data.fat;
            this.saturatedFat = data.saturatedFat;
            this.transFat = data.transFat;
            this.cholesterol = data.cholesterol;
            this.sodium = data.sodium;
            this.dietaryFiber = data.dietaryFiber;
            this.carbohydrates = data.carbohydrates;
            this.sugar = data.sugar;
            this.sugarAlcohol = data.sugarAlcohol;
            this.protein = data.protein;

            this.vitaminA = data.vitaminA;
            this.vitaminB1 = data.vitaminB1;
            this.vitaminB2 = data.vitaminB2;
            this.vitaminB6 = data.vitaminB6;
            this.vitaminB12 = data.vitaminB12;

            this.vitaminC = data.vitaminC;
            this.vitaminD = data.vitaminD;
            this.vitaminE = data.vitaminE;
            this.calcium = data.calcium;
            this.iron = data.iron;
            this.potassium = data.potassium;
            this.phosporus = data.phosporus;
            this.magnesium = data.magnesium;

        }

        #calories: ComponentMeasure;
        get calories(): ComponentMeasure { return this.#calories; }
        set calories(val: ComponentMeasure) { this.#calories = new ComponentMeasure(val); }

        #fat: ComponentMeasure;
        get fat(): ComponentMeasure { return this.#fat; }
        set fat(val: ComponentMeasure) { this.#fat = new ComponentMeasure(val); }

        #saturatedFat: ComponentMeasure;
        get saturatedFat(): ComponentMeasure { return this.#saturatedFat; }
        set saturatedFat(val: ComponentMeasure) { this.#saturatedFat = new ComponentMeasure(val); }

        #transFat: ComponentMeasure;
        get transFat(): ComponentMeasure { return this.#transFat; }
        set transFat(val: ComponentMeasure) { this.#transFat = new ComponentMeasure(val); }

        #cholesterol: ComponentMeasure;
        get cholesterol(): ComponentMeasure { return this.#cholesterol; }
        set cholesterol(val: ComponentMeasure) { this.#cholesterol = new ComponentMeasure(val); }

        #sodium: ComponentMeasure;
        get sodium(): ComponentMeasure { return this.#sodium; }
        set sodium(val: ComponentMeasure) { this.#sodium = new ComponentMeasure(val); }

        #dietaryFiber: ComponentMeasure;
        get dietaryFiber(): ComponentMeasure { return this.#dietaryFiber; }
        set dietaryFiber(val: ComponentMeasure) { this.#dietaryFiber = new ComponentMeasure(val); }

        #sugar: ComponentMeasure;
        get sugar(): ComponentMeasure { return this.#sugar; }
        set sugar(val: ComponentMeasure) { this.#sugar = new ComponentMeasure(val); }

        #carbohydrates: ComponentMeasure;
        get carbohydrates(): ComponentMeasure { return this.#carbohydrates; }
        set carbohydrates(val: ComponentMeasure) { this.#carbohydrates = new ComponentMeasure(val); }

        #sugarAlcohol: ComponentMeasure;
        get sugarAlcohol(): ComponentMeasure { return this.#sugarAlcohol; }
        set sugarAlcohol(val: ComponentMeasure) { this.#sugarAlcohol = new ComponentMeasure(val); }

        #protein: ComponentMeasure;
        get protein(): ComponentMeasure { return this.#protein; }
        set protein(val: ComponentMeasure) { this.#protein = new ComponentMeasure(val); }

        #vitaminA: ComponentMeasure;
        get vitaminA(): ComponentMeasure { return this.#vitaminA; }
        set vitaminA(val: ComponentMeasure) { this.#vitaminA = new ComponentMeasure(val); }

        #vitaminB1: ComponentMeasure;
        get vitaminB1(): ComponentMeasure { return this.#vitaminB1; }
        set vitaminB1(val: ComponentMeasure) { this.#vitaminB1 = new ComponentMeasure(val); }

        #vitaminB2: ComponentMeasure;
        get vitaminB2(): ComponentMeasure { return this.#vitaminB2; }
        set vitaminB2(val: ComponentMeasure) { this.#vitaminB2 = new ComponentMeasure(val); }

        #vitaminB6: ComponentMeasure;
        get vitaminB6(): ComponentMeasure { return this.#vitaminB6; }
        set vitaminB6(val: ComponentMeasure) { this.#vitaminB6 = new ComponentMeasure(val); }

        #vitaminB12: ComponentMeasure;
        get vitaminB12(): ComponentMeasure { return this.#vitaminB12; }
        set vitaminB12(val: ComponentMeasure) { this.#vitaminB12 = new ComponentMeasure(val); }

        #vitaminC: ComponentMeasure;
        get vitaminC(): ComponentMeasure { return this.#vitaminC; }
        set vitaminC(val: ComponentMeasure) { this.#vitaminC = new ComponentMeasure(val); }

        #vitaminD: ComponentMeasure;
        get vitaminD(): ComponentMeasure { return this.#vitaminD; }
        set vitaminD(val: ComponentMeasure) { this.#vitaminD = new ComponentMeasure(val); }

        #vitaminE: ComponentMeasure;
        get vitaminE(): ComponentMeasure { return this.#vitaminE; }
        set vitaminE(val: ComponentMeasure) { this.#vitaminE = new ComponentMeasure(val); }

        #calcium: ComponentMeasure;
        get calcium(): ComponentMeasure { return this.#calcium; }
        set calcium(val: ComponentMeasure) { this.#calcium = new ComponentMeasure(val); }

        #iron: ComponentMeasure;
        get iron(): ComponentMeasure { return this.#iron; }
        set iron(val: ComponentMeasure) { this.#iron = new ComponentMeasure(val); }

        #potassium: ComponentMeasure;
        get potassium(): ComponentMeasure { return this.#potassium; }
        set potassium(val: ComponentMeasure) { this.#potassium = new ComponentMeasure(val); }

        #phosporus: ComponentMeasure;
        get phosporus(): ComponentMeasure { return this.#phosporus; }
        set phosporus(val: ComponentMeasure) { this.#phosporus = new ComponentMeasure(val); }

        #magnesium: ComponentMeasure;
        get magnesium(): ComponentMeasure { return this.#magnesium; }
        set magnesium(val: ComponentMeasure) { this.#magnesium = new ComponentMeasure(val); }

        get totalFat(): ComponentMeasure {
            return ComponentMeasure.sum([
                this.fat,
                this.saturatedFat,
                this.transFat
            ]);
        }

        get totalCarbohydrates(): ComponentMeasure {
            return ComponentMeasure.sum([
                this.carbohydrates,
                this.dietaryFiber,
                this.sugar,
                this.sugarAlcohol
            ]);
        }

        calculateForServings(servings: number): Nutrition {
            let data = {};
            let props = Nutrition.prototype.getPropertyNamesOnly(Nutrition.prototype);
            for (let k = 0; k < props.length; k++) {
                let prop = props[k],
                    source = this[prop];

                data[prop] = new ComponentMeasure({ units: source.units, amount: source.amount * servings });
            }
            return new Nutrition(data);
        }

        serialize(): INutrition {
            return {
                calcium: this.calcium.serialize(),
                calories: this.calories.serialize(),
                carbohydrates: this.carbohydrates.serialize(),
                cholesterol: this.cholesterol.serialize(),
                dietaryFiber: this.dietaryFiber.serialize(),
                fat: this.fat.serialize(),
                iron: this.iron.serialize(),
                magnesium: this.magnesium.serialize(),
                phosphorus: this.phosporus.serialize(),
                potassium: this.potassium.serialize(),
                vitaminA: this.vitaminA.serialize(),
                protein: this.protein.serialize(),
                saturatedFat: this.saturatedFat.serialize(),
                sodium: this.sodium.serialize(),
                sugar: this.sugar.serialize(),
                sugarAlcohol: this.sugarAlcohol.serialize(),
                transFat: this.transFat.serialize(),
                vitaminB1: this.vitaminB1.serialize(),
                vitaminB12: this.vitaminB12.serialize(),
                vitaminB2: this.vitaminB2.serialize(),
                vitaminB6: this.vitaminB6.serialize(),
                vitaminC: this.vitaminC.serialize(),
                vitaminD: this.vitaminD.serialize(),
                vitaminE: this.vitaminE.serialize(),
            };
        }

        static sum(nutritions: Nutrition[]): Nutrition {
            if (!!nutritions && Array.isArray(nutritions)) {
                if (nutritions.length === 0) return new Nutrition();
                let combined = new Nutrition(nutritions[0]);
                for (let i = 1; i < nutritions.length; i++) {
                    combined = combined.add(nutritions[i]);
                }
                return combined;
            }
            else {
                throw "Invalid operation - [nutritions] must be an array of NutritionData";
            }
        }

        add(item: Nutrition): Nutrition {
            let comb = new Nutrition(this);
            let props = Nutrition.prototype.getPropertyNamesOnly(Nutrition.prototype);
            for (let k = 0; k < props.length; k++) {
                let prop = props[k],
                    current = comb[prop],
                    source = item[prop];

                if (current instanceof ComponentMeasure && source instanceof ComponentMeasure) {
                    current.add(source.units, source.amount);
                }
            }
            return comb;
        }
    };

    Nutrition.prototype.toString = function () {
        let props = Nutrition.prototype.getPropertyNamesOnly(Nutrition.prototype);
        let str = "";
        for (let i = 0; i < props.length; i++) {
            let prop = props[i],
                value = this[prop];
            str += str == "" ? "" : ", ";
            str += prop + " : " + value.toString();
        }
        return str;
    }

    export class Ingredient implements IJournalTableEntity<IIngredient> {
        constructor(data?) {
            data = data || {};
            this.id = data.id;
            this.name = data.name;
            this.nutrition = data.nutrition;
            this.servingSize = data.servingSize;
        }
        readonly id: string;

        #name: string;
        get name(): string { return this.#name; }
        set name(val: string) { this.#name = val || ""; }

        #nutrition: Nutrition;
        get nutrition(): Nutrition { return this.#nutrition; }
        set nutrition(val: Nutrition) { this.#nutrition = new Nutrition(val); }

        #servingSize: ComponentMeasure;
        get servingSize(): ComponentMeasure { return this.#servingSize; }
        set servingSize(val: ComponentMeasure) { this.#servingSize = new ComponentMeasure(val); }

        serialize(): IIngredient {
            return {
                id: this.id,
                name: this.name,
                nutrition: this.nutrition.serialize(),
                servingSize: this.servingSize.serialize(),

            };
        }
        static async Find(db: JournalDatabase, id: string): Promise<Ingredient> {
            let data = await db.ingredients.get(id.toString());
            data.id = id;
            return new Ingredient(data);
        }
    };

    export class DishIngredient extends Ingredient {
        constructor(data?, servings?: number | string) {
            super(data || {});
            data = data || {};
            this.servings = data.servings || servings;
            //this.#ingredientId = data.ingredientId;
        }
        //#ingredientId: string;
        #servings: number;
        get servings(): number { return this.#servings; }
        set servings(val: number) { this.#servings = Number.parseFloat(val as any) || 1; }

        get amount(): string { return (this.servings * this.servingSize.amount).toString() + " " + this.servingSize.units; }
        static getAmounts(dishIngredients: DishIngredient[]): IIngredientSummaryItem[] {
            let amounts = {};
            for (let i = 0; i < dishIngredients.length; i++) {
                let d = dishIngredients[i];
                let a = amounts[d.name] = amounts[d.name] || { amount: 0, units: d.servingSize.units };
                a.amount += d.servings * d.servingSize.amount;
            }
            let keys = Object.keys(amounts);
            let sums = [] as IIngredientSummaryItem[];
            for (let k = 0; k < keys.length; k++) {
                sums.push({ name: keys[k], amount: amounts[keys[k]].amount, units: amounts[keys[k]].units });
            }
            return sums;
        }

        getServingNutrition() {
            return this.nutrition.calculateForServings(this.servings);
        }

        serialize(): IDishIngredient {
            //let result = super.serialize() as IDishIngredient;
            //result.servings = this.servings;
            //return result;
            return {
                id: this.id,
                //ingredientId: this.#ingredientId,
                servings: this.#servings
            };
        }
    }

    export interface IIngredientSummaryItem {
        name: string;
        amount: number;
        units: string;
    }

    export class Dish implements IJournalTableEntity<IDish> {
        constructor(data?) {
            data = data || {};
            this.id = data.id || window.uuid.v4();
            this.name = data.name;
            this.#ingredients = [];
            if (data.ingredients) { data.ingredients.forEach((i) => this.#ingredients.push(new DishIngredient(i))); }
        }

        readonly id: string;
        #name: string;
        get name(): string { return this.#name; }
        set name(val: string) { this.#name = val || ""; }

        #ingredients: DishIngredient[];
        get ingredients(): DishIngredient[] { return this.#ingredients; }

        getNutrition(): Nutrition {
            if (this.ingredients && Array.isArray(this.ingredients) && this.ingredients.length > 0) {
                let comb = new Nutrition(this.ingredients[0].nutrition);
                for (let i = 1; i < this.ingredients.length; i++) {
                    comb = comb.add(this.ingredients[i].nutrition);
                }
                return comb;
            }
            return new Nutrition();
        }

        addIngredient(ingredient: Ingredient) {
            let item = this.ingredients.find((v) => { return v.id === ingredient.id; });
            if (!item) {
                item = new DishIngredient(ingredient.serialize());
                this.ingredients.push(item);
            }
            item.servings++;
        }

        serialize(): IDish {
            let ingredients: IDishIngredient[] = [];
            this.ingredients.forEach(i => ingredients.push(i.serialize()));
            return {
                id: this.id,
                name: this.name,
                ingredients: ingredients,
            };
        }

        static async Find(db: JournalDatabase, id: string): Promise<Dish> {
            let data = await db.dishes.get(id.toString());
            data.id = id;
            return new Dish(data);
        }
    };

    export class JournalItem extends Dish {
        constructor(data?) {
            super(data);
            data = data || {};

            this.servings = data.servings;
            //this.#dishId = data.dishId;
        }


        //#dishId: string;
        #servings: number;
        get servings(): number { return this.#servings; }
        set servings(val: number) { this.#servings = Number.parseFloat(val as any) || 1; }

        getNutrition(): Nutrition {
            return super.getNutrition().calculateForServings(this.servings);
        }

        serialize(): IJournalItem {
            //let data = super.serialize() as IJournalItem;
            //data.servings = this.servings;
            //return data;
            return {
                id: this.id,
                //dishId: this.#dishId,
                servings: this.servings
            };
        }

    }

    //class JournalItem {
    //    constructor(data) {
    //        data = data || {};
    //        this.#dishes = data.dishes || [];
    //    }

    //    #dishes;
    //    get dishes() { return this.#dishes; }

    //    getNutrition() {

    //        if (this.dishes && Array.isArray(this.dishes) && this.dishes.length > 0) {
    //            let comb = new Nutrition(this.dishes[0].getNutrition());
    //            for (let i = 1; i < this.dishes.length; i++) {
    //                comb.add(this.dishes[i].nutrition);
    //            }
    //            return comb;
    //        }
    //        return new Nutrition();
    //    }
    //}

    export class JournalEntry implements IJournalTableEntity<IJournalEntry> {
        constructor(data?, db?: JournalDatabase) {
            data = data || {};
            this.id = data.id;
            this.#timestamp = (data.timestamp instanceof Date ? data.timestamp : new Date(data.timeStamp || new Date()));
            this.#items = [];
            if (data.items) { data.items.forEach((i) => this.#items.push(new JournalItem(i))) }
        }



        readonly id: string;
        #timestamp: Date;
        get timestamp(): Date { return this.#timestamp; }

        #items: JournalItem[];
        get items(): JournalItem[] { return this.#items; }

        getNutrition(): Nutrition {

            if (this.items && Array.isArray(this.items) && this.items.length > 0) {
                let comb = new Nutrition(this.items[0].getNutrition());
                for (let i = 1; i < this.items.length; i++) {
                    comb = comb.add(this.items[i].getNutrition());
                }
                return comb;
            }
            return new Nutrition();
        }

        serialize(): IJournalEntry {
            let items: IJournalItem[] = [];
            this.items.forEach(i => items.push(i.serialize()));
            return {
                id: this.id,
                timestamp: this.timestamp,
                items: items
            };
        }


        addDish(src: Dish) {
            let item = src as IJournalItem;
            item.servings = 1;
            this.items.push(new JournalItem(item));
        }

        static getNutrition(entries: JournalEntry[]): Nutrition {
            var nutritions = [];
            for (var i = 0; i < entries.length; i++) {
                nutritions.push(entries[i].getNutrition());
            }
            return Nutrition.sum(nutritions);
        }

        static getIngredients(entries: JournalEntry[]): DishIngredient[] {
            var ingredients = [] as DishIngredient[];
            for (var e = 0; e < entries.length; e++) {
                let entry = entries[e];
                for (var d = 0; d < entry.items.length; d++) {
                    let item = entry.items[d];
                    for (var i = 0; i < item.ingredients.length; i++) {
                        ingredients.push(item.ingredients[i]);
                    }
                }
            }
            return ingredients;
        }

        static getRange(array: JournalEntry[], startDate: Date, endDate: Date): JournalEntry[] {
            return array.filter(je =>
                je.timestamp.getTime() >= startDate.getTime() &&
                je.timestamp.getTime() <= endDate.getTime());
        }
        static ingredientAmountToString(item): string {
            return item.name + " " + item.amount + " " + item.units;
        }
        static async Find(db: JournalDatabase, id: string): Promise<JournalEntry> {
            let data = await db.journalEntries.get(id.toString());
            data.id = id;
            for (let i = 0; i < data.items.length; i++) {
                let item = data.items[i];
                let dish = await db.dishes.get(item.id.toString());
                merge(item, dish);
            };
            return new JournalEntry(data);
        }
    }




    let InitialIngredients: IIngredient[] = [
        {
            name: "think! High Protein Bars (Chunky Peanut Butter) 60g bar",
            servingSize: { units: Units.bar, amount: 1 },
            nutrition: {
                calories: { units: Units.Calories, amount: 240 },
                fat: { units: Units.grams, amount: 7 },
                saturatedFat: { units: Units.grams, amount: 3 },
                transFat: { units: Units.grams, amount: 0 },
                cholesterol: { units: Units.milligrams, amount: 0 },
                sodium: { units: Units.milligrams, amount: 220 },
                dietaryFiber: { units: Units.grams, amount: 1 },
                carbohydrates: { units: Units.grams, amount: 12 },
                sugar: { units: Units.grams, amount: 0 },
                sugarAlcohol: { units: Units.grams, amount: 10 },
                protein: { units: Units.grams, amount: 20 },
                vitaminD: { units: Units.milligrams, amount: 0 },
                calcium: { units: Units.milligrams, amount: 120 },
                iron: { units: Units.milligrams, amount: 1.5 },
                potassium: { units: Units.milligrams, amount: 130 },
                phosphorus: { units: Units.milligrams, amount: 0 },
                magnesium: { units: Units.milligrams, amount: 0 },
            }
        },
        {
            name: "Medi Calcium 4 Blend",
            servingSize: { units: Units.tablet, amount: 1 },
            nutrition: {
                calories: { units: Units.Calories, amount: 0 },
                fat: { units: Units.grams, amount: 0 },
                saturatedFat: { units: Units.grams, amount: 0 },
                transFat: { units: Units.grams, amount: 0 },
                cholesterol: { units: Units.milligrams, amount: 0 },
                sodium: { units: Units.milligrams, amount: 0 },
                dietaryFiber: { units: Units.grams, amount: 0 },
                carbohydrates: { units: Units.grams, amount: 0 },
                sugar: { units: Units.grams, amount: 0 },
                sugarAlcohol: { units: Units.grams, amount: 0 },
                protein: { units: Units.grams, amount: 0 },
                vitaminD: { units: Units.milligrams, amount: 10 },
                calcium: { units: Units.milligrams, amount: 500 },
                iron: { units: Units.milligrams, amount: 0 },
                potassium: { units: Units.milligrams, amount: 0 },
                phosphorus: { units: Units.milligrams, amount: 34 },
                magnesium: { units: Units.milligrams, amount: 150 },
            }
        },
        {
            name: "Medi Fat Burner",
            servingSize: { units: Units.tablet, amount: 2 },
            nutrition: {
                calories: { units: Units.Calories, amount: 0 },
                fat: { units: Units.grams, amount: 0 },
                saturatedFat: { units: Units.grams, amount: 0 },
                transFat: { units: Units.grams, amount: 0 },
                cholesterol: { units: Units.milligrams, amount: 0 },
                sodium: { units: Units.milligrams, amount: 0 },
                dietaryFiber: { units: Units.grams, amount: 0 },
                carbohydrates: { units: Units.grams, amount: 0 },
                sugar: { units: Units.grams, amount: 0 },
                sugarAlcohol: { units: Units.grams, amount: 0 },
                protein: { units: Units.grams, amount: 0 },
                vitaminD: { units: Units.milligrams, amount: 0 },
                calcium: { units: Units.milligrams, amount: 265 },
                iron: { units: Units.milligrams, amount: 0 },
                potassium: { units: Units.milligrams, amount: 0 },
                phosphorus: { units: Units.milligrams, amount: 0 },
                magnesium: { units: Units.milligrams, amount: 0 },
            }
        },
        {
            name: "Medi Inner Balance",
            servingSize: { units: Units.tablet, amount: 2 },
            nutrition: {
                calories: { units: Units.Calories, amount: 0 },
                fat: { units: Units.grams, amount: 0 },
                saturatedFat: { units: Units.grams, amount: 0 },
                transFat: { units: Units.grams, amount: 0 },
                cholesterol: { units: Units.milligrams, amount: 0 },
                sodium: { units: Units.milligrams, amount: 0 },
                dietaryFiber: { units: Units.grams, amount: 0 },
                carbohydrates: { units: Units.grams, amount: 0 },
                sugar: { units: Units.grams, amount: 0 },
                sugarAlcohol: { units: Units.grams, amount: 0 },
                protein: { units: Units.grams, amount: 0 },
                vitaminD: { units: Units.milligrams, amount: 0 },
                calcium: { units: Units.milligrams, amount: 0 },
                iron: { units: Units.milligrams, amount: 0 },
                potassium: { units: Units.milligrams, amount: 0 },
                phosphorus: { units: Units.milligrams, amount: 0 },
                magnesium: { units: Units.milligrams, amount: 15 },
            }
        },
        {
            name: "Medi Vita Super",
            servingSize: { units: Units.tablet, amount: 1 },
            nutrition: {
                calories: { units: Units.Calories, amount: 0 },
                fat: { units: Units.grams, amount: 0 },
                saturatedFat: { units: Units.grams, amount: 0 },
                transFat: { units: Units.grams, amount: 0 },
                cholesterol: { units: Units.milligrams, amount: 0 },
                sodium: { units: Units.milligrams, amount: 0 },
                dietaryFiber: { units: Units.grams, amount: 0 },
                carbohydrates: { units: Units.grams, amount: 0 },
                sugar: { units: Units.grams, amount: 0 },
                sugarAlcohol: { units: Units.grams, amount: 0 },
                protein: { units: Units.grams, amount: 0 },
                vitaminA: { units: Units.milligrams, amount: 1500 },
                vitaminB1: { units: Units.milligrams, amount: 20 },
                vitaminB2: { units: Units.milligrams, amount: 0 },
                vitaminB6: { units: Units.milligrams, amount: 25 },
                vitaminB12: { units: Units.milligrams, amount: 75 },
                vitaminC: { units: Units.milligrams, amount: 150 },
                vitaminD: { units: Units.milligrams, amount: 10 },
                vitaminE: { units: Units.milligrams, amount: 18 },
                calcium: { units: Units.milligrams, amount: 45 },
                iron: { units: Units.milligrams, amount: 5.8 },
                potassium: { units: Units.milligrams, amount: 99 },
                phosphorus: { units: Units.milligrams, amount: 36 },
                magnesium: { units: Units.milligrams, amount: 100 },
            }
        },
        {
            name: "Medi Enteric-Coated Omega 3",
            servingSize: { units: Units.softGel, amount: 1 },
            nutrition: {
                calories: { units: Units.Calories, amount: 10 },
                fat: { units: Units.grams, amount: 1 },
                saturatedFat: { units: Units.grams, amount: 0 },
                transFat: { units: Units.grams, amount: 0 },
                cholesterol: { units: Units.milligrams, amount: 0 },
                sodium: { units: Units.milligrams, amount: 0 },
                dietaryFiber: { units: Units.grams, amount: 0 },
                carbohydrates: { units: Units.grams, amount: 0 },
                sugar: { units: Units.grams, amount: 0 },
                sugarAlcohol: { units: Units.grams, amount: 0 },
                protein: { units: Units.grams, amount: 0 },
                vitaminA: { units: Units.milligrams, amount: 0 },
                vitaminB1: { units: Units.milligrams, amount: 0 },
                vitaminB2: { units: Units.milligrams, amount: 0 },
                vitaminB6: { units: Units.milligrams, amount: 0 },
                vitaminB12: { units: Units.milligrams, amount: 0 },
                vitaminC: { units: Units.milligrams, amount: 0 },
                vitaminD: { units: Units.milligrams, amount: 0 },
                vitaminE: { units: Units.milligrams, amount: 0 },
                calcium: { units: Units.milligrams, amount: 0 },
                iron: { units: Units.milligrams, amount: 0 },
                potassium: { units: Units.milligrams, amount: 0 },
                phosphorus: { units: Units.milligrams, amount: 0 },
                magnesium: { units: Units.milligrams, amount: 0 },
            }
        },
    ];

    let getDishIngredient = (i: IIngredient, servings: number): IDishIngredient => {
        let data = i as IDishIngredient;
        data.servings = servings;
        return data;
    };
    let InitialDishes: IDish[] = [
        {
            name: "Morning Vitamins",
            ingredients: [
                getDishIngredient(InitialIngredients[5], 1),
                getDishIngredient(InitialIngredients[1], 1),
                getDishIngredient(InitialIngredients[3], .5),
                getDishIngredient(InitialIngredients[4], 1),
            ]
        },
        {
            name: "Lunch Vitamins",
            ingredients: [
                getDishIngredient(InitialIngredients[5], 1),
                getDishIngredient(InitialIngredients[1], 1),
                getDishIngredient(InitialIngredients[2], .5),
            ]
        },
        {
            name: "Dinner Vitamins",
            ingredients: [
                getDishIngredient(InitialIngredients[5], 1),
                getDishIngredient(InitialIngredients[2], .5),
                getDishIngredient(InitialIngredients[3], .5),
            ]
        },
        {
            name: "Bar Snack",
            ingredients: [
                getDishIngredient(InitialIngredients[0], .5),
            ]
        },
    ];

    // #endregion

    //  #region Controls

    let WidgetConstructor = function <WidgetOptions, Widget extends Object>
        (groupData: string, defaults: WidgetOptions, constructor: (e: HTMLElement, o?: WidgetOptions) => Widget):
        (options?: WidgetOptions) => JQuery<HTMLElement> {

        return function (this: JQuery, option?: WidgetOptions) {
            //console.log(this);
            return this.each(function () {
                try {
                    let $this = $(this),
                        data = $this.data(groupData),
                        options = $.extend({}, defaults, data, typeof option == 'object' && option);
                    $this.data(groupData, (data = constructor(this, options)));
                } catch (ex) {
                    console.error("WidgetConstructor", ex);
                }
            });
        }
    }

    // #region MeasureField

    export interface IMeasureField {
        readonly: boolean;
        id: string;
        label: string;
        measure: ComponentMeasure;
        units: string[];
        onChange?: (val: ComponentMeasure) => void;
    }

    export interface IMeasureFieldContext {
        readonly: boolean;
        id: string;
        label: string;
        amount: string;
        units: string;
        options: {
            value: string;
            label: string;
        }[];
    }

    export class MeasureField {
        static CLASS: string = "";
        static DEFAULTS: IMeasureField = {
            readonly: false,
            id: null,
            label: null,
            measure: new ComponentMeasure(),
            units: [],
        };
        static GROUP_DATA: string = 'measureField';

        controlTemplate: (context: IMeasureFieldContext) => string;
        constructor(private element: HTMLElement, private options?: IMeasureField) {
            console.log("MeasureField");
            try {
                let self = this,
                    $this = $(element).addClass("field measure");

                self.controlTemplate = kendo.template($('#field-measure-template').html());

                let o = [];
                options.units.forEach(u => o.push({ label: u, value: u, selected: (u == options.measure.units) ? 'selected' : '' }));
                $this.empty().append(self.controlTemplate({
                    readonly: options.readonly,
                    id: options.id,
                    label: options.label,
                    amount: options.measure.amount as any,
                    units: options.measure.units,
                    options: o
                }));

                $this
                    .off()
                    .on('change', `[name='${self.id}_value']`, function (e) {
                        self.measure.amount = Number.parseFloat($(this).val() as string) || 0;

                        if (!!self.options.onChange)
                            self.options.onChange(self.measure);
                    })
                    .on('change', `[name='${self.id}_unit']`, function (e) {
                        self.measure.units = $(this).val() as string || "";

                        if (!!self.options.onChange)
                            self.options.onChange(self.measure);
                    })
                    ;
            } catch (ex) {
                console.error("MeasureField", ex);
            }
        }

        get id(): string { return this.options.id; }
        get label(): string { return this.options.label; }
        get units(): string[] { return this.options.units; }
        get measure(): ComponentMeasure { return this.options.measure; }
        set measure(val: ComponentMeasure) { this.options.measure = val; }
    }



    $.fn.journalMeasureField = WidgetConstructor(
        MeasureField.GROUP_DATA,
        MeasureField.DEFAULTS,
        (e, o) => new MeasureField(e, o));

    // #endregion

    // #region StringField

    export interface IStringField {
        readonly: boolean;
        id: string;
        label: string;
        value: string;
        onChange?: (val: string) => void;
    }

    export class StringField {
        static CLASS: string = "";
        static DEFAULTS: IStringField = {
            readonly: false,
            id: null,
            label: null,
            value: null,
        };
        static GROUP_DATA: string = 'stringField';

        controlTemplate: (context: IStringField) => string;
        constructor(private element: HTMLElement, private options?: IStringField) {
            console.log("StringField");
            try {
                let self = this,
                    $this = $(element).addClass("field stringinput");

                self.controlTemplate = kendo.template($('#field-stringinput-template').html());
                $this.empty().append(self.controlTemplate({
                    readonly: options.readonly,
                    id: options.id,
                    label: options.label,
                    value: options.value
                }));

                $this
                    .off()
                    .on('change', `[name='${self.id}_value']`, function (e) {
                        self.value = $(this).val() as string;
                        if (!!self.options.onChange)
                            self.options.onChange(self.value);
                    })
                    ;
            } catch (ex) {
                console.error("StringField", ex);
            }
        }

        get id(): string { return this.options.id; }
        get label(): string { return this.options.label; }
        get value(): string { return this.options.value; }
        set value(val: string) { this.options.value = val; $(this.element).val(val); }
    }


    $.fn.journalStringField = WidgetConstructor(
        StringField.GROUP_DATA,
        StringField.DEFAULTS,
        (e, o) => new StringField(e, o));

    // #endregion
    // #region NumberField

    export interface INumberField {
        readonly: boolean;
        id: string;
        label: string;
        value: number;
        onChange?: (val: number) => void;
    }

    export class NumberField {
        static CLASS: string = "";
        static DEFAULTS: INumberField = {
            readonly: false,
            id: null,
            label: null,
            value: null,
        };
        static GROUP_DATA: string = 'stringField';

        controlTemplate: (context: INumberField) => string;
        constructor(private element: HTMLElement, private options?: INumberField) {
            console.log("NumberField");
            try {
                let self = this,
                    $this = $(element).addClass("field numericalinput");

                self.controlTemplate = kendo.template($('#field-numericalinput-template').html());
                $this.empty().append(self.controlTemplate({
                    readonly: options.readonly,
                    id: options.id,
                    label: options.label,
                    value: options.value
                }));

                $this
                    .off()
                    .on('change', `[name='${self.id}_value']`, function (e) {
                        self.value = parseFloat($(this).val() as string);
                        if (!!self.options.onChange)
                            self.options.onChange(self.value);
                    })
                    ;
            } catch (ex) {
                console.error("NumberField", ex);
            }
        }

        get id(): string { return this.options.id; }
        get label(): string { return this.options.label; }
        get value(): number { return this.options.value; }
        set value(val: number) { this.options.value = val; $(this.element).val(val); }
    }


    $.fn.journalNumberField = WidgetConstructor(
        NumberField.GROUP_DATA,
        NumberField.DEFAULTS,
        (e, o) => new NumberField(e, o));

    // #endregion
    // #region SelectField

    export interface ISelectField {
        id: string;
        label: string;
        value: string;
        options: string[];
        onChange?: (val: string) => void;
    }

    export class SelectField {
        static CLASS: string = "";
        static DEFAULTS: ISelectField = {
            id: null,
            label: null,
            value: null,
            options: [],
        };
        static GROUP_DATA: string = 'selectField';

        controlTemplate: (context: ISelectField) => string;
        constructor(private element: HTMLElement, private options?: ISelectField) {
            console.log("SelectField");
            try {
                let self = this,
                    $this = $(element).addClass("field selectinput");

                self.controlTemplate = kendo.template($('#field-selectinput-template').html());
                $this.empty().append(self.controlTemplate(options));

                $this
                    .off()
                    .on('change', `[name=${self.id}_value']`, function (e) {
                        self.value = $(this).val() as string;
                        if (!!self.options.onChange)
                            self.options.onChange(self.value);
                    })
                    ;
            } catch (ex) {
                console.error("SelectField", ex);
            }
        }

        get id(): string { return this.options.id; }
        get label(): string { return this.options.label; }
        get listOptions(): string[] { return this.options.options; }
        get value(): string { return this.options.value; }
        set value(val: string) { this.options.value = val; $(this.element).val(val); }
    }


    $.fn.journalSelectField = WidgetConstructor(
        SelectField.GROUP_DATA,
        SelectField.DEFAULTS,
        (e, o) => new SelectField(e, o));

    // #endregion

    // #region IngredientControl

    export interface IIngredientControl {
        readonly: boolean;
        dependantControl: boolean;
        id: string;
        ingredient: Ingredient;
        units: string[];
        onChange?: (val: IngredientControl) => void;
        onSave?: (val: IngredientControl) => void;
        onRemove?: (val: IngredientControl) => void;
    }

    export class IngredientControl {
        static CLASS: string = "";
        static DEFAULTS: IIngredientControl = {
            readonly: false,
            dependantControl: false,
            id: null,
            ingredient: new Ingredient(),
            units: [],
        };
        static GROUP_DATA: string = 'ingredientControl';

        controlTemplate: (context: IIngredientControl) => string;
        constructor(private element: HTMLElement, private options?: IIngredientControl) {
            console.log("IngredientControl");
            try {
                let self = this,
                    $this = $(element).addClass("form-group ingredient");

                self.controlTemplate = kendo.template($('#ingredient-template').html());
                $this.empty().append(self.controlTemplate(options));

                let servingSizeId = `${self.id}_servingsize`,
                    nameId = `${self.id}_name`,
                    nutritionId = `${self.id}_nutrition`,
                    saveBtnId = `${self.id}_save_btn`,
                    removeBtnId = `${self.id}_remove_btn`;

                $(`#${servingSizeId}`, $this)
                    .journalMeasureField({
                        readonly: options.readonly,
                        id: servingSizeId,
                        measure: options.ingredient.servingSize,
                        units: options.units,
                        label: 'Serving Size:',
                        onChange: (servingSize) => {
                            //options.ingredient.servingSize = servingSize;
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                $(`#${nameId}`, $this)
                    .journalStringField({
                        readonly: options.readonly,
                        id: nameId,
                        label: 'Name:',
                        value: options.ingredient.name,
                        onChange: (name) => {
                            options.ingredient.name = name;
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                $(`#${nutritionId}`, $this)
                    .journalNutritionControl({
                        readonly: options.readonly,
                        id: nutritionId,
                        nutrition: options.ingredient.nutrition,
                        units: options.units,
                        onChange: (ingredient) => {
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                $this
                    .on('click', `#${saveBtnId}`, function (e) {
                        if (!!self.options.onSave) self.options.onSave(self);
                    })
                    .on('click', `#${removeBtnId}`, function (e) {
                        if (!!self.options.onRemove) self.options.onRemove(self);
                    })
                    ;
            } catch (ex) {
                console.error("IngredientControl", ex);
            }
        }

        get id(): string { return this.options.id; }
        get ingredient(): Ingredient { return this.options.ingredient; }
        set ingredient(val: Ingredient) { this.options.ingredient = val; }
    }


    $.fn.journalIngredientControl = WidgetConstructor(
        IngredientControl.GROUP_DATA,
        IngredientControl.DEFAULTS,
        (e, o) => new IngredientControl(e, o));

    // #endregion

    // #region NutritionControl

    export interface INutritionControl {
        readonly: boolean;
        id: string;
        nutrition: Nutrition;
        units: string[];
        onChange?: (val: Nutrition) => void;
    }

    export class NutritionControl {
        static CLASS: string = "";
        static DEFAULTS: INutritionControl = {
            readonly: false,
            id: null,
            nutrition: new Nutrition(),
            units: [],
        };
        static GROUP_DATA: string = 'nutritionControl';

        controlTemplate: (context: INutritionControl) => string;
        constructor(private element: HTMLElement, private options?: INutritionControl) {
            console.log("NutritionControl");
            try {
                let self = this,
                    $this = $(element).addClass("form-group nutrition");

                self.controlTemplate = kendo.template($('#nutrition-template').html());
                $this.empty().append(self.controlTemplate(options));

                let controls = [
                    { value: self.nutrition.calories, id: `${self.id}_calories`, label: 'Calories:' },
                    { value: self.nutrition.totalFat, id: `${self.id}_totalfat`, label: 'Total Fat:' },
                    { value: self.nutrition.saturatedFat, id: `${self.id}_saturatedfat`, label: 'Saturated Fat:' },
                    { value: self.nutrition.transFat, id: `${self.id}_transfat`, label: 'Trans Fat:' },
                    { value: self.nutrition.cholesterol, id: `${self.id}_cholesterol`, label: 'Cholesterol:' },
                    { value: self.nutrition.sodium, id: `${self.id}_sodium`, label: 'Sodium:' },
                    { value: self.nutrition.totalCarbohydrates, id: `${self.id}_totalcarbohydrates`, label: 'Total Carbohydrates:' },
                    { value: self.nutrition.dietaryFiber, id: `${self.id}_dietaryfiber`, label: 'Dietary Fiber:' },
                    { value: self.nutrition.carbohydrates, id: `${self.id}_carbohydrates`, label: 'Carbohyrates:' },
                    { value: self.nutrition.sugar, id: `${self.id}_sugar`, label: 'Sugar:' },
                    { value: self.nutrition.sugarAlcohol, id: `${self.id}_sugaralcohol`, label: 'Sugar Alchohol:' },
                    { value: self.nutrition.protein, id: `${self.id}_protein`, label: 'Protein:' },
                    { value: self.nutrition.vitaminA, id: `${self.id}_vitamin_a`, label: 'Vitamin A:' },
                    { value: self.nutrition.vitaminB1, id: `${self.id}_vitamin_b1`, label: 'Vitamin B1' },
                    { value: self.nutrition.vitaminB2, id: `${self.id}_vitamin_b2`, label: 'Vitamin B2:' },
                    { value: self.nutrition.vitaminB6, id: `${self.id}_vitamin_b6`, label: 'Vitamin B6:' },
                    { value: self.nutrition.vitaminB12, id: `${self.id}_vitamin_b12`, label: 'Vitamin B12:' },
                    { value: self.nutrition.vitaminC, id: `${self.id}_vitamin_c`, label: 'Vitamin C:' },
                    { value: self.nutrition.vitaminD, id: `${self.id}_vitamin_d`, label: 'Vitamin D:' },
                    { value: self.nutrition.vitaminE, id: `${self.id}_vitamin_e`, label: 'Vitamin E:' },
                    { value: self.nutrition.calcium, id: `${self.id}_calcium`, label: 'Calcium:' },
                    { value: self.nutrition.iron, id: `${self.id}_iron`, label: 'Iron:' },
                    { value: self.nutrition.potassium, id: `${self.id}_potassium`, label: 'Potassium:' },
                    { value: self.nutrition.phosporus, id: `${self.id}_phosporus`, label: 'Phosporus:' },
                    { value: self.nutrition.magnesium, id: `${self.id}_magnesium`, label: 'Magnesium:' },
                ];

                controls.forEach(control => {
                    $(`#${control.id}`, $this)
                        .journalMeasureField({
                            readonly: options.readonly,
                            id: control.id,
                            measure: control.value,
                            units: options.units,
                            label: control.label,
                            onChange: (value) => {
                                control.value = value;
                                if (!!self.options.onChange) {
                                    self.options.onChange(self.nutrition);
                                }
                            }
                        });
                });
            } catch (ex) {
                console.error("NutritionControl", ex);
            }
        }

        get id(): string { return this.options.id; }
        get nutrition(): Nutrition { return this.options.nutrition; }
        set nutrition(val: Nutrition) { this.options.nutrition = val; }
    }


    $.fn.journalNutritionControl = WidgetConstructor(
        NutritionControl.GROUP_DATA,
        NutritionControl.DEFAULTS,
        (e, o) => new NutritionControl(e, o));

    // #endregion

    // #region DishIngredientControl

    export interface IDishIngredientControl {
        readonly: boolean;
        dependantControl: boolean;
        id: string;
        ingredient: DishIngredient;
        units: string[],
        onChange?: (val: DishIngredientControl) => void;
        onSave?: (val: DishIngredientControl) => void;
        onRemove?: (val: DishIngredientControl) => void;
    }

    export class DishIngredientControl {
        static CLASS: string = "";
        static DEFAULTS: IDishIngredientControl = {
            readonly: false,
            dependantControl: false,
            id: null,
            units: [],
            ingredient: new DishIngredient(),
        };
        static GROUP_DATA: string = 'dishIngredientControl';

        controlTemplate: (context: IDishIngredientControl) => string;
        constructor(private element: HTMLElement, private options?: IDishIngredientControl) {
            console.log("DishIngredientControl");
            try {
                let self = this,
                    $this = $(element).addClass("form-group dish-ingredient");

                self.controlTemplate = kendo.template($('#dish-ingredient-template').html());
                $this.empty().append(self.controlTemplate(options));

                let servingsId = `${self.id}_servings`,
                    ingredientId = `${self.id}_ingredient`,
                    nutritionId = `${self.id}_nutrition`,
                    saveBtnId = `${self.id}_save_btn`,
                    removeBtnId = `${self.id}_remove_btn`;

                $(`#${servingsId}`, $this)
                    .journalNumberField({
                        readonly: options.readonly,
                        id: servingsId,
                        value: options.ingredient.servings,
                        label: 'Servings:',
                        onChange: (servings) => {
                            options.ingredient.servings = servings;
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                $(`#${ingredientId}`, $this)
                    .journalIngredientControl({
                        readonly: true,
                        dependantControl: true,
                        id: ingredientId,
                        ingredient: options.ingredient,
                        units: options.units,
                        onChange: (ingredient) => {
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        },
                        onSave: (ingredient) => {

                        }
                    });

                $(`#${nutritionId}`, $this)
                    .journalNutritionControl({
                        readonly: true,
                        id: nutritionId,
                        nutrition: options.ingredient.nutrition,
                        units: options.units,
                        onChange: (ingredient) => {
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });


                $this
                    .on('click', `#${saveBtnId}`, function (e) {
                        if (!!self.options.onSave) self.options.onSave(self);
                    })
                    .on('click', `#${removeBtnId}`, function (e) {
                        if (!!self.options.onRemove) self.options.onRemove(self);
                    })
                    ;
            } catch (ex) {
                console.error("DishIngredientControl", ex);
            }
        }

        get id(): string { return this.options.id; }
        get ingredient(): DishIngredient { return this.options.ingredient; }
        set ingredient(val: DishIngredient) { this.options.ingredient = val; }

    }


    $.fn.journalDishIngredientControl = WidgetConstructor(
        DishIngredientControl.GROUP_DATA,
        DishIngredientControl.DEFAULTS,
        (e, o) => new DishIngredientControl(e, o));

    // #endregion

    // #region DishControl

    export interface IDishControl {
        readonly: boolean;
        id: string;
        dish: Dish;
        ingredients: IIngredient[],
        units: string[];
        onChange?: (val: DishControl) => void;
        onSave?: (val: DishControl) => void;
        onRemove?: (val: DishControl) => void;
    }

    export class DishControl {
        static CLASS: string = "";
        static DEFAULTS: IDishControl = {
            readonly: false,
            id: null,
            ingredients: [],
            units: [],
            dish: new Dish(),
        };
        static GROUP_DATA: string = 'dishControl';

        controlTemplate: (context: IDishControl) => string;
        constructor(private element: HTMLElement, private options?: IDishControl) {
            console.log("DishControl");
            try {
                let self = this,
                    $this = $(element).addClass("form-group dish");

                self.controlTemplate = kendo.template($('#dish-template').html());
                $this.empty().append(self.controlTemplate(options));

                let nameId = `${self.id}_name`,
                    saveBtnId = `${self.id}_save_btn`,
                    removeBtnId = `${self.id}_remove_btn`,
                    addIngredientBtn = `${self.id}_addingredient_btn`;

                $(`#${nameId}`, $this)
                    .journalStringField({
                        readonly: options.readonly,
                        id: nameId,
                        value: options.dish.name,
                        label: 'Name:',
                        onChange: (name) => {
                            options.dish.name = name;
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                self.refreshAddIngredients();
                self.refreshIngredients();
                self.refreshNutrition();


                $this
                    .on('click', `#${saveBtnId}`, function (e) {
                        if (!!self.options.onSave) self.options.onSave(self);
                    })
                    .on('click', `#${removeBtnId}`, function (e) {
                        if (!!self.options.onRemove) self.options.onRemove(self);
                    })
                    .on('click', `#${addIngredientBtn}`, function (e) {
                        self.addIngredient();
                    })
                    ;
            } catch (ex) {
                console.error("DishControl", ex);
            }

        }

        get id(): string { return this.options.id; }
        get ingredients(): DishIngredient[] { return this.options.dish.ingredients; }
        get dish(): Dish { return this.options.dish; }
        set dish(val: Dish) { this.options.dish = val; }

        refreshAddIngredients() {
            let self = this,
                $this = $(this.element),
                addIngredientId = `${self.id}_addingredient`,
                $addIngredient = $(`#${addIngredientId}`, $this);

            $addIngredient.empty();
            self.options.ingredients.forEach((item, i) => {
                $('<option>', { text: item.name, value: item.id })
                    .appendTo($addIngredient);
            });
        }

        refreshIngredients() {
            let self = this,
                $this = $(this.element),
                ingredientsId = `${self.id}_ingredients`,
                $ingredients = $(`#${ingredientsId}`, $this);

            $ingredients.empty();
            self.dish.ingredients.forEach((ingredient, i) => {
                let ingredientId = `${ingredientsId}_${i}`;
                $('<div>', {})
                    .journalDishIngredientControl({
                        readonly: self.options.readonly,
                        dependantControl: !self.options.readonly,
                        id: ingredientId,
                        ingredient: ingredient,
                        units: self.options.units,
                        onChange: (dishIngredient) => {
                            self.refreshNutrition();
                            if (!!self.options.onChange) self.options.onChange(self);
                        },
                        onRemove: (dishIngredient) => {
                            let ingredient = dishIngredient.ingredient,
                                index = self.ingredients.indexOf(ingredient);
                            if (index > -1) {
                                self.dish.ingredients.splice(index, 1);
                                self.refreshNutrition();
                                self.refreshIngredients();
                                if (!!self.options.onChange) self.options.onChange(self);
                            }
                        },
                        onSave: (dishIngredient) => {
                            if (self.ingredients.lastIndexOf(dishIngredient.ingredient) === -1) {
                                self.ingredients.push(dishIngredient.ingredient);
                            }
                        }
                    })
                    .appendTo($ingredients);
            });
        }
        refreshNutrition() {
            let self = this,
                $this = $(this.element),
                nutritionId = `${self.id}_nutrition`,
                $nutrition = $(`#${nutritionId}`, $this),
                $next = $('<div>', { id: nutritionId });

            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.options.dish.getNutrition(),
                units: self.options.units,
            });
        }
        addIngredient() {
            let self = this,
                $this = $(this.element),
                addIngredientId = `${self.id}_addingredient`,
                $addIngredient = $(`#${addIngredientId}`, $this),
                ingredientId = $addIngredient.val(),
                ingredient = self.options.ingredients.find((value) => { return value.id === ingredientId; });

            self.dish.addIngredient(new Ingredient(ingredient));
            self.refreshIngredients();
            self.refreshAddIngredients();
        }
    }


    $.fn.journalDishControl = WidgetConstructor(
        DishControl.GROUP_DATA,
        DishControl.DEFAULTS,
        (e, o) => new DishControl(e, o));

    // #endregion

    // #region JournalItemControl

    export interface IJournalItemControl {
        readonly: boolean;
        dependantControl: boolean;
        id: string;
        journalItem: JournalItem;
        units: string[],
        onChange?: (val: JournalItemControl) => void;
        onSave?: (val: JournalItemControl) => void;
        onRemove?: (val: JournalItemControl) => void;
    }

    export class JournalItemControl {
        static CLASS: string = "";
        static DEFAULTS: IJournalItemControl = {
            readonly: false,
            dependantControl: false,
            id: null,
            units: [],
            journalItem: new JournalItem(),
        };
        static GROUP_DATA: string = 'journalItemControl';

        controlTemplate: (context: IJournalItemControl) => string;
        constructor(private element: HTMLElement, private options?: IJournalItemControl) {
            console.log("JournalItemControl");
            try {
                let self = this,
                    $this = $(element).addClass("form-group journal-item");

                self.controlTemplate = kendo.template($('#journal-item-template').html());
                $this.empty().append(self.controlTemplate(options));

                let nameId = `${self.id}_name`,
                    servingsId = `${self.id}_servings`,
                    saveBtnId = `${self.id}_save_btn`,
                    removeBtnId = `${self.id}_remove_btn`;

                $(`#${nameId}`, $this)
                    .journalStringField({
                        readonly: options.dependantControl ? true : options.readonly,
                        id: nameId,
                        value: options.journalItem.name,
                        label: 'Name:',
                        onChange: (name) => {
                            options.journalItem.name = name;
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                $(`#${servingsId}`, $this)
                    .journalNumberField({
                        readonly: options.readonly,
                        id: servingsId,
                        value: options.journalItem.servings,
                        label: 'Servings:',
                        onChange: (servings) => {
                            options.journalItem.servings = servings;
                            if (!!self.options.onChange) {
                                self.options.onChange(self);
                            }
                        }
                    });

                self.refreshIngredients();
                self.refreshNutrition();

                $this
                    .on('click', `#${saveBtnId}`, function (e) {
                        if (!!self.options.onSave) self.options.onSave(self);
                    })
                    .on('click', `#${removeBtnId}`, function (e) {
                        if (!!self.options.onRemove) self.options.onRemove(self);
                    })
                    ;
            } catch (ex) {
                console.error("JournalItemControl", ex);
            }
        }

        get id(): string { return this.options.id; }

        get ingredients(): DishIngredient[] { return this.options.journalItem.ingredients; }
        get journalItem(): JournalItem { return this.options.journalItem; }
        set journalItem(val: JournalItem) { this.options.journalItem = val; }

        refreshIngredients() {
            let self = this,
                $this = $(this.element),
                ingredientsId = `${self.id}_ingredients`,
                $ingredients = $(`#${ingredientsId}`, $this);

            $ingredients.empty();
            self.journalItem.ingredients.forEach((ingredient, i) => {
                let ingredientId = `${ingredientsId}_${i}`;
                $('<div>', {})
                    .journalDishIngredientControl({
                        readonly: true,
                        dependantControl: false,
                        id: ingredientId,
                        ingredient: ingredient,
                        units: self.options.units,
                        onChange: (dishIngredient) => {
                            self.refreshNutrition();
                            if (!!self.options.onChange) self.options.onChange(self);
                        },
                        onSave: (dishIngredient) => {
                            if (self.ingredients.lastIndexOf(dishIngredient.ingredient) === -1) {
                                self.ingredients.push(dishIngredient.ingredient);
                            }
                        }
                    })
                    .appendTo($ingredients);
            });
        }

        refreshNutrition() {
            let self = this,
                $this = $(this.element),
                nutritionId = `${self.id}_nutrition`,
                $nutrition = $(`#${nutritionId}`, $this),
                $next = $('<div>', { id: nutritionId });

            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.journalItem.getNutrition(),
                units: self.options.units,
            });
        }
    }


    $.fn.journalJournalItemControl = WidgetConstructor(
        JournalItemControl.GROUP_DATA,
        JournalItemControl.DEFAULTS,
        (e, o) => new JournalItemControl(e, o));

    // #endregion

    // #region JournalEntryControl

    export interface IJournalEntryControl {
        readonly: boolean;
        id: string;
        journalEntry: JournalEntry;
        units: string[];
        dishes: IDish[];
        onChange?: (val: JournalEntryControl) => void;
        onSave?: (val: JournalEntryControl) => void;
        onRemove?: (val: JournalEntryControl) => void;
    }

    export class JournalEntryControl {
        static CLASS: string = "";
        static DEFAULTS: IJournalEntryControl = {
            readonly: false,
            id: null,
            units: [],
            dishes: [],
            journalEntry: new JournalEntry(),
        };
        static GROUP_DATA: string = 'journalEntryControl';

        controlTemplate: (context: IJournalEntryControl) => string;
        itemTemplate: (context: IJournalItemControl) => string;

        #dialog: kendo.ui.Dialog;

        constructor(private element: HTMLElement, private options?: IJournalEntryControl) {
            console.log("JournalEntryControl");
            try {
                let self = this,
                    $this = $(element).addClass("form-group journal-entry");

                self.controlTemplate = kendo.template($('#journal-entry-template').html());
                $this.empty().append(self.controlTemplate(options));

                let timestampId = `${self.id}_timestamp`,
                    itemsId = `${self.id}_items`,
                    nutritionId = `${self.id}_nutrition`,
                    saveBtnId = `${self.id}_save_btn`,
                    removeBtnId = `${self.id}_remove_btn`;

                $(`#${timestampId}`, $this)
                    .journalStringField({
                        readonly: true,
                        id: timestampId,
                        value: options.journalEntry.timestamp.toDateString(),
                        label: 'DateTime:',
                    });
                self.refreshAddDishes();
                self.refreshItems();
                self.refreshNutrition();


                $this
                    .on("click", `#${self.id}_add_btn`, function (e) {
                        self.addItem();
                    })
                    .on("click", `#${self.id}_adddish_btn`, function (e) {
                        self.addItem();
                    })
                    .on("click", `.je-edit-item`, function (e) {
                        let $this = $(this),
                            data = $this.data(JournalItemControl.GROUP_DATA) as JournalItemControl;
                        self.editItem(data.journalItem);
                    })
                    .on("click", `.je-remove-item`, function (e) {
                        let $this = $(this),
                            data = $this.data(JournalItemControl.GROUP_DATA) as JournalItemControl;
                        self.removeItem(data.journalItem);
                    })
                    .on("click", `.je-new-item`, function (e) {
                        self.newItem();
                    })
                    .on("click", `.je-import-item`, function (e) {
                        self.importItem();
                    });

                $this
                    .on('click', `#${saveBtnId}`, function (e) {
                        if (!!self.options.onSave) self.options.onSave(self);
                    })
                    .on('click', `#${removeBtnId}`, function (e) {
                        if (!!self.options.onRemove) self.options.onRemove(self);
                    })
                    ;
            } catch (ex) {
                console.error("JournalEntryControl", ex);
            }

        }

        editItem(item: JournalItem) {
            let self = this,
                $this = $(self.element),
                $dialog = $("<div>", {}).appendTo($('body'));

            self.#dialog = $dialog.kendoDialog({
                title: 'Edit Item',
                content: '<div class="dialog-container"></div>',
                closable: true,
                actions: [
                    {
                        action: () => { },
                        text: 'Save'
                    }
                ],
                close: (e) => {
                    $dialog.remove();
                    self.#dialog = null;
                }
            }).data('kendoDialog');

            let $editor = $('.dialog-container', $dialog);
            $editor.journalJournalItemControl({
                id: `${self.id}_itemeditor`,
                journalItem: item,
                units: self.options.units,
                readonly: false,
                dependantControl: true,
                onChange: (v) => { }
            });

            self.#dialog.open();
        }

        removeItem(item: JournalItem) {

        }

        addItem() {
            let self = this,
                $this = $(this.element),
                addDishId = `${self.id}_adddish`,
                $addDish = $(`#${addDishId}`, $this),
                dishId = $addDish.val(),
                dish = self.options.dishes.find((value) => { return value.id === dishId; });

            self.journalEntry.addDish(new Dish(dish));
            self.refreshItems();
            self.refreshNutrition();
            self.refreshAddDishes();
        }

        newItem() {

        }

        importItem() {

        }

        refreshAddDishes() {
            let self = this,
                $this = $(this.element),
                importDishId = `${self.id}_adddish`,
                $importDish = $(`#${importDishId}`, $this);

            $importDish.empty();
            self.options.dishes.forEach((item, i) => {
                $('<option>', { text: item.name, value: item.id })
                    .appendTo($importDish);
            });
        }

        refreshItems() {
            let self = this,
                $this = $(this.element),
                itemsId = `${self.id}_items`,
                $items = $(`#${itemsId}`, $this);

            $items.empty();
            self.journalEntry.items.forEach((item, i) => {
                let itemId = `${itemsId}_${i}`;
                $('<div>', {})
                    .journalJournalItemControl({
                        readonly: false,
                        dependantControl: true,
                        id: itemId,
                        journalItem: item,
                        units: self.options.units,
                        onChange: (journalItem) => {
                            self.refreshNutrition();
                            if (!!self.options.onChange) self.options.onChange(self);
                        },
                        onRemove: (journalItem) => {
                            let item = journalItem.journalItem,
                                index = self.journalEntry.items.indexOf(item);
                            if (index > -1) {
                                self.journalEntry.items.splice(index, 1);
                                self.refreshNutrition();
                                self.refreshItems();
                                if (!!self.options.onChange) self.options.onChange(self);
                            }
                        },
                        onSave: (journalItem) => {
                            if (!!self.options.onSave) self.options.onSave(self);
                        }
                    })
                    .appendTo($items);
            });
        }

        refreshNutrition() {
            let self = this,
                $this = $(this.element),
                nutritionId = `${self.id}_nutrition`,
                $nutrition = $(`#${nutritionId}`, $this),
                $next = $('<div>', { id: nutritionId });

            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.journalEntry.getNutrition(),
                units: self.options.units,
            });
        }

        get id(): string { return this.options.id; }
        get items(): JournalItem[] { return this.options.journalEntry.items; }
        get journalEntry(): JournalEntry { return this.options.journalEntry; }
        set journalEntry(val: JournalEntry) { this.options.journalEntry = val; }


    }


    $.fn.journalJournalEntryControl = WidgetConstructor(
        JournalEntryControl.GROUP_DATA,
        JournalEntryControl.DEFAULTS,
        (e, o) => new JournalEntryControl(e, o));

    // #endregion

    // #region JournalReportControl

    export interface IJournalReportControl {
        id: string;
        allJournalEntries: JournalEntry[],

        units: string[],
        startDate: Date,
        endDate: Date,
        ingredients: DishIngredient[],
        nutrition: Nutrition,
        onChange?: (val: Dish) => void;
    }
    export interface IJournalReportControlItemContext {
        id: string;
        name: string;
        amount: number;
        units: string;
    }
    export class JournalReportControl {
        static CLASS: string = "";
        static DEFAULTS: IJournalReportControl = {
            id: null,
            allJournalEntries: [],
            units: [],
            startDate: new Date(),
            endDate: new Date(),
            ingredients: [],
            nutrition: new Nutrition()
        };
        static GROUP_DATA: string = 'journalReportControl';

        controlTemplate: (context: IJournalReportControl) => string;
        itemTemplate: (context: IJournalReportControlItemContext) => string;

        constructor(private element: HTMLElement, private options?: IJournalReportControl) {
            console.log("JournalReportControl");
            try {
                let self = this,
                    $this = $(this.element).addClass("form-group journal-report");

                self.controlTemplate = kendo.template($('#journal-report-template').html());
                self.itemTemplate = kendo.template($('#ingredients-summary-item-template').html());

                $this.empty().append(self.controlTemplate(options));

                let dateRangeId = `${self.id}_daterange`;
                let dateRange = $(`#${dateRangeId}`, $this);

                dateRange
                    .kendoDateRangePicker({
                        range: { start: self.options.startDate, end: self.options.endDate },
                        labels: true,
                        change: (e) => {
                            let range = (e.sender as kendo.ui.DateRangePicker).range();
                            self.startDate = range.start;
                            self.endDate = range.end;
                            self.refreshIngredients();
                            self.refreshNutrition();
                        }
                    });

                self.refreshIngredients();
                self.refreshNutrition();
            } catch (ex) {
                console.error("JournalReportControl", ex);
            }
        }

        refreshIngredients() {
            let self = this,
                $this = $(this.element),
                ingredientsId = `${self.id}_ingredients`,
                $ingredients = $(`#${ingredientsId}`, $this),
                journalRange = JournalEntry.getRange(self.options.allJournalEntries, self.startDate, self.endDate);
            self.ingredients = JournalEntry.getIngredients(journalRange);
            self.#journalRange = journalRange;

            let amounts = DishIngredient.getAmounts(self.ingredients);
            $ingredients.empty();
            amounts.forEach((item, i) => {
                let itemId = `${ingredientsId}_${i}`;
                $(self.itemTemplate({
                    id: itemId,
                    name: item.name,
                    amount: item.amount,
                    units: item.units
                }))
                    .appendTo($ingredients);
            });
        }

        refreshNutrition() {
            let self = this,
                $this = $(this.element),
                nutritionId = `${self.id}_nutrition`,
                $nutrition = $(`#${nutritionId}`, $this),
                $next = $('<div>', { id: nutritionId });

            self.nutrition = JournalEntry.getNutrition(this.#journalRange);

            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.nutrition,
                units: self.units,
            });
        }
        get id(): string { return this.options.id; }
        get units(): string[] { return this.options.units; }
        get allEntries(): JournalEntry[] { return this.options.allJournalEntries; }

        #journalRange: JournalEntry[] = [];

        get ingredients(): DishIngredient[] { return this.options.ingredients; }
        set ingredients(val: DishIngredient[]) { this.options.ingredients = val; }

        get nutrition(): Nutrition { return this.options.nutrition; }
        set nutrition(val: Nutrition) { this.options.nutrition = val; }

        get startDate(): Date { return this.options.startDate; }
        set startDate(val: Date) { this.options.startDate = val; }

        get endDate(): Date { return this.options.endDate; }
        set endDate(val: Date) { this.options.endDate = val; }

    }


    $.fn.journalJournalReportControl = WidgetConstructor(
        JournalReportControl.GROUP_DATA,
        JournalReportControl.DEFAULTS,
        (e, o) => new JournalReportControl(e, o));
    // #endregion



    //#endregion

    // #region Application

    export class Application {
        //ingredients: Ingredient[] = [];
        //journalEntries: JournalEntry[] = [];
        //dishes: Dish[] = [];
        //units: string[] = [];

        #db: JournalDatabase;
        constructor(configuration?) {
            try {
                let self = this;

                self.journalEntriesTemplate = kendo.template($('#journal-entries-template').html());
                self.dishesTemplate = kendo.template($('#dishes-template').html());
                self.ingredientsTemplate = kendo.template($('#ingredients-template').html());

                //this.getIngredients();
                //this.getDishes();
                //this.getJournal();

                //this.units = Object.keys(Units);
                //this.journalEntries.push(
                //    new JournalEntry({
                //        items: [
                //            InitialMeals[0]
                //        ]
                //    })
                //);
                //this.journalEntries.push(
                //    new JournalEntry({
                //        items: [
                //            InitialMeals[3]
                //        ]
                //    })
                //);

                window.onhashchange = () => self.processHashLocation();

                self.#db = new JournalDatabase();
                self.#db.initialize()
                    .then(() => {
                        self.processHashLocation();
                    });

            } catch (ex) {
                console.error("Application", ex);
            }
        }

        processHashLocation() {
            let self = this;
            let hash = (window.location.hash || "").split('!');
            switch (hash[0]) {
                case '#export':
                    self.exportData();
                    window.location.hash = null;
                    break;
                case '#entries':
                    self.displayJournalEntries();
                    break;
                case '#entry':
                    self.displayJournalEntry(hash[1]);
                    break;
                case '#dishes':
                    self.displayDishes();
                    break;
                case '#dish':
                    self.displayDish(hash[1]);
                    break;
                case '#ingredients':
                    self.displayIngredients();
                    break;
                case '#ingredient':
                    self.displayIngredient(hash[1]);
                    break;
                default:
                    self.displayJournalReport();
                    break;
            }
        }

        async getUnits(): Promise<string[]> {
            let result: string[] = [],
                data: IUnit[] = (await this.#db.units.getAll()) || [];
            data.forEach(d => result.push(d.measure));
            return result;
        }

        async getIngredients(): Promise<Ingredient[]> {
            let result: Ingredient[] = [],
                data: IIngredient[] = (await this.#db.ingredients.getAll()) || [];
            data.forEach(d => result.push(new Ingredient(d)));
            return result;
        }

        async getDishes(): Promise<Dish[]> {
            let result: Dish[] = [],
                data: IDish[] = (await this.#db.dishes.getAll()) || [];
            data.forEach(d => result.push(new Dish(d)));
            return result;
        }

        async getJournals(): Promise<JournalEntry[]> {
            let result: JournalEntry[] = [],
                data: IJournalEntry[] = (await this.#db.journalEntries.getAll()) || [];
            for (let i = 0; i < data.length; i++) {
                let entry = data[i];
                for (let d = 0; d < entry.items.length; d++) {
                    let item = entry.items[d];
                    let dish = await this.#db.dishes.get(item.id.toString());
                    merge(item, dish);
                }
                result.push(new JournalEntry(entry));
            };
            return result;
        }

        journalEntriesTemplate: (data: { entries: JournalEntry[] }) => string;
        dishesTemplate: (data: { dishes: Dish[] }) => string;
        ingredientsTemplate: (data: { ingredients: Ingredient[] }) => string;

        // #region Views
        get $display(): JQuery { return $('#display'); }

        journalReport: JournalReportControl = null;
        dish: DishControl = null;
        entry: JournalEntryControl = null;
        ingredient: IngredientControl = null;

        async displayJournalReport() {
            let self = this;
            console.log("displayJournalReport");
            try {
                self.$display.empty();
                self.journalReport = $('<div>', { id: 'journalreport' })
                    .appendTo(self.$display)
                    .journalJournalReportControl({
                        allJournalEntries: await self.getJournals(),
                        units: await self.getUnits(),
                        ingredients: [],
                        nutrition: new Nutrition(),
                        startDate: new Date('1/1/2021'),
                        endDate: new Date(),
                        id: 'journalreport'
                    })
                    .data(JournalReportControl.GROUP_DATA);
            } catch (ex) {
                console.error("displayJournalReport", ex);
            }
        }
        async displayJournalEntries() {
            let self = this;
            console.log("displayJournalEntries");
            try {
                self.$display.empty();
                $(self.journalEntriesTemplate({ entries: await self.getJournals() }))
                    .appendTo(self.$display);
            } catch (ex) {
                console.error("displayJournalEntries", ex);
            }
        }
        async displayJournalEntry(key?: string) {
            let self = this,
                id = 'journalEntry';
            console.log("displayJournalEntry");
            try {
                self.$display.empty();
                self.entry = $('<div>', { id: id })
                    .appendTo(self.$display)
                    .journalJournalEntryControl({
                        journalEntry: key ? await JournalEntry.Find(self.#db, key as any) : new JournalEntry(),
                        dishes: await self.getDishes(),
                        units: await self.getUnits(),
                        readonly: false,
                        id: id,
                        onSave: async (entry) => {
                            let i = await self.#db.journalEntries.save(entry.journalEntry.serialize());
                            window.location.hash = `entry!${i}`;
                        },
                        onRemove: async (entry) => {
                            await self.#db.journalEntries.delete(entry.journalEntry.id);
                            window.location.hash = `entries`;
                        }
                    })
                    .data(JournalEntryControl.GROUP_DATA);
            } catch (ex) {
                console.error("displayJournalEntry", ex);
            }
        }
        async displayDishes() {
            let self = this;
            console.log("displayDishes");
            try {
                self.$display.empty();
                $(self.dishesTemplate({ dishes: await self.getDishes() }))
                    .appendTo(self.$display);
            } catch (ex) {
                console.error("displayDishes", ex);
            }
        }
        async displayDish(key?: string) {
            let self = this,
                id = 'journalDish';
            console.log("displayDish");
            try {
                self.$display.empty();
                self.entry = $('<div>', { id: id })
                    .appendTo(self.$display)
                    .journalDishControl({
                        dish: key ? await Dish.Find(self.#db, key as any) : new Dish(),
                        readonly: false,
                        ingredients: await self.getIngredients(),
                        units: await self.getUnits(),
                        id: id,
                        onSave: async (entry) => {
                            let i = await self.#db.dishes.save(entry.dish.serialize());
                            window.location.hash = `dish!${i}`;
                        },
                        onRemove: async (entry) => {
                            await self.#db.dishes.delete(entry.dish.id);
                            window.location.hash = `dishes`;
                        }
                    })
                    .data(JournalEntryControl.GROUP_DATA);
            } catch (ex) {
                console.error("displayDish", ex);
            }
        }
        async displayIngredients() {
            let self = this;
            console.log("displayIngredients");
            try {
                self.$display.empty();
                $(self.ingredientsTemplate({ ingredients: await self.getIngredients() }))
                    .appendTo(self.$display);
            } catch (ex) {
                console.error("displayIngredients", ex);
            }
        }
        async displayIngredient(key?: string) {
            let self = this,
                id = 'journalIngredient';
            console.log("displayIngredient");
            try {
                self.$display.empty();
                self.entry = $('<div>', { id: id })
                    .appendTo(self.$display)
                    .journalIngredientControl({
                        ingredient: key ? await Ingredient.Find(self.#db, key as any) : new Ingredient(),
                        units: await self.getUnits(),
                        readonly: false,
                        dependantControl: false,
                        id: id,
                        onSave: async (entry) => {
                            let i = await self.#db.ingredients.save(entry.ingredient.serialize());
                            window.location.hash = `ingredient!${i}`;
                        },
                        onRemove: async (entry) => {
                            await self.#db.ingredients.delete(entry.ingredient.id);
                            window.location.hash = "ingredients";
                        }
                    })
                    .data(IngredientControl.GROUP_DATA);
            } catch (ex) {
                console.error("displayIngredient", ex);
            }
        }

        async exportData() {
            let self = this;
            let data = {
                units: await self.#db.units.getAll(),
                ingredients: await self.#db.ingredients.getAll(),
                dishes: await self.#db.dishes.getAll(),
                journalEntries: await self.#db.journalEntries.getAll()
            };

            //this.copyToClipboard(JSON.stringify(data));
            let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "JournalData.json";
            link.click();
            //$.post('export', data, (r) => {

            //})
        }

        copyToClipboard(str: string) {
            // Create new element
            var el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = str;
            // Set non-editable to avoid focus and move outside of view
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.setAttribute('readonly', '');
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
        }
        // #endregion
    }


    // #endregion

    // #region Startup



    //window.widget = WidgetConstructor;
    window.foodJournal = new Application();
    const s = $("<div>");
    const fd = window.foodJournal;
    // #endregion
}

declare global {
    interface JQuery {
        journalMeasureField(options?: FoodJournal.IMeasureField): JQuery;
        journalNumberField(options?: FoodJournal.INumberField): JQuery;
        journalStringField(options?: FoodJournal.IStringField): JQuery;
        journalSelectField(options?: FoodJournal.ISelectField): JQuery;
        journalIngredientControl(options?: FoodJournal.IIngredientControl): JQuery;
        journalNutritionControl(options?: FoodJournal.INutritionControl): JQuery;
        journalDishIngredientControl(options?: FoodJournal.IDishIngredientControl): JQuery;
        journalDishControl(options?: FoodJournal.IDishControl): JQuery;
        journalJournalItemControl(options?: FoodJournal.IJournalItemControl): JQuery;
        journalJournalEntryControl(options?: FoodJournal.IJournalEntryControl): JQuery;
        journalJournalReportControl(options?: FoodJournal.IJournalReportControl): JQuery;
    }
}

declare global {
    interface Window {
        foodJournal: FoodJournal.Application;
        widget: any;
        uuid: {
            v4: () => string;
        }
    }
}

function merge(target: any = {}, ...items: any[]): any {
    target = target || {};
    if (items) items.forEach((i) => Object.keys(i).forEach((k) => target[k] = i[k]));
}