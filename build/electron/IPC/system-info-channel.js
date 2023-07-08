"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class SystemInfoChannel {
    getName() {
        return 'system-info';
    }
    handle(_event, _request) {
        if (!_request.responseChannel) {
            _request.responseChannel = `${this.getName()}_response`;
        }
        _event.sender.send(_request.responseChannel, { kernel: child_process_1.execSync('systeminfo').toString() });
    }
}
exports.default = SystemInfoChannel;
//# sourceMappingURL=system-info-channel.js.map