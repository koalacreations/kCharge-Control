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
exports.CellType = void 0;
/* eslint-disable import/prefer-default-export */
const typeorm_1 = require("typeorm");
const Cell_1 = require("./Cell");
let CellType = class CellType extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], CellType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CellType.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: () => Math.floor(new Date().getTime() / 1000) }),
    __metadata("design:type", Number)
], CellType.prototype, "created", void 0);
__decorate([
    typeorm_1.OneToMany(() => Cell_1.Cell, (cell) => cell.cellType),
    __metadata("design:type", Array)
], CellType.prototype, "cells", void 0);
CellType = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(["id"])
], CellType);
exports.CellType = CellType;
//# sourceMappingURL=CellType.js.map