import http from 'http';
import { CsgoEventHandler } from './event_handler/event_handler.js';
import { Auth, Data } from './data.js';
import { CsgoEvent } from './event_handler/csgo_events/event_type.js';

/**
 * @param {number} port 服务器端口
 * @param {string} host 服务器地址
 * @param {string} observeSteamId 所监听用户的steamid，当为undefined时监听所有用户
 */
interface CsgoServerParam {
    /* 服务器端口 */
    port: number,
    /* 服务器地址 */
    host?: string,
    /* 所监听用户的steamid，当为undefined时监听所有用户 */
    observeSteamId?: string,
    /* 安全验证 */
    auth?: Auth
}

export default class CsgoServer {
    port: number;
    host?: string = '127.0.0.1';
    server?: http.Server;
    handler: CsgoEventHandler;
    body: string;
    auth?: Auth;

    /**
     * @constructor
     * @param {CsgoServerParam} params
     */
    constructor(params: CsgoServerParam) {
        this.port = params.port;
        this.host = params.host ?? '127.0.0.1';
        this.auth = params.auth;
        this.handler = new CsgoEventHandler(params.observeSteamId);
        this.server = null;
        this.body = '';
    }

    setHandler(events: CsgoEvent[]) {
        this.handler.setEvents(events);
    }

    start() {
        if (!this.port) throw ('port cannot be empty');
        if (this.server) return;

        this.server = http.createServer((req, res) => {
            this.createServer(req, res);
        })
        this.server.listen(this.port, this.host);
        console.log(`csgo server on: listening to http://${this.host}:${this.port}`);
    }

    // 处理csgo发来的信息，csgo是一股脑的向程序发送post来达到数据实时，就很mmp —— Sonic853
    createServer(req: http.IncomingMessage, res: http.ServerResponse) {
        if (req.method == 'POST') {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            let body = ''
            req.on('data', (data) => {
                body += data
            })
            req.on('end', () => {
                if (typeof body === 'string') {
                    // 判断发来的数据是否有更新
                    if (this.body != body) {
                        this.body = body
                        const response: Data = JSON.parse(body)
                        if (this.auth && response.auth && this.auth.token != response.auth.token) {
                            console.log('Authorization Failed.');
                            res.end('');
                            return;
                        }
                        this.handler.handleData(response);
                        // console.log('POST payload: ', response)
                    }
                }
                res.end('');
            })
        }
        else {
            console.log('Not expecting other request types...')
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end('<html><body>HTTP Server at http://' + this.host + ':' + this.port + '</body></html>')
        }
    }
}