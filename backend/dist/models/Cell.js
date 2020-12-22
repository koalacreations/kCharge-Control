"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
const typeorm_1 = require("typeorm");
const CellType_1 = require("./CellType");
let Cell = 
// eslint-disable-next-line import/export
class Cell extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Cell.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Cell.prototype, "state", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Cell.prototype, "class", void 0);
__decorate([
    typeorm_1.ManyToOne(() => CellType_1.CellType, (cellType) => cellType.cells, {
        eager: true,
    }),
    __metadata("design:type", CellType_1.CellType)
], Cell.prototype, "cellType", void 0);
__decorate([
    typeorm_1.Column({ default: () => Math.floor(new Date().getTime() / 1000) }),
    __metadata("design:type", Number)
], Cell.prototype, "created", void 0);
Cell = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(["id"])
    // eslint-disable-next-line import/export
], Cell);
exports.Cell = Cell;
// eslint-disable-next-line no-redeclare, import/export
(function (Cell) {
    // eslint-disable-next-line no-shadow
    let CellState;
    (function (CellState) {
        CellState["New"] = "new";
        CellState["Charging"] = "charging";
        CellState["Charged"] = "charged";
        CellState["Discharging"] = "discharging";
        CellState["Discharged"] = "discharged";
        CellState["Discard"] = "discard";
    })(CellState = Cell.CellState || (Cell.CellState = {}));
    // eslint-disable-next-line no-shadow
    let CellClass;
    (function (CellClass) {
        CellClass["Normal"] = "normal";
        CellClass["Heater"] = "heater";
    })(CellClass = Cell.CellClass || (Cell.CellClass = {}));
})(Cell = exports.Cell || (exports.Cell = {}));
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map