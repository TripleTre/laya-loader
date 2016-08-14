module.exports = function (context) {
  var cptName = this.resource.match(/\\([A-Z]\w+)LayaComponent.ts$/)[1];
  return context + `
    declare var module;
    declare var require;
    var app = require('../../laya/src').default;
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(function(data) {
            app.clearCptAllData(${cptName});
            var curSence = app.getCurSence();
            var vm = app.componentDataMap;
            var cl = new Map();
            var keys = vm.keys();
            var next;
            while (next = keys.next(), !next.done) {
                var ineMap = vm.get(next.value);
                var ineRet = new Map();
                var ineKeys = ineMap.keys();
                var ineNext;
                var i = 0;
                while (ineNext = ineKeys.next(), !ineNext.done) {
                    ineRet.set(i++, ineMap.get(ineNext.value));
                }
                cl.set(next.value, ineRet);
            }
            setTimeout(() => {
                app.buildSence(curSence, app.sence.get(curSence), cl, [${cptName}]);
            }, 32);
        });
    }
  `
}
