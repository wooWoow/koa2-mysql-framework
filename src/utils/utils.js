var child = require("child_process");

class utils {
   /**
    * 执行命令
    * @param {*} script
    */
   static doExec(script) {
      return new Promise((resolve, reject) => {
        child.exec(script, function (
          err,
          sto
        ) {
          if (sto) {
            resolve(sto);
          } else if (err) {
            reject(err);
          }
        });
      });
    }
}

export default utils