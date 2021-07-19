
var matched = require('matched');
const path = require('path');
const fs = require('fs');


/**
 * 如果是绝对路径，查找设置的baseUrl和path映射，找到这个文件
 * @param {string} tscUrl 当前执行路径
 * @param {string} id 
 */
function getImpAbsFile(tscUrl ,tsconfig, id) {
    let options = tsconfig.compilerOptions;

    function toTS(url) {
        var ext = path.extname(url).toLowerCase();
        if (ext == '') url += '.ts';
        return url;
    }

    if (options.baseUrl) {
        let url = toTS(path.join(tscUrl, options.baseUrl, id));
        try {
            fs.accessSync(url, fs.constants.F_OK);
            return url;
        } catch (e) { }
    }
    if (options.paths) {
        for (let m in options.paths) {
            let cp = options.paths[m];
            if (m.endsWith('/*')) {
                // 是目录
                let m1 = m.substr(0, m.length - 2);
                if (id.startsWith(m1)) {
                    // 匹配上了
                    let n = cp.length;
                    for (let i = 0; i < n; i++) {
                        let p1 = cp[i];
                        if (p1.endsWith('/*')) {
                            // 用
                            let url = toTS(path.join(tscUrl, p1.substr(0, p1.length - 2), id.substr(m.length - 1)));// dist/jsout, ur/* - /*, id前减去ui/
                            try {
                                fs.accessSync(url, fs.constants.F_OK);
                                return url;
                            } catch (e) { }
                        }
                    }

                }
            } else {
                if (m == id) {
                    return toTS(path.join(tscUrl, cp[0]));
                }
            }
        }
    }
}
exports.getImpAbsFile = getImpAbsFile;
