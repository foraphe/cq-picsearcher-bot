import { jsonc } from 'jsonc';
import { resolve } from 'path';

const CONFIG_PATH = resolve(__dirname, '../../extendConfig.jsonc');

function load() {
    try {
        return jsonc.readSync(CONFIG_PATH);
    }
    catch (e) {
        console.log("ERROR: 读取扩展指令配置文件出错");
        return { error: true };
    }
}

module.exports = { load }