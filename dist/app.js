"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const morgan_1 = __importDefault(require("morgan"));
const method_override_1 = __importDefault(require("method-override"));
const isProduction = process.env.NODE_ENV === 'production';
// Create global app object
const app = express_1.default();
app.use(cors_1.default());
// Normal express config defaults
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(method_override_1.default());
app.use(express_1.default.static(__dirname + '/public'));
app.use(express_session_1.default({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
if (!isProduction) {
    app.use(errorhandler_1.default());
}
// Models
// require('./models/PlayerProfile');
//
// require('./models/User');
// require('./models/Article');
// require('./models/Comment');
// require('./config/passport');
/**
 * Router Definition
 */
exports.expressRouter = express_1.default.Router();
const routes_1 = __importDefault(require("./routes"));
app.use(routes_1.default);
class ErrorImpl {
}
/// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new ErrorImpl();
    err.status = 404; // using response here
    next(err);
});
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status);
    res.json({
        message: err.message,
        error: err
    });
});
// finally, let's start our server...
const server = app.listen(process.env.PORT || 8080, () => {
    const { port } = server.address();
    console.log('Listening on port ' + port);
    if (!isProduction) {
        console.log('Listening on port http://localhost:' + port);
    }
});
//# sourceMappingURL=app.js.map