"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class SystemInfoChannel {
    getName() {
        return 'system-info';
    }
    handle(event, request) {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        event.sender.send(request.responseChannel, { kernel: (0, child_process_1.execSync)('uname -a').toString() });
    }
}
exports.default = SystemInfoChannel;
//# sourceMappingURL=system-info-channel.js.map