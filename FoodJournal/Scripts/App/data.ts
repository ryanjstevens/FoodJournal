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

//export let Units = {
//    milligrams: 'mg',
//    grams: 'g',
//    kilograms: 'kg',
//    ounce: 'oz',
//    pounds: 'lb',
//    pint: 'pt',
//    quart: 'qt',
//    gallon: 'gal',
//    calories: 'calories',
//    Calories: 'Calories',
//    serving: 'serving',
//    tablet: 'tablet',
//    softGel: 'soft gel',
//    bar: 'bar',
//}

//export class ComponentMeasure {
//    constructor(data?) {
//        data = data || {};

//        this.amount = data.amount;
//        this.units = data.units;
//    }

//    #amount: number;
//    get amount(): number { return this.#amount; }
//    set amount(val: number) { this.#amount = Number.parseFloat(val as any) || 0; }

//    #units: string;
//    get units(): string { return this.#units; }
//    set units(val: string) { this.#units = val || Units.grams; }


//    static sum(components: ComponentMeasure[]): ComponentMeasure {
//        let combined = new ComponentMeasure();
//        if (!!components && Array.isArray(components)) {
//            for (let i = 0; i < components.length; i++) {
//                let comp = components[i];
//                combined.units = combined.units || comp.units;
//                combined.add(comp.units, comp.amount);
//            }
//        }
//        return combined;
//    }

//    add(units: string, amount: number): number {
//        if (amount === 0) return this.amount;
//        this.amount += ComponentMeasure.convertMeasureAmount(units, this.units, amount);
//        return this.amount;
//    }

//    static convertMeasureAmount(sourceMeasure: string, targetMeasure: string, amount: number): number {
//        let invalidConversion = "Invalid unit conversion. [" + sourceMeasure + " => " + targetMeasure + "]";
//        if (!sourceMeasure || !targetMeasure) return 0;
//        if (sourceMeasure === targetMeasure) return amount;

//        switch (targetMeasure) {
//            case Units.grams:
//                switch (sourceMeasure) {
//                    case Units.grams: return amount;
//                    case Units.milligrams: return amount * .001;
//                    case Units.kilograms: return amount * 1000;
//                    default: throw invalidConversion;
//                }
//            case Units.kilograms:
//                switch (sourceMeasure) {
//                    case Units.grams: return amount * .001;
//                    case Units.milligrams: return amount * .001 * .001;
//                    case Units.kilograms: return amount;
//                    default: throw invalidConversion;
//                }
//            case Units.milligrams:
//                switch (sourceMeasure) {
//                    case Units.grams: return amount * 1000;
//                    case Units.milligrams: return amount;
//                    case Units.kilograms: return amount * 1000 * 1000;
//                    default: throw invalidConversion;
//                }
//            default: throw invalidConversion;
//        }
//    }
//};

//ComponentMeasure.prototype.toString = function () {
//    return Intl.NumberFormat().format(this.amount) + this.units;
//};

//export class Nutrition {
//    constructor(data?) {
//        data = data || {};

//        this.calories = data.calories;
//        this.fat = data.fat;
//        this.saturatedFat = data.saturatedFat;
//        this.transFat = data.transFat;
//        this.cholesterol = data.cholesterol;
//        this.sodium = data.sodium;
//        this.dietaryFiber = data.dietaryFiber;
//        this.carbohydrates = data.carbohydrates;
//        this.sugar = data.sugar;
//        this.sugarAlcohol = data.sugarAlcohol;
//        this.protein = data.protein;

//        this.vitaminA = data.vitaminA;
//        this.vitaminB1 = data.vitaminB1;
//        this.vitaminB2 = data.vitaminB2;
//        this.vitaminB6 = data.vitaminB6;
//        this.vitaminB12 = data.vitaminB12;

//        this.vitaminC = data.vitaminC;
//        this.vitaminD = data.vitaminD;
//        this.vitaminE = data.vitaminE;
//        this.calcium = data.calcium;
//        this.iron = data.iron;
//        this.potassium = data.potassium;
//        this.phosporus = data.phosporus;
//        this.magnesium = data.magnesium;

//    }

//    #calories: ComponentMeasure;
//    get calories(): ComponentMeasure { return this.#calories; }
//    set calories(val: ComponentMeasure) { this.#calories = new ComponentMeasure(val); }

//    #fat: ComponentMeasure;
//    get fat(): ComponentMeasure { return this.#fat; }
//    set fat(val: ComponentMeasure) { this.#fat = new ComponentMeasure(val); }

//    #saturatedFat: ComponentMeasure;
//    get saturatedFat(): ComponentMeasure { return this.#saturatedFat; }
//    set saturatedFat(val: ComponentMeasure) { this.#saturatedFat = new ComponentMeasure(val); }

//    #transFat: ComponentMeasure;
//    get transFat(): ComponentMeasure { return this.#transFat; }
//    set transFat(val: ComponentMeasure) { this.#transFat = new ComponentMeasure(val); }

//    #cholesterol: ComponentMeasure;
//    get cholesterol(): ComponentMeasure { return this.#cholesterol; }
//    set cholesterol(val: ComponentMeasure) { this.#cholesterol = new ComponentMeasure(val); }

//    #sodium: ComponentMeasure;
//    get sodium(): ComponentMeasure { return this.#sodium; }
//    set sodium(val: ComponentMeasure) { this.#sodium = new ComponentMeasure(val); }

//    #dietaryFiber: ComponentMeasure;
//    get dietaryFiber(): ComponentMeasure { return this.#dietaryFiber; }
//    set dietaryFiber(val: ComponentMeasure) { this.#dietaryFiber = new ComponentMeasure(val); }

//    #sugar: ComponentMeasure;
//    get sugar(): ComponentMeasure { return this.#sugar; }
//    set sugar(val: ComponentMeasure) { this.#sugar = new ComponentMeasure(val); }

//    #carbohydrates: ComponentMeasure;
//    get carbohydrates(): ComponentMeasure { return this.#carbohydrates; }
//    set carbohydrates(val: ComponentMeasure) { this.#carbohydrates = new ComponentMeasure(val); }

//    #sugarAlcohol: ComponentMeasure;
//    get sugarAlcohol(): ComponentMeasure { return this.#sugarAlcohol; }
//    set sugarAlcohol(val: ComponentMeasure) { this.#sugarAlcohol = new ComponentMeasure(val); }

//    #protein: ComponentMeasure;
//    get protein(): ComponentMeasure { return this.#protein; }
//    set protein(val: ComponentMeasure) { this.#protein = new ComponentMeasure(val); }

//    #vitaminA: ComponentMeasure;
//    get vitaminA(): ComponentMeasure { return this.#vitaminA; }
//    set vitaminA(val: ComponentMeasure) { this.#vitaminA = new ComponentMeasure(val); }

//    #vitaminB1: ComponentMeasure;
//    get vitaminB1(): ComponentMeasure { return this.#vitaminB1; }
//    set vitaminB1(val: ComponentMeasure) { this.#vitaminB1 = new ComponentMeasure(val); }

//    #vitaminB2: ComponentMeasure;
//    get vitaminB2(): ComponentMeasure { return this.#vitaminB2; }
//    set vitaminB2(val: ComponentMeasure) { this.#vitaminB2 = new ComponentMeasure(val); }

//    #vitaminB6: ComponentMeasure;
//    get vitaminB6(): ComponentMeasure { return this.#vitaminB6; }
//    set vitaminB6(val: ComponentMeasure) { this.#vitaminB6 = new ComponentMeasure(val); }

//    #vitaminB12: ComponentMeasure;
//    get vitaminB12(): ComponentMeasure { return this.#vitaminB12; }
//    set vitaminB12(val: ComponentMeasure) { this.#vitaminB12 = new ComponentMeasure(val); }

//    #vitaminC: ComponentMeasure;
//    get vitaminC(): ComponentMeasure { return this.#vitaminC; }
//    set vitaminC(val: ComponentMeasure) { this.#vitaminC = new ComponentMeasure(val); }

//    #vitaminD: ComponentMeasure;
//    get vitaminD(): ComponentMeasure { return this.#vitaminD; }
//    set vitaminD(val: ComponentMeasure) { this.#vitaminD = new ComponentMeasure(val); }

//    #vitaminE: ComponentMeasure;
//    get vitaminE(): ComponentMeasure { return this.#vitaminE; }
//    set vitaminE(val: ComponentMeasure) { this.#vitaminE = new ComponentMeasure(val); }

//    #calcium: ComponentMeasure;
//    get calcium(): ComponentMeasure { return this.#calcium; }
//    set calcium(val: ComponentMeasure) { this.#calcium = new ComponentMeasure(val); }

//    #iron: ComponentMeasure;
//    get iron(): ComponentMeasure { return this.#iron; }
//    set iron(val: ComponentMeasure) { this.#iron = new ComponentMeasure(val); }

//    #potassium: ComponentMeasure;
//    get potassium(): ComponentMeasure { return this.#potassium; }
//    set potassium(val: ComponentMeasure) { this.#potassium = new ComponentMeasure(val); }

//    #phosporus: ComponentMeasure;
//    get phosporus(): ComponentMeasure { return this.#phosporus; }
//    set phosporus(val: ComponentMeasure) { this.#phosporus = new ComponentMeasure(val); }

//    #magnesium: ComponentMeasure;
//    get magnesium(): ComponentMeasure { return this.#magnesium; }
//    set magnesium(val: ComponentMeasure) { this.#magnesium = new ComponentMeasure(val); }

//    get totalFat(): ComponentMeasure {
//        return ComponentMeasure.sum([
//            this.fat,
//            this.saturatedFat,
//            this.transFat
//        ]);
//    }

//    get totalCarbohydrates(): ComponentMeasure {
//        return ComponentMeasure.sum([
//            this.carbohydrates,
//            this.dietaryFiber,
//            this.sugar,
//            this.sugarAlcohol
//        ]);
//    }

//    calculateForServings(servings: number): Nutrition {
//        let data = {};
//        let props = Object.getPropertyNamesOnly(Nutrition.prototype);
//        for (let k = 0; k < props.length; k++) {
//            let prop = props[k],
//                source = this[prop];

//            data[prop] = new ComponentMeasure({ units: source.units, amount: source.amount * servings });
//        }
//        return new Nutrition(data);
//    }

//    static sum(nutritions: Nutrition[]): Nutrition {
//        if (!!nutritions && Array.isArray(nutritions)) {
//            if (nutritions.length === 0) return new Nutrition();
//            let combined = new Nutrition(nutritions[0]);
//            for (let i = 1; i < nutritions.length; i++) {
//                combined = combined.add(nutritions[i]);
//            }
//            return combined;
//        }
//        else {
//            throw "Invalid operation - [nutritions] must be an array of NutritionData";
//        }
//    }

//    add(item: Nutrition): Nutrition {
//        let comb = new Nutrition(this);
//        let props = Object.getPropertyNamesOnly(Nutrition.prototype);
//        for (let k = 0; k < props.length; k++) {
//            let prop = props[k],
//                current = comb[prop],
//                source = item[prop];

//            if (current instanceof ComponentMeasure && source instanceof ComponentMeasure) {
//                current.add(source.units, source.amount);
//            }
//        }
//        return comb;
//    }
//};

//Nutrition.prototype.toString = function () {
//    let props = Object.getPropertyNamesOnly(Nutrition.prototype);
//    let str = "";
//    for (let i = 0; i < props.length; i++) {
//        let prop = props[i],
//            value = this[prop];
//        str += str == "" ? "" : ", ";
//        str += prop + " : " + value.toString();
//    }
//    return str;
//}

//export class Ingredient {
//    constructor(data?) {
//        data = data || {};
//        this.name = data.name;
//        this.nutrition = data.nutrition;
//        this.servingSize = data.servingSize;
//    }

//    #name: string;
//    get name(): string { return this.#name; }
//    set name(val: string) { this.#name = val || ""; }

//    #nutrition: Nutrition;
//    get nutrition(): Nutrition { return this.#nutrition; }
//    set nutrition(val: Nutrition) { this.#nutrition = new Nutrition(val); }

//    #servingSize: ComponentMeasure;
//    get servingSize(): ComponentMeasure { return this.#servingSize; }
//    set servingSize(val: ComponentMeasure) { this.#servingSize = new ComponentMeasure(val); }


//};

//export class DishIngredient extends Ingredient {
//    constructor(data?, servings?: number | string) {
//        super(data || {});
//        data = data || {};
//        this.servings = data.servings || servings;
//    }

//    #servings: number;
//    get servings(): number { return this.#servings; }
//    set servings(val: number) { this.#servings = Number.parseFloat(val as any) || 1; }

//    get amount(): string { return (this.servings * this.servingSize.amount).toString() + " " + this.servingSize.units; }
//    static getAmounts(dishIngredients: DishIngredient[]): IIngredientSummaryItem[] {
//        let amounts = {};
//        for (let i = 0; i < dishIngredients.length; i++) {
//            let d = dishIngredients[i];
//            let a = amounts[d.name] = amounts[d.name] || { amount: 0, units: d.servingSize.units };
//            a.amount += d.servings * d.servingSize.amount;
//        }
//        let keys = Object.keys(amounts);
//        let sums = [] as IIngredientSummaryItem[];
//        for (let k = 0; k < keys.length; k++) {
//            sums.push({ name: keys[k], amount: amounts[keys[k]].amount, units: amounts[keys[k]].units });
//        }
//        return sums;
//    }

//    getServingNutrition() {
//        return this.nutrition.calculateForServings(this.servings);
//    }


//}

//export interface IIngredientSummaryItem {
//    name: string;
//    amount: number;
//    units: string;
//}

//export class Dish {
//    constructor(data?) {
//        data = data || {};
//        this.name = data.name;
//        this.#ingredients = data.ingredients || [];
//    }

//    #name: string;
//    get name(): string { return this.#name; }
//    set name(val: string) { this.#name = val || ""; }

//    #ingredients: DishIngredient[];
//    get ingredients(): DishIngredient[] { return this.#ingredients; }

//    getNutrition(): Nutrition {
//        if (this.ingredients && Array.isArray(this.ingredients) && this.ingredients.length > 0) {
//            let comb = new Nutrition(this.ingredients[0].nutrition);
//            for (let i = 1; i < this.ingredients.length; i++) {
//                comb = comb.add(this.ingredients[i].nutrition);
//            }
//            return comb;
//        }
//        return new Nutrition();
//    }
//};

//export class JournalItem extends Dish {
//    constructor(data?) {
//        super(data);
//        data = data || {};
//        this.servings = data.servings;
//    }

//    #servings: number;
//    get servings(): number { return this.#servings; }
//    set servings(val: number) { this.#servings = Number.parseFloat(val as any) || 1; }

//    getNutrition(): Nutrition {
//        return super.getNutrition().calculateForServings(this.servings);
//    }
//}

////class JournalItem {
////    constructor(data) {
////        data = data || {};
////        this.#dishes = data.dishes || [];
////    }

////    #dishes;
////    get dishes() { return this.#dishes; }

////    getNutrition() {

////        if (this.dishes && Array.isArray(this.dishes) && this.dishes.length > 0) {
////            let comb = new Nutrition(this.dishes[0].getNutrition());
////            for (let i = 1; i < this.dishes.length; i++) {
////                comb.add(this.dishes[i].nutrition);
////            }
////            return comb;
////        }
////        return new Nutrition();
////    }
////}

//export class JournalEntry {
//    constructor(data?) {
//        data = data || {};
//        this.#timestamp = (data.timestamp instanceof Date ? data.timestamp : new Date(data.timeStamp || new Date()));
//        this.#items = data.items || [];
//    }

//    #timestamp: Date;
//    get timestamp(): Date { return this.#timestamp; }

//    #items: JournalItem[];
//    get items(): JournalItem[] { return this.#items; }

//    getNutrition(): Nutrition {

//        if (this.items && Array.isArray(this.items) && this.items.length > 0) {
//            let comb = new Nutrition(this.items[0].getNutrition());
//            for (let i = 1; i < this.items.length; i++) {
//                comb = comb.add(this.items[i].getNutrition());
//            }
//            return comb;
//        }
//        return new Nutrition();
//    }

//    static getNutrition(entries: JournalEntry[]): Nutrition {
//        var nutritions = [];
//        for (var i = 0; i < entries.length; i++) {
//            nutritions.push(entries[i].getNutrition());
//        }
//        return Nutrition.sum(nutritions);
//    }

//    static getIngredients(entries: JournalEntry[]): DishIngredient[] {
//        var ingredients = [] as DishIngredient[];
//        for (var e = 0; e < entries.length; e++) {
//            let entry = entries[e];
//            for (var d = 0; d < entry.items.length; d++) {
//                let item = entry.items[d];
//                for (var i = 0; i < item.ingredients.length; i++) {
//                    ingredients.push(item.ingredients[i]);
//                }
//            }
//        }
//        return ingredients;
//    }

//    static getRange(array: JournalEntry[], startDate: Date, endDate: Date): JournalEntry[] {
//        return array.filter(je =>
//            je.timestamp.getTime() >= startDate.getTime() &&
//            je.timestamp.getTime() <= endDate.getTime());
//    }
//    static ingredientAmountToString(item): string {
//        return item.name + " " + item.amount + " " + item.units;
//    }
//}




//export let InitialIngredients = [
//    new Ingredient({
//        name: "think! High Protein Bars (Chunky Peanut Butter) 60g bar",
//        servingSize: { units: Units.bar, amount: 1 },
//        nutrition: {
//            calories: { units: Units.Calories, amount: 240 },
//            fat: { units: Units.grams, amount: 7 },
//            saturatedFat: { units: Units.grams, amount: 3 },
//            transFat: { units: Units.grams, amount: 0 },
//            cholesterol: { units: Units.milligrams, amount: 0 },
//            sodium: { units: Units.milligrams, amount: 220 },
//            dietaryFiber: { units: Units.grams, amount: 1 },
//            carbohydrates: { units: Units.grams, amount: 12 },
//            sugar: { units: Units.grams, amount: 0 },
//            sugarAlcohol: { units: Units.grams, amount: 10 },
//            protein: { units: Units.grams, amount: 20 },
//            vitaminD: { units: Units.milligrams, amount: 0 },
//            calcium: { units: Units.milligrams, amount: 120 },
//            iron: { units: Units.milligrams, amount: 1.5 },
//            potassium: { units: Units.milligrams, amount: 130 },
//            phosphorus: { units: Units.milligrams, amount: 0 },
//            magnesium: { units: Units.milligrams, amount: 0 },
//        }
//    }),
//    new Ingredient({
//        name: "Medi Calcium 4 Blend",
//        servingSize: { units: Units.tablet, amount: 1 },
//        nutrition: {
//            calories: { units: Units.Calories, amount: 0 },
//            fat: { units: Units.grams, amount: 0 },
//            saturatedFat: { units: Units.grams, amount: 0 },
//            transFat: { units: Units.grams, amount: 0 },
//            cholesterol: { units: Units.milligrams, amount: 0 },
//            sodium: { units: Units.milligrams, amount: 0 },
//            dietaryFiber: { units: Units.grams, amount: 0 },
//            carbohydrates: { units: Units.grams, amount: 0 },
//            sugar: { units: Units.grams, amount: 0 },
//            sugarAlcohol: { units: Units.grams, amount: 0 },
//            protein: { units: Units.grams, amount: 0 },
//            vitaminD: { units: Units.milligrams, amount: 10 },
//            calcium: { units: Units.milligrams, amount: 500 },
//            iron: { units: Units.milligrams, amount: 0 },
//            potassium: { units: Units.milligrams, amount: 0 },
//            phosphorus: { units: Units.milligrams, amount: 34 },
//            magnesium: { units: Units.milligrams, amount: 150 },
//        }
//    }),
//    new Ingredient({
//        name: "Medi Fat Burner",
//        servingSize: { units: Units.tablet, amount: 2 },
//        nutrition: {
//            calories: { units: Units.Calories, amount: 0 },
//            fat: { units: Units.grams, amount: 0 },
//            saturatedFat: { units: Units.grams, amount: 0 },
//            transFat: { units: Units.grams, amount: 0 },
//            cholesterol: { units: Units.milligrams, amount: 0 },
//            sodium: { units: Units.milligrams, amount: 0 },
//            dietaryFiber: { units: Units.grams, amount: 0 },
//            carbohydrates: { units: Units.grams, amount: 0 },
//            sugar: { units: Units.grams, amount: 0 },
//            sugarAlcohol: { units: Units.grams, amount: 0 },
//            protein: { units: Units.grams, amount: 0 },
//            vitaminD: { units: Units.milligrams, amount: 0 },
//            calcium: { units: Units.milligrams, amount: 265 },
//            iron: { units: Units.milligrams, amount: 0 },
//            potassium: { units: Units.milligrams, amount: 0 },
//            phosphorus: { units: Units.milligrams, amount: 0 },
//            magnesium: { units: Units.milligrams, amount: 0 },
//        }
//    }),
//    new Ingredient({
//        name: "Medi Inner Balance",
//        servingSize: { units: Units.tablet, amount: 2 },
//        nutrition: {
//            calories: { units: Units.Calories, amount: 0 },
//            fat: { units: Units.grams, amount: 0 },
//            saturatedFat: { units: Units.grams, amount: 0 },
//            transFat: { units: Units.grams, amount: 0 },
//            cholesterol: { units: Units.milligrams, amount: 0 },
//            sodium: { units: Units.milligrams, amount: 0 },
//            dietaryFiber: { units: Units.grams, amount: 0 },
//            carbohydrates: { units: Units.grams, amount: 0 },
//            sugar: { units: Units.grams, amount: 0 },
//            sugarAlcohol: { units: Units.grams, amount: 0 },
//            protein: { units: Units.grams, amount: 0 },
//            vitaminD: { units: Units.milligrams, amount: 0 },
//            calcium: { units: Units.milligrams, amount: 0 },
//            iron: { units: Units.milligrams, amount: 0 },
//            potassium: { units: Units.milligrams, amount: 0 },
//            phosphorus: { units: Units.milligrams, amount: 0 },
//            magnesium: { units: Units.milligrams, amount: 15 },
//        }
//    }),
//    new Ingredient({
//        name: "Medi Vita Super",
//        servingSize: { units: Units.tablet, amount: 1 },
//        nutrition: {
//            calories: { units: Units.Calories, amount: 0 },
//            fat: { units: Units.grams, amount: 0 },
//            saturatedFat: { units: Units.grams, amount: 0 },
//            transFat: { units: Units.grams, amount: 0 },
//            cholesterol: { units: Units.milligrams, amount: 0 },
//            sodium: { units: Units.milligrams, amount: 0 },
//            dietaryFiber: { units: Units.grams, amount: 0 },
//            carbohydrates: { units: Units.grams, amount: 0 },
//            sugar: { units: Units.grams, amount: 0 },
//            sugarAlcohol: { units: Units.grams, amount: 0 },
//            protein: { units: Units.grams, amount: 0 },
//            vitaminA: { units: Units.milligrams, amount: 1500 },
//            vitaminB1: { units: Units.milligrams, amount: 20 },
//            vitaminB2: { units: Units.milligrams, amount: 0 },
//            vitaminB6: { units: Units.milligrams, amount: 25 },
//            vitaminB12: { units: Units.milligrams, amount: 75 },
//            vitaminC: { units: Units.milligrams, amount: 150 },
//            vitaminD: { units: Units.milligrams, amount: 10 },
//            vitaminE: { units: Units.milligrams, amount: 18 },
//            calcium: { units: Units.milligrams, amount: 45 },
//            iron: { units: Units.milligrams, amount: 5.8 },
//            potassium: { units: Units.milligrams, amount: 99 },
//            phosphorus: { units: Units.milligrams, amount: 36 },
//            magnesium: { units: Units.milligrams, amount: 100 },
//        }
//    }),
//    new Ingredient({
//        name: "Medi Enteric-Coated Omega 3",
//        servingSize: { units: Units.softGel, amount: 1 },
//        nutrition: {
//            calories: { units: Units.Calories, amount: 10 },
//            fat: { units: Units.grams, amount: 1 },
//            saturatedFat: { units: Units.grams, amount: 0 },
//            transFat: { units: Units.grams, amount: 0 },
//            cholesterol: { units: Units.milligrams, amount: 0 },
//            sodium: { units: Units.milligrams, amount: 0 },
//            dietaryFiber: { units: Units.grams, amount: 0 },
//            carbohydrates: { units: Units.grams, amount: 0 },
//            sugar: { units: Units.grams, amount: 0 },
//            sugarAlcohol: { units: Units.grams, amount: 0 },
//            protein: { units: Units.grams, amount: 0 },
//            vitaminA: { units: Units.milligrams, amount: 0 },
//            vitaminB1: { units: Units.milligrams, amount: 0 },
//            vitaminB2: { units: Units.milligrams, amount: 0 },
//            vitaminB6: { units: Units.milligrams, amount: 0 },
//            vitaminB12: { units: Units.milligrams, amount: 0 },
//            vitaminC: { units: Units.milligrams, amount: 0 },
//            vitaminD: { units: Units.milligrams, amount: 0 },
//            vitaminE: { units: Units.milligrams, amount: 0 },
//            calcium: { units: Units.milligrams, amount: 0 },
//            iron: { units: Units.milligrams, amount: 0 },
//            potassium: { units: Units.milligrams, amount: 0 },
//            phosphorus: { units: Units.milligrams, amount: 0 },
//            magnesium: { units: Units.milligrams, amount: 0 },
//        }
//    }),
//];

//export let InitialMeals = [
//    new JournalItem({
//        name: "Morning Vitamins",
//        serving: 1,
//        ingredients: [
//            new DishIngredient(InitialIngredients[5], 1),
//            new DishIngredient(InitialIngredients[1], 1),
//            new DishIngredient(InitialIngredients[3], .5),
//            new DishIngredient(InitialIngredients[4], 1),
//        ]
//    }),
//    new JournalItem({
//        name: "Lunch Vitamins",
//        serving: 1,
//        ingredients: [
//            new DishIngredient(InitialIngredients[5], 1),
//            new DishIngredient(InitialIngredients[1], 1),
//            new DishIngredient(InitialIngredients[2], .5),
//        ]
//    }),
//    new JournalItem({
//        name: "Dinner Vitamins",
//        serving: 1,
//        ingredients: [
//            new DishIngredient(InitialIngredients[5], 1),
//            new DishIngredient(InitialIngredients[2], .5),
//            new DishIngredient(InitialIngredients[3], .5),
//        ]
//    }),
//    new JournalItem({
//        name: "Bar Snack",
//        serving: 1,
//        ingredients: [
//            new DishIngredient(InitialIngredients[0], .5),
//        ]
//    }),
//];
