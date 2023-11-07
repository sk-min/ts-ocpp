"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessageResponse = exports.validateMessageRequest = void 0;
const errors_1 = require("../errors");
const purify_ts_1 = require("purify-ts");
const jsonschema_1 = require("jsonschema");
const validateMessage = (type, action, body, acceptedActions) => {
    if (!acceptedActions.includes(action))
        return purify_ts_1.Left(new errors_1.ValidationError('action is not valid'));
    const schema = require(`./json/${type}/${action}.json`);
    const result = jsonschema_1.validate(body, schema);
    if (!result.valid)
        return purify_ts_1.Left(new errors_1.ValidationError(`jsonschema errors: ${result.errors.map(err => err.toString())}`));
    return purify_ts_1.Right({
        action,
        ocppVersion: 'v1.6-json',
        ...body
    });
};
const validateMessageRequest = (action, body, acceptedActions) => validateMessage('request', action, body, acceptedActions);
exports.validateMessageRequest = validateMessageRequest;
const validateMessageResponse = (action, body, acceptedActions) => validateMessage('response', action, body, acceptedActions);
exports.validateMessageResponse = validateMessageResponse;
//# sourceMappingURL=validation.js.map