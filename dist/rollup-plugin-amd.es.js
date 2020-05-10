import convert from '@buxlabs/amd-to-es6';
import { createFilter } from 'rollup-pluginutils';

var firstpass = /\b(?:define)\b/;
var importStatement = /\b(import .*['"])(.*)(['"].*\n)/g;

function index(options) {
    if ( options === void 0 ) options = {};

    var filter = createFilter( options.include, options.exclude );

    return {
        name: 'amd',

        transform: function transform (code, id) {
            if ( !filter( id ) ) { return; }
            if ( !firstpass.test( code ) ) { return; }

            var transformed = convert(code, options.converter);
            if (options.rewire) {
                transformed = transformed.replace(importStatement, function (match, begin, moduleId, end) {
                    return ("" + begin + (options.rewire(moduleId, id).split('\\').join('\\\\') || moduleId) + end);
                });
            }

            return transformed;
        }
    };
}

export default index;
//# sourceMappingURL=rollup-plugin-amd.es.js.map