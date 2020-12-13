import cells from "./cells";
import cell from "./cell";

export default [
  { method: "GET", path: "/cells", handler: cells },
  { method: "GET", path: "/cells/{id}", handler: cell },
];
