"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@heroku-cli/command");
const core_1 = require("@oclif/core");
const vpn_connections_1 = require("../../../lib/spaces/vpn-connections");
const tsheredoc_1 = require("tsheredoc");
class Config extends command_1.Command {
    async run() {
        const { flags, args } = await this.parse(Config);
        const { space, json } = flags;
        const { name } = args;
        const { body: vpnConnection } = await this.heroku.get(`/spaces/${space}/vpn-connections/${name}`);
        if (json) {
            core_1.ux.styledJSON(vpnConnection);
        }
        else {
            (0, vpn_connections_1.displayVPNConfigInfo)(space, name, vpnConnection);
        }
    }
}
exports.default = Config;
Config.topic = 'spaces';
Config.description = (0, tsheredoc_1.default)(`
    display the configuration information for VPN

    You will use the information provided by this command to establish a Private Space VPN Connection.

    - You must configure your VPN Gateway to use both Tunnels provided by Heroku
    - The VPN Gateway values are the IP addresses of the Private Space Tunnels
    - The Customer Gateway value is the Public IP of your VPN Gateway
    - The VPN Gateway must use the IKE Version shown and the Pre-shared Keys as the authentication method
  `);
Config.example = (0, tsheredoc_1.default)(`
    $ heroku spaces:vpn:config vpn-connection-name --space my-space
    === vpn-connection-name VPN Tunnels
     VPN Tunnel Customer Gateway VPN Gateway    Pre-shared Key Routable Subnets IKE Version
     ────────── ──────────────── ────────────── ────────────── ──────────────── ───────────
     Tunnel 1    104.196.121.200   35.171.237.136  abcdef12345     10.0.0.0/16       1
     Tunnel 2    104.196.121.200   52.44.7.216     fedcba54321     10.0.0.0/16       1
    `);
Config.flags = {
    space: command_1.flags.string({
        required: true,
        char: 's',
        description: 'space the VPN connection belongs to',
    }),
    json: command_1.flags.boolean({ description: 'output in json format' }),
};
Config.args = {
    name: core_1.Args.string({
        required: true,
        description: 'name or id of the VPN connection to retrieve config from',
    }),
};
