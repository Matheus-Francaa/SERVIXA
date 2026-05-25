const Database = require("better-sqlite3");

const tempDb = new Database(":memory:");
const stmt = tempDb.prepare("SELECT 1");
const StmtProto = Object.getPrototypeOf(stmt);
tempDb.close();

const methods = ["all", "get", "run"];

for (const m of methods) {
  const orig = StmtProto[m];
  StmtProto[m] = function (...args) {
    const converted = args.map((a) => {
      if (a === null || a === undefined) return a;
      if (typeof a === "boolean") return a ? 1 : 0;
      if (a instanceof Date) return a.toISOString();
      if (typeof a?.getTime === "function") return a.toISOString();
      return a;
    });
    return orig.call(this, ...converted);
  };
}
