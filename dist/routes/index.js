"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const rootRouter = app_1.expressRouter.get('/ping', (req, res, next) => {
    return res.json({ hello: "world!" });
});
exports.default = rootRouter;
//# sourceMappingURL=index.js.map