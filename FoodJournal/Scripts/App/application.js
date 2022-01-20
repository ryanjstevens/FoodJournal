//import { JournalReportControl } from "./controls";
//import { Dish, Ingredient, InitialIngredients, InitialMeals, JournalEntry, Nutrition, Units } from "./data";
//export class Application {
//    ingredients: Ingredient[] = [];
//    journalEntries: JournalEntry[] = [];
//    dishes: Dish[] = [];
//    units: string[] = [];
//    constructor(configuration?) {
//        this.getIngredients();
//        this.getDishes();
//        this.getJournal();
//        this.units = Object.keys(Units);
//        this.journalEntries.push(
//            new JournalEntry({
//                items: [
//                    InitialMeals[0]
//                ]
//            })
//        );
//        this.journalEntries.push(
//            new JournalEntry({
//                items: [
//                    InitialMeals[3]
//                ]
//            })
//        );
//        this.displayJournalSelection();
//    }
//    getIngredients() {
//        let raw = JSON.parse(localStorage.getItem("ingredients")) || InitialIngredients;
//        this.ingredients = [];
//        if (Array.isArray(raw)) {
//            raw.forEach(i => this.ingredients.push(new Ingredient(i)));
//        }
//    }
//    saveIngredients() {
//        localStorage.setItem("ingredients", JSON.stringify(this.ingredients));
//    }
//    getDishes() {
//        let raw = JSON.parse(localStorage.getItem("dishes")) || [];
//        this.ingredients = [];
//        if (Array.isArray(raw)) {
//            raw.forEach(i => this.dishes.push(new Dish(i)));
//        }
//    }
//    saveDishes() {
//        localStorage.setItem("dishes", JSON.stringify(this.dishes));
//    }
//    getJournal() {
//        let raw = JSON.parse(localStorage.getItem("journal")) || [];
//        this.ingredients = [];
//        if (Array.isArray(raw)) {
//            raw.forEach(i => this.journalEntries.push(new JournalEntry(i)));
//        }
//    }
//    saveJournal() {
//        localStorage.setItem("journal", JSON.stringify(this.journalEntries));
//    }
//    // #region Views
//    get $display(): JQuery { return $('#display'); }
//    journalReport: JournalReportControl = null;
//    displayJournalSelection() {
//        let self = this;
//        console.log("displayJournalSelection");
//        try {
//            self.$display.empty();
//            self.journalReport = $('<div>', { id: 'journalreport' })
//                .appendTo(self.$display)
//                .attr("id", "journalreport")
//                .journalJournalReportControl({
//                    allJournalEntries: self.journalEntries,
//                    units: self.units,
//                    ingredients: [],
//                    nutrition: new Nutrition(),
//                    startDate: new Date('1/1/2021'),
//                    endDate: new Date(),
//                    id: 'journalreport'
//                })
//                .data(JournalReportControl.GROUP_DATA);
//        } catch (ex) {
//            console.log(ex);
//        }
//    }
//    // #endregion
//}
//# sourceMappingURL=application.js.map