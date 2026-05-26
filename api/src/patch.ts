import Database from "better-sqlite3";

const tempDb = new Database(":memory:");
const stmt = tempDb.prepare("SELECT 1");
const StmtProto = Object.getPrototypeOf(stmt) as Record<string, unknown>;
tempDb.close();

const methods = ["all", "get", "run"] as const;

for (const m of methods) {
  const orig = StmtProto[m] as (...args: unknown[]) => unknown;
  StmtProto[m] = function (...args: unknown[]) {
    const converted = args.map((a: unknown) => {
      if (a === null || a === undefined) return a;
      if (typeof a === "boolean") return a ? 1 : 0;
      if (a instanceof Date) return a.toISOString();
      if (typeof (a as Date)?.getTime === "function") return (a as Date).toISOString();
      return a;
    });
    return orig.call(this, ...converted);
  };
}
