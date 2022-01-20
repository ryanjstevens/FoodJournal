"use strict";
//import * as $ from 'jquery';
//module FoodJournal {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodJournal = void 0;
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
var FoodJournal;
(function (FoodJournal) {
    var _JournalDatabase_instances, _JournalDatabase_IndxDb, _JournalDatabase_initTables, _JournalTable_db, _JournalTable_name, _JournalTable_keyIndex, _JournalTable_indexes, _ComponentMeasure_amount, _ComponentMeasure_units, _Nutrition_calories, _Nutrition_fat, _Nutrition_saturatedFat, _Nutrition_transFat, _Nutrition_cholesterol, _Nutrition_sodium, _Nutrition_dietaryFiber, _Nutrition_sugar, _Nutrition_carbohydrates, _Nutrition_sugarAlcohol, _Nutrition_protein, _Nutrition_vitaminA, _Nutrition_vitaminB1, _Nutrition_vitaminB2, _Nutrition_vitaminB6, _Nutrition_vitaminB12, _Nutrition_vitaminC, _Nutrition_vitaminD, _Nutrition_vitaminE, _Nutrition_calcium, _Nutrition_iron, _Nutrition_potassium, _Nutrition_phosporus, _Nutrition_magnesium, _Ingredient_name, _Ingredient_nutrition, _Ingredient_servingSize, _DishIngredient_servings, _Dish_name, _Dish_ingredients, _JournalItem_servings, _JournalEntry_timestamp, _JournalEntry_items, _JournalEntryControl_dialog, _JournalReportControl_journalRange, _Application_db;
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
    };
    class JournalDatabase {
        constructor() {
            _JournalDatabase_instances.add(this);
            this.name = "JournalDatabase";
            this.version = 1;
            _JournalDatabase_IndxDb.set(this, void 0);
            __classPrivateFieldSet(this, _JournalDatabase_IndxDb, window.indexedDB, "f");
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                console.log(`Database.init - ${name}`);
                let upgrading = false;
                return new Promise((resolve, reject) => {
                    let self = this, request = __classPrivateFieldGet(self, _JournalDatabase_IndxDb, "f").open(self.name, self.version);
                    request.onerror = (e) => {
                        console.log(`Database.error - ${name}`, e);
                        reject("Failed to Open.");
                    };
                    request.onupgradeneeded = (e) => __awaiter(this, void 0, void 0, function* () {
                        //console.log(`Database.init.upgrading - ${name}`, e);
                        yield __classPrivateFieldGet(self, _JournalDatabase_instances, "m", _JournalDatabase_initTables).call(self, request.result);
                        yield Promise.race([
                            self.units.upgrade(e.newVersion, e.oldVersion),
                            self.ingredients.upgrade(e.newVersion, e.oldVersion),
                            self.dishes.upgrade(e.newVersion, e.oldVersion),
                            self.journalEntries.upgrade(e.newVersion, e.oldVersion),
                        ]);
                        yield self.importDefaults();
                    });
                    request.onsuccess = (e) => __awaiter(this, void 0, void 0, function* () {
                        //console.log(`Database.success - ${name}`, e);
                        yield __classPrivateFieldGet(self, _JournalDatabase_instances, "m", _JournalDatabase_initTables).call(self, request.result);
                        resolve(self);
                    });
                });
            });
        }
        importDefaults() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                console.log(`Database.importDefaults - ${name}`);
                // Inject default data
                Object.keys(Units).forEach((k) => __awaiter(this, void 0, void 0, function* () { return yield self.units.save({ measure: k }); }));
                InitialIngredients.forEach((k) => __awaiter(this, void 0, void 0, function* () { return yield self.ingredients.save(k); }));
                InitialDishes.forEach((k) => __awaiter(this, void 0, void 0, function* () { return yield self.dishes.save(k); }));
                return true;
            });
        }
    }
    _JournalDatabase_IndxDb = new WeakMap(), _JournalDatabase_instances = new WeakSet(), _JournalDatabase_initTables = function _JournalDatabase_initTables(db) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            //console.log(`Database.initTables - ${name}`);
            self.units = self.units ||
                (yield new JournalTable(db, {
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
                }));
            self.ingredients = self.ingredients ||
                (yield new JournalTable(db, {
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
                }));
            self.dishes = self.dishes ||
                (yield new JournalTable(db, {
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
                }));
            self.journalEntries = self.journalEntries ||
                (yield new JournalTable(db, {
                    name: "JournalEntries",
                    keyIndex: {
                        name: "id",
                        field: "id",
                        unique: true,
                        autoIncrement: false
                    },
                    indexes: []
                }));
            return true;
        });
    };
    FoodJournal.JournalDatabase = JournalDatabase;
    class JournalTable {
        constructor(db, configuration) {
            _JournalTable_db.set(this, void 0);
            _JournalTable_name.set(this, void 0);
            _JournalTable_keyIndex.set(this, void 0);
            _JournalTable_indexes.set(this, void 0);
            let self = this;
            console.log(`Table.init - ${name}`);
            __classPrivateFieldSet(self, _JournalTable_db, db, "f");
            __classPrivateFieldSet(self, _JournalTable_name, configuration.name, "f");
            __classPrivateFieldSet(self, _JournalTable_keyIndex, configuration.keyIndex, "f");
            __classPrivateFieldSet(self, _JournalTable_indexes, configuration.indexes || [], "f");
        }
        upgrade(newVersion, oldVersion) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                return new Promise((resolve, reject) => {
                    if (!__classPrivateFieldGet(self, _JournalTable_db, "f").objectStoreNames.contains(__classPrivateFieldGet(self, _JournalTable_name, "f"))) {
                        let options = { keypath: __classPrivateFieldGet(self, _JournalTable_keyIndex, "f").field, autoIncrement: __classPrivateFieldGet(self, _JournalTable_keyIndex, "f").autoIncrement }, store = __classPrivateFieldGet(self, _JournalTable_db, "f").createObjectStore(__classPrivateFieldGet(self, _JournalTable_name, "f"), options), pk = __classPrivateFieldGet(self, _JournalTable_keyIndex, "f");
                        store.createIndex(pk.name, pk.field, { unique: true });
                        __classPrivateFieldGet(self, _JournalTable_indexes, "f").forEach(i => {
                            store.createIndex(i.name, i.field, { unique: i.unique });
                        });
                        store.transaction.onerror = (e) => {
                            console.log(`Table.init.error`, e);
                            reject(e);
                        };
                        store.transaction.oncomplete = (e) => {
                            console.log(`Table.init.oncomplete - ${name}`, e);
                            resolve(true);
                        };
                    }
                    else
                        resolve(true);
                });
            });
        }
        save(src) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, transaction = __classPrivateFieldGet(self, _JournalTable_db, "f").transaction([__classPrivateFieldGet(self, _JournalTable_name, "f")], "readwrite"), store = transaction.objectStore(__classPrivateFieldGet(self, _JournalTable_name, "f"));
                src.id = src.id || window.uuid.v4();
                return new Promise((resolve, reject) => {
                    const key = src[__classPrivateFieldGet(self, _JournalTable_keyIndex, "f").field];
                    const request = !!key ? store.put(src, key) : store.add(src);
                    request.onsuccess = (e) => { resolve(request.result); };
                    request.onerror = (e) => { reject("Failed"); };
                });
            });
        }
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, transaction = __classPrivateFieldGet(self, _JournalTable_db, "f").transaction([__classPrivateFieldGet(self, _JournalTable_name, "f")], "readwrite"), store = transaction.objectStore(__classPrivateFieldGet(self, _JournalTable_name, "f"));
                return new Promise((resolve, reject) => {
                    const request = store.delete(id);
                    request.onsuccess = (e) => { resolve(true); };
                    request.onerror = (e) => { reject("Failed"); };
                });
            });
        }
        get(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, transaction = __classPrivateFieldGet(self, _JournalTable_db, "f").transaction([__classPrivateFieldGet(self, _JournalTable_name, "f")], "readwrite"), store = transaction.objectStore(__classPrivateFieldGet(self, _JournalTable_name, "f")) //,
                ;
                //id = Number.parseInt(id as any);
                return new Promise((resolve, reject) => {
                    const request = store.get(id);
                    request.onsuccess = (e) => {
                        let d = request.result;
                        d[__classPrivateFieldGet(self, _JournalTable_keyIndex, "f").field] = id;
                        resolve(d);
                    };
                    request.onerror = (e) => { reject("Failed"); };
                });
            });
        }
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, transaction = __classPrivateFieldGet(self, _JournalTable_db, "f").transaction([__classPrivateFieldGet(self, _JournalTable_name, "f")], "readwrite"), store = transaction.objectStore(__classPrivateFieldGet(self, _JournalTable_name, "f"));
                return new Promise((resolve, reject) => {
                    const request = store.getAllKeys();
                    request.onsuccess = (e) => __awaiter(this, void 0, void 0, function* () {
                        let keys = request.result;
                        let query = [];
                        keys.forEach(k => query.push(self.get(k)));
                        resolve(yield Promise.all(query));
                    });
                    request.onerror = (e) => { reject("Failed"); };
                });
            });
        }
    }
    _JournalTable_db = new WeakMap(), _JournalTable_name = new WeakMap(), _JournalTable_keyIndex = new WeakMap(), _JournalTable_indexes = new WeakMap();
    FoodJournal.JournalTable = JournalTable;
    // #endregion
    // #region Data
    class Base {
        getPropertyNamesOnly(targetClass) {
            const properties = Object.getOwnPropertyNames(targetClass);
            return properties.filter(p => {
                const desc = Object.getOwnPropertyDescriptor(targetClass, p);
                return !!desc.get || !!desc.set;
            });
        }
    }
    class ComponentMeasure {
        constructor(data) {
            _ComponentMeasure_amount.set(this, void 0);
            _ComponentMeasure_units.set(this, void 0);
            data = data || {};
            this.amount = data.amount;
            this.units = data.units;
        }
        get amount() { return __classPrivateFieldGet(this, _ComponentMeasure_amount, "f"); }
        set amount(val) { __classPrivateFieldSet(this, _ComponentMeasure_amount, Number.parseFloat(val) || 0, "f"); }
        get units() { return __classPrivateFieldGet(this, _ComponentMeasure_units, "f"); }
        set units(val) { __classPrivateFieldSet(this, _ComponentMeasure_units, val || Units.grams, "f"); }
        static sum(components) {
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
        add(units, amount) {
            if (amount === 0)
                return this.amount;
            this.amount += ComponentMeasure.convertMeasureAmount(units, this.units, amount);
            return this.amount;
        }
        serialize() {
            return {
                amount: this.amount,
                units: this.units
            };
        }
        static convertMeasureAmount(sourceMeasure, targetMeasure, amount) {
            let invalidConversion = "Invalid unit conversion. [" + sourceMeasure + " => " + targetMeasure + "]";
            if (!sourceMeasure || !targetMeasure)
                return 0;
            if (sourceMeasure === targetMeasure)
                return amount;
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
    }
    _ComponentMeasure_amount = new WeakMap(), _ComponentMeasure_units = new WeakMap();
    FoodJournal.ComponentMeasure = ComponentMeasure;
    ;
    ComponentMeasure.prototype.toString = function () {
        return Intl.NumberFormat().format(this.amount) + this.units;
    };
    class Nutrition extends Base {
        constructor(data) {
            super();
            _Nutrition_calories.set(this, void 0);
            _Nutrition_fat.set(this, void 0);
            _Nutrition_saturatedFat.set(this, void 0);
            _Nutrition_transFat.set(this, void 0);
            _Nutrition_cholesterol.set(this, void 0);
            _Nutrition_sodium.set(this, void 0);
            _Nutrition_dietaryFiber.set(this, void 0);
            _Nutrition_sugar.set(this, void 0);
            _Nutrition_carbohydrates.set(this, void 0);
            _Nutrition_sugarAlcohol.set(this, void 0);
            _Nutrition_protein.set(this, void 0);
            _Nutrition_vitaminA.set(this, void 0);
            _Nutrition_vitaminB1.set(this, void 0);
            _Nutrition_vitaminB2.set(this, void 0);
            _Nutrition_vitaminB6.set(this, void 0);
            _Nutrition_vitaminB12.set(this, void 0);
            _Nutrition_vitaminC.set(this, void 0);
            _Nutrition_vitaminD.set(this, void 0);
            _Nutrition_vitaminE.set(this, void 0);
            _Nutrition_calcium.set(this, void 0);
            _Nutrition_iron.set(this, void 0);
            _Nutrition_potassium.set(this, void 0);
            _Nutrition_phosporus.set(this, void 0);
            _Nutrition_magnesium.set(this, void 0);
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
        get calories() { return __classPrivateFieldGet(this, _Nutrition_calories, "f"); }
        set calories(val) { __classPrivateFieldSet(this, _Nutrition_calories, new ComponentMeasure(val), "f"); }
        get fat() { return __classPrivateFieldGet(this, _Nutrition_fat, "f"); }
        set fat(val) { __classPrivateFieldSet(this, _Nutrition_fat, new ComponentMeasure(val), "f"); }
        get saturatedFat() { return __classPrivateFieldGet(this, _Nutrition_saturatedFat, "f"); }
        set saturatedFat(val) { __classPrivateFieldSet(this, _Nutrition_saturatedFat, new ComponentMeasure(val), "f"); }
        get transFat() { return __classPrivateFieldGet(this, _Nutrition_transFat, "f"); }
        set transFat(val) { __classPrivateFieldSet(this, _Nutrition_transFat, new ComponentMeasure(val), "f"); }
        get cholesterol() { return __classPrivateFieldGet(this, _Nutrition_cholesterol, "f"); }
        set cholesterol(val) { __classPrivateFieldSet(this, _Nutrition_cholesterol, new ComponentMeasure(val), "f"); }
        get sodium() { return __classPrivateFieldGet(this, _Nutrition_sodium, "f"); }
        set sodium(val) { __classPrivateFieldSet(this, _Nutrition_sodium, new ComponentMeasure(val), "f"); }
        get dietaryFiber() { return __classPrivateFieldGet(this, _Nutrition_dietaryFiber, "f"); }
        set dietaryFiber(val) { __classPrivateFieldSet(this, _Nutrition_dietaryFiber, new ComponentMeasure(val), "f"); }
        get sugar() { return __classPrivateFieldGet(this, _Nutrition_sugar, "f"); }
        set sugar(val) { __classPrivateFieldSet(this, _Nutrition_sugar, new ComponentMeasure(val), "f"); }
        get carbohydrates() { return __classPrivateFieldGet(this, _Nutrition_carbohydrates, "f"); }
        set carbohydrates(val) { __classPrivateFieldSet(this, _Nutrition_carbohydrates, new ComponentMeasure(val), "f"); }
        get sugarAlcohol() { return __classPrivateFieldGet(this, _Nutrition_sugarAlcohol, "f"); }
        set sugarAlcohol(val) { __classPrivateFieldSet(this, _Nutrition_sugarAlcohol, new ComponentMeasure(val), "f"); }
        get protein() { return __classPrivateFieldGet(this, _Nutrition_protein, "f"); }
        set protein(val) { __classPrivateFieldSet(this, _Nutrition_protein, new ComponentMeasure(val), "f"); }
        get vitaminA() { return __classPrivateFieldGet(this, _Nutrition_vitaminA, "f"); }
        set vitaminA(val) { __classPrivateFieldSet(this, _Nutrition_vitaminA, new ComponentMeasure(val), "f"); }
        get vitaminB1() { return __classPrivateFieldGet(this, _Nutrition_vitaminB1, "f"); }
        set vitaminB1(val) { __classPrivateFieldSet(this, _Nutrition_vitaminB1, new ComponentMeasure(val), "f"); }
        get vitaminB2() { return __classPrivateFieldGet(this, _Nutrition_vitaminB2, "f"); }
        set vitaminB2(val) { __classPrivateFieldSet(this, _Nutrition_vitaminB2, new ComponentMeasure(val), "f"); }
        get vitaminB6() { return __classPrivateFieldGet(this, _Nutrition_vitaminB6, "f"); }
        set vitaminB6(val) { __classPrivateFieldSet(this, _Nutrition_vitaminB6, new ComponentMeasure(val), "f"); }
        get vitaminB12() { return __classPrivateFieldGet(this, _Nutrition_vitaminB12, "f"); }
        set vitaminB12(val) { __classPrivateFieldSet(this, _Nutrition_vitaminB12, new ComponentMeasure(val), "f"); }
        get vitaminC() { return __classPrivateFieldGet(this, _Nutrition_vitaminC, "f"); }
        set vitaminC(val) { __classPrivateFieldSet(this, _Nutrition_vitaminC, new ComponentMeasure(val), "f"); }
        get vitaminD() { return __classPrivateFieldGet(this, _Nutrition_vitaminD, "f"); }
        set vitaminD(val) { __classPrivateFieldSet(this, _Nutrition_vitaminD, new ComponentMeasure(val), "f"); }
        get vitaminE() { return __classPrivateFieldGet(this, _Nutrition_vitaminE, "f"); }
        set vitaminE(val) { __classPrivateFieldSet(this, _Nutrition_vitaminE, new ComponentMeasure(val), "f"); }
        get calcium() { return __classPrivateFieldGet(this, _Nutrition_calcium, "f"); }
        set calcium(val) { __classPrivateFieldSet(this, _Nutrition_calcium, new ComponentMeasure(val), "f"); }
        get iron() { return __classPrivateFieldGet(this, _Nutrition_iron, "f"); }
        set iron(val) { __classPrivateFieldSet(this, _Nutrition_iron, new ComponentMeasure(val), "f"); }
        get potassium() { return __classPrivateFieldGet(this, _Nutrition_potassium, "f"); }
        set potassium(val) { __classPrivateFieldSet(this, _Nutrition_potassium, new ComponentMeasure(val), "f"); }
        get phosporus() { return __classPrivateFieldGet(this, _Nutrition_phosporus, "f"); }
        set phosporus(val) { __classPrivateFieldSet(this, _Nutrition_phosporus, new ComponentMeasure(val), "f"); }
        get magnesium() { return __classPrivateFieldGet(this, _Nutrition_magnesium, "f"); }
        set magnesium(val) { __classPrivateFieldSet(this, _Nutrition_magnesium, new ComponentMeasure(val), "f"); }
        get totalFat() {
            return ComponentMeasure.sum([
                this.fat,
                this.saturatedFat,
                this.transFat
            ]);
        }
        get totalCarbohydrates() {
            return ComponentMeasure.sum([
                this.carbohydrates,
                this.dietaryFiber,
                this.sugar,
                this.sugarAlcohol
            ]);
        }
        calculateForServings(servings) {
            let data = {};
            let props = Nutrition.prototype.getPropertyNamesOnly(Nutrition.prototype);
            for (let k = 0; k < props.length; k++) {
                let prop = props[k], source = this[prop];
                data[prop] = new ComponentMeasure({ units: source.units, amount: source.amount * servings });
            }
            return new Nutrition(data);
        }
        serialize() {
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
        static sum(nutritions) {
            if (!!nutritions && Array.isArray(nutritions)) {
                if (nutritions.length === 0)
                    return new Nutrition();
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
        add(item) {
            let comb = new Nutrition(this);
            let props = Nutrition.prototype.getPropertyNamesOnly(Nutrition.prototype);
            for (let k = 0; k < props.length; k++) {
                let prop = props[k], current = comb[prop], source = item[prop];
                if (current instanceof ComponentMeasure && source instanceof ComponentMeasure) {
                    current.add(source.units, source.amount);
                }
            }
            return comb;
        }
    }
    _Nutrition_calories = new WeakMap(), _Nutrition_fat = new WeakMap(), _Nutrition_saturatedFat = new WeakMap(), _Nutrition_transFat = new WeakMap(), _Nutrition_cholesterol = new WeakMap(), _Nutrition_sodium = new WeakMap(), _Nutrition_dietaryFiber = new WeakMap(), _Nutrition_sugar = new WeakMap(), _Nutrition_carbohydrates = new WeakMap(), _Nutrition_sugarAlcohol = new WeakMap(), _Nutrition_protein = new WeakMap(), _Nutrition_vitaminA = new WeakMap(), _Nutrition_vitaminB1 = new WeakMap(), _Nutrition_vitaminB2 = new WeakMap(), _Nutrition_vitaminB6 = new WeakMap(), _Nutrition_vitaminB12 = new WeakMap(), _Nutrition_vitaminC = new WeakMap(), _Nutrition_vitaminD = new WeakMap(), _Nutrition_vitaminE = new WeakMap(), _Nutrition_calcium = new WeakMap(), _Nutrition_iron = new WeakMap(), _Nutrition_potassium = new WeakMap(), _Nutrition_phosporus = new WeakMap(), _Nutrition_magnesium = new WeakMap();
    FoodJournal.Nutrition = Nutrition;
    ;
    Nutrition.prototype.toString = function () {
        let props = Nutrition.prototype.getPropertyNamesOnly(Nutrition.prototype);
        let str = "";
        for (let i = 0; i < props.length; i++) {
            let prop = props[i], value = this[prop];
            str += str == "" ? "" : ", ";
            str += prop + " : " + value.toString();
        }
        return str;
    };
    class Ingredient {
        constructor(data) {
            _Ingredient_name.set(this, void 0);
            _Ingredient_nutrition.set(this, void 0);
            _Ingredient_servingSize.set(this, void 0);
            data = data || {};
            this.id = data.id;
            this.name = data.name;
            this.nutrition = data.nutrition;
            this.servingSize = data.servingSize;
        }
        get name() { return __classPrivateFieldGet(this, _Ingredient_name, "f"); }
        set name(val) { __classPrivateFieldSet(this, _Ingredient_name, val || "", "f"); }
        get nutrition() { return __classPrivateFieldGet(this, _Ingredient_nutrition, "f"); }
        set nutrition(val) { __classPrivateFieldSet(this, _Ingredient_nutrition, new Nutrition(val), "f"); }
        get servingSize() { return __classPrivateFieldGet(this, _Ingredient_servingSize, "f"); }
        set servingSize(val) { __classPrivateFieldSet(this, _Ingredient_servingSize, new ComponentMeasure(val), "f"); }
        serialize() {
            return {
                id: this.id,
                name: this.name,
                nutrition: this.nutrition.serialize(),
                servingSize: this.servingSize.serialize(),
            };
        }
        static Find(db, id) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = yield db.ingredients.get(id.toString());
                data.id = id;
                return new Ingredient(data);
            });
        }
    }
    _Ingredient_name = new WeakMap(), _Ingredient_nutrition = new WeakMap(), _Ingredient_servingSize = new WeakMap();
    FoodJournal.Ingredient = Ingredient;
    ;
    class DishIngredient extends Ingredient {
        constructor(data, servings) {
            super(data || {});
            //#ingredientId: string;
            _DishIngredient_servings.set(this, void 0);
            data = data || {};
            this.servings = data.servings || servings;
            //this.#ingredientId = data.ingredientId;
        }
        get servings() { return __classPrivateFieldGet(this, _DishIngredient_servings, "f"); }
        set servings(val) { __classPrivateFieldSet(this, _DishIngredient_servings, Number.parseFloat(val) || 1, "f"); }
        get amount() { return (this.servings * this.servingSize.amount).toString() + " " + this.servingSize.units; }
        static getAmounts(dishIngredients) {
            let amounts = {};
            for (let i = 0; i < dishIngredients.length; i++) {
                let d = dishIngredients[i];
                let a = amounts[d.name] = amounts[d.name] || { amount: 0, units: d.servingSize.units };
                a.amount += d.servings * d.servingSize.amount;
            }
            let keys = Object.keys(amounts);
            let sums = [];
            for (let k = 0; k < keys.length; k++) {
                sums.push({ name: keys[k], amount: amounts[keys[k]].amount, units: amounts[keys[k]].units });
            }
            return sums;
        }
        getServingNutrition() {
            return this.nutrition.calculateForServings(this.servings);
        }
        serialize() {
            //let result = super.serialize() as IDishIngredient;
            //result.servings = this.servings;
            //return result;
            return {
                id: this.id,
                //ingredientId: this.#ingredientId,
                servings: __classPrivateFieldGet(this, _DishIngredient_servings, "f")
            };
        }
    }
    _DishIngredient_servings = new WeakMap();
    FoodJournal.DishIngredient = DishIngredient;
    class Dish {
        constructor(data) {
            _Dish_name.set(this, void 0);
            _Dish_ingredients.set(this, void 0);
            data = data || {};
            this.id = data.id || window.uuid.v4();
            this.name = data.name;
            __classPrivateFieldSet(this, _Dish_ingredients, [], "f");
            if (data.ingredients) {
                data.ingredients.forEach((i) => __classPrivateFieldGet(this, _Dish_ingredients, "f").push(new DishIngredient(i)));
            }
        }
        get name() { return __classPrivateFieldGet(this, _Dish_name, "f"); }
        set name(val) { __classPrivateFieldSet(this, _Dish_name, val || "", "f"); }
        get ingredients() { return __classPrivateFieldGet(this, _Dish_ingredients, "f"); }
        getNutrition() {
            if (this.ingredients && Array.isArray(this.ingredients) && this.ingredients.length > 0) {
                let comb = new Nutrition(this.ingredients[0].nutrition);
                for (let i = 1; i < this.ingredients.length; i++) {
                    comb = comb.add(this.ingredients[i].nutrition);
                }
                return comb;
            }
            return new Nutrition();
        }
        addIngredient(ingredient) {
            let item = this.ingredients.find((v) => { return v.id === ingredient.id; });
            if (!item) {
                item = new DishIngredient(ingredient.serialize());
                this.ingredients.push(item);
            }
            item.servings++;
        }
        serialize() {
            let ingredients = [];
            this.ingredients.forEach(i => ingredients.push(i.serialize()));
            return {
                id: this.id,
                name: this.name,
                ingredients: ingredients,
            };
        }
        static Find(db, id) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = yield db.dishes.get(id.toString());
                data.id = id;
                return new Dish(data);
            });
        }
    }
    _Dish_name = new WeakMap(), _Dish_ingredients = new WeakMap();
    FoodJournal.Dish = Dish;
    ;
    class JournalItem extends Dish {
        constructor(data) {
            super(data);
            //#dishId: string;
            _JournalItem_servings.set(this, void 0);
            data = data || {};
            this.servings = data.servings;
            //this.#dishId = data.dishId;
        }
        get servings() { return __classPrivateFieldGet(this, _JournalItem_servings, "f"); }
        set servings(val) { __classPrivateFieldSet(this, _JournalItem_servings, Number.parseFloat(val) || 1, "f"); }
        getNutrition() {
            return super.getNutrition().calculateForServings(this.servings);
        }
        serialize() {
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
    _JournalItem_servings = new WeakMap();
    FoodJournal.JournalItem = JournalItem;
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
    class JournalEntry {
        constructor(data, db) {
            _JournalEntry_timestamp.set(this, void 0);
            _JournalEntry_items.set(this, void 0);
            data = data || {};
            this.id = data.id;
            __classPrivateFieldSet(this, _JournalEntry_timestamp, (data.timestamp instanceof Date ? data.timestamp : new Date(data.timeStamp || new Date())), "f");
            __classPrivateFieldSet(this, _JournalEntry_items, [], "f");
            if (data.items) {
                data.items.forEach((i) => __classPrivateFieldGet(this, _JournalEntry_items, "f").push(new JournalItem(i)));
            }
        }
        get timestamp() { return __classPrivateFieldGet(this, _JournalEntry_timestamp, "f"); }
        get items() { return __classPrivateFieldGet(this, _JournalEntry_items, "f"); }
        getNutrition() {
            if (this.items && Array.isArray(this.items) && this.items.length > 0) {
                let comb = new Nutrition(this.items[0].getNutrition());
                for (let i = 1; i < this.items.length; i++) {
                    comb = comb.add(this.items[i].getNutrition());
                }
                return comb;
            }
            return new Nutrition();
        }
        serialize() {
            let items = [];
            this.items.forEach(i => items.push(i.serialize()));
            return {
                id: this.id,
                timestamp: this.timestamp,
                items: items
            };
        }
        addDish(src) {
            let item = src;
            item.servings = 1;
            this.items.push(new JournalItem(item));
        }
        static getNutrition(entries) {
            var nutritions = [];
            for (var i = 0; i < entries.length; i++) {
                nutritions.push(entries[i].getNutrition());
            }
            return Nutrition.sum(nutritions);
        }
        static getIngredients(entries) {
            var ingredients = [];
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
        static getRange(array, startDate, endDate) {
            return array.filter(je => je.timestamp.getTime() >= startDate.getTime() &&
                je.timestamp.getTime() <= endDate.getTime());
        }
        static ingredientAmountToString(item) {
            return item.name + " " + item.amount + " " + item.units;
        }
        static Find(db, id) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = yield db.journalEntries.get(id.toString());
                data.id = id;
                for (let i = 0; i < data.items.length; i++) {
                    let item = data.items[i];
                    let dish = yield db.dishes.get(item.id.toString());
                    merge(item, dish);
                }
                ;
                return new JournalEntry(data);
            });
        }
    }
    _JournalEntry_timestamp = new WeakMap(), _JournalEntry_items = new WeakMap();
    FoodJournal.JournalEntry = JournalEntry;
    let InitialIngredients = [
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
    let getDishIngredient = (i, servings) => {
        let data = i;
        data.servings = servings;
        return data;
    };
    let InitialDishes = [
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
    let WidgetConstructor = function (groupData, defaults, constructor) {
        return function (option) {
            //console.log(this);
            return this.each(function () {
                try {
                    let $this = $(this), data = $this.data(groupData), options = $.extend({}, defaults, data, typeof option == 'object' && option);
                    $this.data(groupData, (data = constructor(this, options)));
                }
                catch (ex) {
                    console.error("WidgetConstructor", ex);
                }
            });
        };
    };
    class MeasureField {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("MeasureField");
            try {
                let self = this, $this = $(element).addClass("field measure");
                self.controlTemplate = kendo.template($('#field-measure-template').html());
                let o = [];
                options.units.forEach(u => o.push({ label: u, value: u, selected: (u == options.measure.units) ? 'selected' : '' }));
                $this.empty().append(self.controlTemplate({
                    readonly: options.readonly,
                    id: options.id,
                    label: options.label,
                    amount: options.measure.amount,
                    units: options.measure.units,
                    options: o
                }));
                $this
                    .off()
                    .on('change', `[name='${self.id}_value']`, function (e) {
                    self.measure.amount = Number.parseFloat($(this).val()) || 0;
                    if (!!self.options.onChange)
                        self.options.onChange(self.measure);
                })
                    .on('change', `[name='${self.id}_unit']`, function (e) {
                    self.measure.units = $(this).val() || "";
                    if (!!self.options.onChange)
                        self.options.onChange(self.measure);
                });
            }
            catch (ex) {
                console.error("MeasureField", ex);
            }
        }
        get id() { return this.options.id; }
        get label() { return this.options.label; }
        get units() { return this.options.units; }
        get measure() { return this.options.measure; }
        set measure(val) { this.options.measure = val; }
    }
    MeasureField.CLASS = "";
    MeasureField.DEFAULTS = {
        readonly: false,
        id: null,
        label: null,
        measure: new ComponentMeasure(),
        units: [],
    };
    MeasureField.GROUP_DATA = 'measureField';
    FoodJournal.MeasureField = MeasureField;
    $.fn.journalMeasureField = WidgetConstructor(MeasureField.GROUP_DATA, MeasureField.DEFAULTS, (e, o) => new MeasureField(e, o));
    class StringField {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("StringField");
            try {
                let self = this, $this = $(element).addClass("field stringinput");
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
                    self.value = $(this).val();
                    if (!!self.options.onChange)
                        self.options.onChange(self.value);
                });
            }
            catch (ex) {
                console.error("StringField", ex);
            }
        }
        get id() { return this.options.id; }
        get label() { return this.options.label; }
        get value() { return this.options.value; }
        set value(val) { this.options.value = val; $(this.element).val(val); }
    }
    StringField.CLASS = "";
    StringField.DEFAULTS = {
        readonly: false,
        id: null,
        label: null,
        value: null,
    };
    StringField.GROUP_DATA = 'stringField';
    FoodJournal.StringField = StringField;
    $.fn.journalStringField = WidgetConstructor(StringField.GROUP_DATA, StringField.DEFAULTS, (e, o) => new StringField(e, o));
    class NumberField {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("NumberField");
            try {
                let self = this, $this = $(element).addClass("field numericalinput");
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
                    self.value = parseFloat($(this).val());
                    if (!!self.options.onChange)
                        self.options.onChange(self.value);
                });
            }
            catch (ex) {
                console.error("NumberField", ex);
            }
        }
        get id() { return this.options.id; }
        get label() { return this.options.label; }
        get value() { return this.options.value; }
        set value(val) { this.options.value = val; $(this.element).val(val); }
    }
    NumberField.CLASS = "";
    NumberField.DEFAULTS = {
        readonly: false,
        id: null,
        label: null,
        value: null,
    };
    NumberField.GROUP_DATA = 'stringField';
    FoodJournal.NumberField = NumberField;
    $.fn.journalNumberField = WidgetConstructor(NumberField.GROUP_DATA, NumberField.DEFAULTS, (e, o) => new NumberField(e, o));
    class SelectField {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("SelectField");
            try {
                let self = this, $this = $(element).addClass("field selectinput");
                self.controlTemplate = kendo.template($('#field-selectinput-template').html());
                $this.empty().append(self.controlTemplate(options));
                $this
                    .off()
                    .on('change', `[name=${self.id}_value']`, function (e) {
                    self.value = $(this).val();
                    if (!!self.options.onChange)
                        self.options.onChange(self.value);
                });
            }
            catch (ex) {
                console.error("SelectField", ex);
            }
        }
        get id() { return this.options.id; }
        get label() { return this.options.label; }
        get listOptions() { return this.options.options; }
        get value() { return this.options.value; }
        set value(val) { this.options.value = val; $(this.element).val(val); }
    }
    SelectField.CLASS = "";
    SelectField.DEFAULTS = {
        id: null,
        label: null,
        value: null,
        options: [],
    };
    SelectField.GROUP_DATA = 'selectField';
    FoodJournal.SelectField = SelectField;
    $.fn.journalSelectField = WidgetConstructor(SelectField.GROUP_DATA, SelectField.DEFAULTS, (e, o) => new SelectField(e, o));
    class IngredientControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("IngredientControl");
            try {
                let self = this, $this = $(element).addClass("form-group ingredient");
                self.controlTemplate = kendo.template($('#ingredient-template').html());
                $this.empty().append(self.controlTemplate(options));
                let servingSizeId = `${self.id}_servingsize`, nameId = `${self.id}_name`, nutritionId = `${self.id}_nutrition`, saveBtnId = `${self.id}_save_btn`, removeBtnId = `${self.id}_remove_btn`;
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
                    if (!!self.options.onSave)
                        self.options.onSave(self);
                })
                    .on('click', `#${removeBtnId}`, function (e) {
                    if (!!self.options.onRemove)
                        self.options.onRemove(self);
                });
            }
            catch (ex) {
                console.error("IngredientControl", ex);
            }
        }
        get id() { return this.options.id; }
        get ingredient() { return this.options.ingredient; }
        set ingredient(val) { this.options.ingredient = val; }
    }
    IngredientControl.CLASS = "";
    IngredientControl.DEFAULTS = {
        readonly: false,
        dependantControl: false,
        id: null,
        ingredient: new Ingredient(),
        units: [],
    };
    IngredientControl.GROUP_DATA = 'ingredientControl';
    FoodJournal.IngredientControl = IngredientControl;
    $.fn.journalIngredientControl = WidgetConstructor(IngredientControl.GROUP_DATA, IngredientControl.DEFAULTS, (e, o) => new IngredientControl(e, o));
    class NutritionControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("NutritionControl");
            try {
                let self = this, $this = $(element).addClass("form-group nutrition");
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
            }
            catch (ex) {
                console.error("NutritionControl", ex);
            }
        }
        get id() { return this.options.id; }
        get nutrition() { return this.options.nutrition; }
        set nutrition(val) { this.options.nutrition = val; }
    }
    NutritionControl.CLASS = "";
    NutritionControl.DEFAULTS = {
        readonly: false,
        id: null,
        nutrition: new Nutrition(),
        units: [],
    };
    NutritionControl.GROUP_DATA = 'nutritionControl';
    FoodJournal.NutritionControl = NutritionControl;
    $.fn.journalNutritionControl = WidgetConstructor(NutritionControl.GROUP_DATA, NutritionControl.DEFAULTS, (e, o) => new NutritionControl(e, o));
    class DishIngredientControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("DishIngredientControl");
            try {
                let self = this, $this = $(element).addClass("form-group dish-ingredient");
                self.controlTemplate = kendo.template($('#dish-ingredient-template').html());
                $this.empty().append(self.controlTemplate(options));
                let servingsId = `${self.id}_servings`, ingredientId = `${self.id}_ingredient`, nutritionId = `${self.id}_nutrition`, saveBtnId = `${self.id}_save_btn`, removeBtnId = `${self.id}_remove_btn`;
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
                    if (!!self.options.onSave)
                        self.options.onSave(self);
                })
                    .on('click', `#${removeBtnId}`, function (e) {
                    if (!!self.options.onRemove)
                        self.options.onRemove(self);
                });
            }
            catch (ex) {
                console.error("DishIngredientControl", ex);
            }
        }
        get id() { return this.options.id; }
        get ingredient() { return this.options.ingredient; }
        set ingredient(val) { this.options.ingredient = val; }
    }
    DishIngredientControl.CLASS = "";
    DishIngredientControl.DEFAULTS = {
        readonly: false,
        dependantControl: false,
        id: null,
        units: [],
        ingredient: new DishIngredient(),
    };
    DishIngredientControl.GROUP_DATA = 'dishIngredientControl';
    FoodJournal.DishIngredientControl = DishIngredientControl;
    $.fn.journalDishIngredientControl = WidgetConstructor(DishIngredientControl.GROUP_DATA, DishIngredientControl.DEFAULTS, (e, o) => new DishIngredientControl(e, o));
    class DishControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("DishControl");
            try {
                let self = this, $this = $(element).addClass("form-group dish");
                self.controlTemplate = kendo.template($('#dish-template').html());
                $this.empty().append(self.controlTemplate(options));
                let nameId = `${self.id}_name`, saveBtnId = `${self.id}_save_btn`, removeBtnId = `${self.id}_remove_btn`, addIngredientBtn = `${self.id}_addingredient_btn`;
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
                    if (!!self.options.onSave)
                        self.options.onSave(self);
                })
                    .on('click', `#${removeBtnId}`, function (e) {
                    if (!!self.options.onRemove)
                        self.options.onRemove(self);
                })
                    .on('click', `#${addIngredientBtn}`, function (e) {
                    self.addIngredient();
                });
            }
            catch (ex) {
                console.error("DishControl", ex);
            }
        }
        get id() { return this.options.id; }
        get ingredients() { return this.options.dish.ingredients; }
        get dish() { return this.options.dish; }
        set dish(val) { this.options.dish = val; }
        refreshAddIngredients() {
            let self = this, $this = $(this.element), addIngredientId = `${self.id}_addingredient`, $addIngredient = $(`#${addIngredientId}`, $this);
            $addIngredient.empty();
            self.options.ingredients.forEach((item, i) => {
                $('<option>', { text: item.name, value: item.id })
                    .appendTo($addIngredient);
            });
        }
        refreshIngredients() {
            let self = this, $this = $(this.element), ingredientsId = `${self.id}_ingredients`, $ingredients = $(`#${ingredientsId}`, $this);
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
                        if (!!self.options.onChange)
                            self.options.onChange(self);
                    },
                    onRemove: (dishIngredient) => {
                        let ingredient = dishIngredient.ingredient, index = self.ingredients.indexOf(ingredient);
                        if (index > -1) {
                            self.dish.ingredients.splice(index, 1);
                            self.refreshNutrition();
                            self.refreshIngredients();
                            if (!!self.options.onChange)
                                self.options.onChange(self);
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
            let self = this, $this = $(this.element), nutritionId = `${self.id}_nutrition`, $nutrition = $(`#${nutritionId}`, $this), $next = $('<div>', { id: nutritionId });
            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.options.dish.getNutrition(),
                units: self.options.units,
            });
        }
        addIngredient() {
            let self = this, $this = $(this.element), addIngredientId = `${self.id}_addingredient`, $addIngredient = $(`#${addIngredientId}`, $this), ingredientId = $addIngredient.val(), ingredient = self.options.ingredients.find((value) => { return value.id === ingredientId; });
            self.dish.addIngredient(new Ingredient(ingredient));
            self.refreshIngredients();
            self.refreshAddIngredients();
        }
    }
    DishControl.CLASS = "";
    DishControl.DEFAULTS = {
        readonly: false,
        id: null,
        ingredients: [],
        units: [],
        dish: new Dish(),
    };
    DishControl.GROUP_DATA = 'dishControl';
    FoodJournal.DishControl = DishControl;
    $.fn.journalDishControl = WidgetConstructor(DishControl.GROUP_DATA, DishControl.DEFAULTS, (e, o) => new DishControl(e, o));
    class JournalItemControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            console.log("JournalItemControl");
            try {
                let self = this, $this = $(element).addClass("form-group journal-item");
                self.controlTemplate = kendo.template($('#journal-item-template').html());
                $this.empty().append(self.controlTemplate(options));
                let nameId = `${self.id}_name`, servingsId = `${self.id}_servings`, saveBtnId = `${self.id}_save_btn`, removeBtnId = `${self.id}_remove_btn`;
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
                    if (!!self.options.onSave)
                        self.options.onSave(self);
                })
                    .on('click', `#${removeBtnId}`, function (e) {
                    if (!!self.options.onRemove)
                        self.options.onRemove(self);
                });
            }
            catch (ex) {
                console.error("JournalItemControl", ex);
            }
        }
        get id() { return this.options.id; }
        get ingredients() { return this.options.journalItem.ingredients; }
        get journalItem() { return this.options.journalItem; }
        set journalItem(val) { this.options.journalItem = val; }
        refreshIngredients() {
            let self = this, $this = $(this.element), ingredientsId = `${self.id}_ingredients`, $ingredients = $(`#${ingredientsId}`, $this);
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
                        if (!!self.options.onChange)
                            self.options.onChange(self);
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
            let self = this, $this = $(this.element), nutritionId = `${self.id}_nutrition`, $nutrition = $(`#${nutritionId}`, $this), $next = $('<div>', { id: nutritionId });
            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.journalItem.getNutrition(),
                units: self.options.units,
            });
        }
    }
    JournalItemControl.CLASS = "";
    JournalItemControl.DEFAULTS = {
        readonly: false,
        dependantControl: false,
        id: null,
        units: [],
        journalItem: new JournalItem(),
    };
    JournalItemControl.GROUP_DATA = 'journalItemControl';
    FoodJournal.JournalItemControl = JournalItemControl;
    $.fn.journalJournalItemControl = WidgetConstructor(JournalItemControl.GROUP_DATA, JournalItemControl.DEFAULTS, (e, o) => new JournalItemControl(e, o));
    class JournalEntryControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            _JournalEntryControl_dialog.set(this, void 0);
            console.log("JournalEntryControl");
            try {
                let self = this, $this = $(element).addClass("form-group journal-entry");
                self.controlTemplate = kendo.template($('#journal-entry-template').html());
                $this.empty().append(self.controlTemplate(options));
                let timestampId = `${self.id}_timestamp`, itemsId = `${self.id}_items`, nutritionId = `${self.id}_nutrition`, saveBtnId = `${self.id}_save_btn`, removeBtnId = `${self.id}_remove_btn`;
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
                    let $this = $(this), data = $this.data(JournalItemControl.GROUP_DATA);
                    self.editItem(data.journalItem);
                })
                    .on("click", `.je-remove-item`, function (e) {
                    let $this = $(this), data = $this.data(JournalItemControl.GROUP_DATA);
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
                    if (!!self.options.onSave)
                        self.options.onSave(self);
                })
                    .on('click', `#${removeBtnId}`, function (e) {
                    if (!!self.options.onRemove)
                        self.options.onRemove(self);
                });
            }
            catch (ex) {
                console.error("JournalEntryControl", ex);
            }
        }
        editItem(item) {
            let self = this, $this = $(self.element), $dialog = $("<div>", {}).appendTo($('body'));
            __classPrivateFieldSet(self, _JournalEntryControl_dialog, $dialog.kendoDialog({
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
                    __classPrivateFieldSet(self, _JournalEntryControl_dialog, null, "f");
                }
            }).data('kendoDialog'), "f");
            let $editor = $('.dialog-container', $dialog);
            $editor.journalJournalItemControl({
                id: `${self.id}_itemeditor`,
                journalItem: item,
                units: self.options.units,
                readonly: false,
                dependantControl: true,
                onChange: (v) => { }
            });
            __classPrivateFieldGet(self, _JournalEntryControl_dialog, "f").open();
        }
        removeItem(item) {
        }
        addItem() {
            let self = this, $this = $(this.element), addDishId = `${self.id}_adddish`, $addDish = $(`#${addDishId}`, $this), dishId = $addDish.val(), dish = self.options.dishes.find((value) => { return value.id === dishId; });
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
            let self = this, $this = $(this.element), importDishId = `${self.id}_adddish`, $importDish = $(`#${importDishId}`, $this);
            $importDish.empty();
            self.options.dishes.forEach((item, i) => {
                $('<option>', { text: item.name, value: item.id })
                    .appendTo($importDish);
            });
        }
        refreshItems() {
            let self = this, $this = $(this.element), itemsId = `${self.id}_items`, $items = $(`#${itemsId}`, $this);
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
                        if (!!self.options.onChange)
                            self.options.onChange(self);
                    },
                    onRemove: (journalItem) => {
                        let item = journalItem.journalItem, index = self.journalEntry.items.indexOf(item);
                        if (index > -1) {
                            self.journalEntry.items.splice(index, 1);
                            self.refreshNutrition();
                            self.refreshItems();
                            if (!!self.options.onChange)
                                self.options.onChange(self);
                        }
                    },
                    onSave: (journalItem) => {
                        if (!!self.options.onSave)
                            self.options.onSave(self);
                    }
                })
                    .appendTo($items);
            });
        }
        refreshNutrition() {
            let self = this, $this = $(this.element), nutritionId = `${self.id}_nutrition`, $nutrition = $(`#${nutritionId}`, $this), $next = $('<div>', { id: nutritionId });
            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.journalEntry.getNutrition(),
                units: self.options.units,
            });
        }
        get id() { return this.options.id; }
        get items() { return this.options.journalEntry.items; }
        get journalEntry() { return this.options.journalEntry; }
        set journalEntry(val) { this.options.journalEntry = val; }
    }
    _JournalEntryControl_dialog = new WeakMap();
    JournalEntryControl.CLASS = "";
    JournalEntryControl.DEFAULTS = {
        readonly: false,
        id: null,
        units: [],
        dishes: [],
        journalEntry: new JournalEntry(),
    };
    JournalEntryControl.GROUP_DATA = 'journalEntryControl';
    FoodJournal.JournalEntryControl = JournalEntryControl;
    $.fn.journalJournalEntryControl = WidgetConstructor(JournalEntryControl.GROUP_DATA, JournalEntryControl.DEFAULTS, (e, o) => new JournalEntryControl(e, o));
    class JournalReportControl {
        constructor(element, options) {
            this.element = element;
            this.options = options;
            _JournalReportControl_journalRange.set(this, []);
            console.log("JournalReportControl");
            try {
                let self = this, $this = $(this.element).addClass("form-group journal-report");
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
                        let range = e.sender.range();
                        self.startDate = range.start;
                        self.endDate = range.end;
                        self.refreshIngredients();
                        self.refreshNutrition();
                    }
                });
                self.refreshIngredients();
                self.refreshNutrition();
            }
            catch (ex) {
                console.error("JournalReportControl", ex);
            }
        }
        refreshIngredients() {
            let self = this, $this = $(this.element), ingredientsId = `${self.id}_ingredients`, $ingredients = $(`#${ingredientsId}`, $this), journalRange = JournalEntry.getRange(self.options.allJournalEntries, self.startDate, self.endDate);
            self.ingredients = JournalEntry.getIngredients(journalRange);
            __classPrivateFieldSet(self, _JournalReportControl_journalRange, journalRange, "f");
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
            let self = this, $this = $(this.element), nutritionId = `${self.id}_nutrition`, $nutrition = $(`#${nutritionId}`, $this), $next = $('<div>', { id: nutritionId });
            self.nutrition = JournalEntry.getNutrition(__classPrivateFieldGet(this, _JournalReportControl_journalRange, "f"));
            $nutrition.replaceWith($next);
            $next.journalNutritionControl({
                readonly: true,
                id: nutritionId,
                nutrition: self.nutrition,
                units: self.units,
            });
        }
        get id() { return this.options.id; }
        get units() { return this.options.units; }
        get allEntries() { return this.options.allJournalEntries; }
        get ingredients() { return this.options.ingredients; }
        set ingredients(val) { this.options.ingredients = val; }
        get nutrition() { return this.options.nutrition; }
        set nutrition(val) { this.options.nutrition = val; }
        get startDate() { return this.options.startDate; }
        set startDate(val) { this.options.startDate = val; }
        get endDate() { return this.options.endDate; }
        set endDate(val) { this.options.endDate = val; }
    }
    _JournalReportControl_journalRange = new WeakMap();
    JournalReportControl.CLASS = "";
    JournalReportControl.DEFAULTS = {
        id: null,
        allJournalEntries: [],
        units: [],
        startDate: new Date(),
        endDate: new Date(),
        ingredients: [],
        nutrition: new Nutrition()
    };
    JournalReportControl.GROUP_DATA = 'journalReportControl';
    FoodJournal.JournalReportControl = JournalReportControl;
    $.fn.journalJournalReportControl = WidgetConstructor(JournalReportControl.GROUP_DATA, JournalReportControl.DEFAULTS, (e, o) => new JournalReportControl(e, o));
    // #endregion
    //#endregion
    // #region Application
    class Application {
        constructor(configuration) {
            //ingredients: Ingredient[] = [];
            //journalEntries: JournalEntry[] = [];
            //dishes: Dish[] = [];
            //units: string[] = [];
            _Application_db.set(this, void 0);
            this.journalReport = null;
            this.dish = null;
            this.entry = null;
            this.ingredient = null;
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
                __classPrivateFieldSet(self, _Application_db, new JournalDatabase(), "f");
                __classPrivateFieldGet(self, _Application_db, "f").initialize()
                    .then(() => {
                    self.processHashLocation();
                });
            }
            catch (ex) {
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
        getUnits() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = [], data = (yield __classPrivateFieldGet(this, _Application_db, "f").units.getAll()) || [];
                data.forEach(d => result.push(d.measure));
                return result;
            });
        }
        getIngredients() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = [], data = (yield __classPrivateFieldGet(this, _Application_db, "f").ingredients.getAll()) || [];
                data.forEach(d => result.push(new Ingredient(d)));
                return result;
            });
        }
        getDishes() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = [], data = (yield __classPrivateFieldGet(this, _Application_db, "f").dishes.getAll()) || [];
                data.forEach(d => result.push(new Dish(d)));
                return result;
            });
        }
        getJournals() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = [], data = (yield __classPrivateFieldGet(this, _Application_db, "f").journalEntries.getAll()) || [];
                for (let i = 0; i < data.length; i++) {
                    let entry = data[i];
                    for (let d = 0; d < entry.items.length; d++) {
                        let item = entry.items[d];
                        let dish = yield __classPrivateFieldGet(this, _Application_db, "f").dishes.get(item.id.toString());
                        merge(item, dish);
                    }
                    result.push(new JournalEntry(entry));
                }
                ;
                return result;
            });
        }
        // #region Views
        get $display() { return $('#display'); }
        displayJournalReport() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                console.log("displayJournalReport");
                try {
                    self.$display.empty();
                    self.journalReport = $('<div>', { id: 'journalreport' })
                        .appendTo(self.$display)
                        .journalJournalReportControl({
                        allJournalEntries: yield self.getJournals(),
                        units: yield self.getUnits(),
                        ingredients: [],
                        nutrition: new Nutrition(),
                        startDate: new Date('1/1/2021'),
                        endDate: new Date(),
                        id: 'journalreport'
                    })
                        .data(JournalReportControl.GROUP_DATA);
                }
                catch (ex) {
                    console.error("displayJournalReport", ex);
                }
            });
        }
        displayJournalEntries() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                console.log("displayJournalEntries");
                try {
                    self.$display.empty();
                    $(self.journalEntriesTemplate({ entries: yield self.getJournals() }))
                        .appendTo(self.$display);
                }
                catch (ex) {
                    console.error("displayJournalEntries", ex);
                }
            });
        }
        displayJournalEntry(key) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, id = 'journalEntry';
                console.log("displayJournalEntry");
                try {
                    self.$display.empty();
                    self.entry = $('<div>', { id: id })
                        .appendTo(self.$display)
                        .journalJournalEntryControl({
                        journalEntry: key ? yield JournalEntry.Find(__classPrivateFieldGet(self, _Application_db, "f"), key) : new JournalEntry(),
                        dishes: yield self.getDishes(),
                        units: yield self.getUnits(),
                        readonly: false,
                        id: id,
                        onSave: (entry) => __awaiter(this, void 0, void 0, function* () {
                            let i = yield __classPrivateFieldGet(self, _Application_db, "f").journalEntries.save(entry.journalEntry.serialize());
                            window.location.hash = `entry!${i}`;
                        }),
                        onRemove: (entry) => __awaiter(this, void 0, void 0, function* () {
                            yield __classPrivateFieldGet(self, _Application_db, "f").journalEntries.delete(entry.journalEntry.id);
                            window.location.hash = `entries`;
                        })
                    })
                        .data(JournalEntryControl.GROUP_DATA);
                }
                catch (ex) {
                    console.error("displayJournalEntry", ex);
                }
            });
        }
        displayDishes() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                console.log("displayDishes");
                try {
                    self.$display.empty();
                    $(self.dishesTemplate({ dishes: yield self.getDishes() }))
                        .appendTo(self.$display);
                }
                catch (ex) {
                    console.error("displayDishes", ex);
                }
            });
        }
        displayDish(key) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, id = 'journalDish';
                console.log("displayDish");
                try {
                    self.$display.empty();
                    self.entry = $('<div>', { id: id })
                        .appendTo(self.$display)
                        .journalDishControl({
                        dish: key ? yield Dish.Find(__classPrivateFieldGet(self, _Application_db, "f"), key) : new Dish(),
                        readonly: false,
                        ingredients: yield self.getIngredients(),
                        units: yield self.getUnits(),
                        id: id,
                        onSave: (entry) => __awaiter(this, void 0, void 0, function* () {
                            let i = yield __classPrivateFieldGet(self, _Application_db, "f").dishes.save(entry.dish.serialize());
                            window.location.hash = `dish!${i}`;
                        }),
                        onRemove: (entry) => __awaiter(this, void 0, void 0, function* () {
                            yield __classPrivateFieldGet(self, _Application_db, "f").dishes.delete(entry.dish.id);
                            window.location.hash = `dishes`;
                        })
                    })
                        .data(JournalEntryControl.GROUP_DATA);
                }
                catch (ex) {
                    console.error("displayDish", ex);
                }
            });
        }
        displayIngredients() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                console.log("displayIngredients");
                try {
                    self.$display.empty();
                    $(self.ingredientsTemplate({ ingredients: yield self.getIngredients() }))
                        .appendTo(self.$display);
                }
                catch (ex) {
                    console.error("displayIngredients", ex);
                }
            });
        }
        displayIngredient(key) {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this, id = 'journalIngredient';
                console.log("displayIngredient");
                try {
                    self.$display.empty();
                    self.entry = $('<div>', { id: id })
                        .appendTo(self.$display)
                        .journalIngredientControl({
                        ingredient: key ? yield Ingredient.Find(__classPrivateFieldGet(self, _Application_db, "f"), key) : new Ingredient(),
                        units: yield self.getUnits(),
                        readonly: false,
                        dependantControl: false,
                        id: id,
                        onSave: (entry) => __awaiter(this, void 0, void 0, function* () {
                            let i = yield __classPrivateFieldGet(self, _Application_db, "f").ingredients.save(entry.ingredient.serialize());
                            window.location.hash = `ingredient!${i}`;
                        }),
                        onRemove: (entry) => __awaiter(this, void 0, void 0, function* () {
                            yield __classPrivateFieldGet(self, _Application_db, "f").ingredients.delete(entry.ingredient.id);
                            window.location.hash = "ingredients";
                        })
                    })
                        .data(IngredientControl.GROUP_DATA);
                }
                catch (ex) {
                    console.error("displayIngredient", ex);
                }
            });
        }
        exportData() {
            return __awaiter(this, void 0, void 0, function* () {
                let self = this;
                let data = {
                    units: yield __classPrivateFieldGet(self, _Application_db, "f").units.getAll(),
                    ingredients: yield __classPrivateFieldGet(self, _Application_db, "f").ingredients.getAll(),
                    dishes: yield __classPrivateFieldGet(self, _Application_db, "f").dishes.getAll(),
                    journalEntries: yield __classPrivateFieldGet(self, _Application_db, "f").journalEntries.getAll()
                };
                //this.copyToClipboard(JSON.stringify(data));
                let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "JournalData.json";
                link.click();
                //$.post('export', data, (r) => {
                //})
            });
        }
        copyToClipboard(str) {
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
    }
    _Application_db = new WeakMap();
    FoodJournal.Application = Application;
    // #endregion
    // #region Startup
    //window.widget = WidgetConstructor;
    window.foodJournal = new Application();
    const s = $("<div>");
    const fd = window.foodJournal;
    // #endregion
})(FoodJournal = exports.FoodJournal || (exports.FoodJournal = {}));
function merge(target = {}, ...items) {
    target = target || {};
    if (items)
        items.forEach((i) => Object.keys(i).forEach((k) => target[k] = i[k]));
}
//# sourceMappingURL=site.js.map