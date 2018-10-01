import {delay} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs/internal/Observable';
import * as fs from 'fs';
import * as path from 'path';
import {exec} from 'child_process';

export class Runner {
    private timeout = 20;
    private container = 'jscontainer';

    constructor(private folder, private path, private language, private code) {
    }

 runner(data) {
    return data;
 }

 static random(size) {
        return require("crypto").randomBytes(size).toString('hex');
 }
 exec(lang) {
        return this.prepare()
            .then(() => this.runContainer(lang))
            .catch((text) => text)
 }

 private runContainer(lang) {
         let command = '';
        if (lang == 'js') {
            command = 'node';
        }
        else if(lang == 'py') {
            command = 'python';
        }

        const dockertimeoutLocation = path.join(this.path,'/../../containers/shared/dockertimeout.sh');
        const otherLocation = path.join(this.path,'../../',this.folder);

        return new Promise((resolve,reject) => {
            //console.log(`${dockertimeoutLocation} 20s -i -t -v  "${otherLocation}":/usercode virtual_machine /usercode/script.sh node script.js`);
            exec(`${dockertimeoutLocation} 20s -i -t -v  ${otherLocation}:/usercode node /usercode/script.sh ${command} script.js`,(err, stdout, stderr) => {
                if (err) {
                    console.error('err ====>', err);
                    if (fs.readFile(path.join(this.path,'../../',this.folder,'completed'), "utf8", (err,data) => {
                        if (err) throw err;
                        else {
                            if (data) {
                                    // console.log(data);
                                    resolve({text: 'Success', output: data});
                                } else {
                                    reject({text: 'Fail', output: fs.readFileSync(path.join(this.path,'../../',this.folder,'errors'),'utf8')});
                            }
                        }
                    }))
                    return;
                }
                console.log('stdout ====>', stdout);
            });
        })
    }

 private prepare() {
        return new Promise((resolve,reject) => {

            const fullPath = path.join(this.path,'../../',this.folder);
            const filename = 'script.js';
            const sharedScript = path.join(this.path,'../../containers/shared/script.sh');


            fs.mkdir(fullPath, '0777',  (err) =>  {
                if (err) {
                    console.log(err);
                }
                else {
                        fs.writeFile(fullPath+'/'+filename,this.code,(err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`${this.language} file was saved!`);
                                exec("chmod 0777 "+fullPath+"/"+filename+"")
                            }
                        });

                        fs.copyFile(sharedScript,fullPath+'/script.sh', () => {
                            exec(`chmod +x ${fullPath}/script.sh`);
                            console.log(fullPath);
                        });
                }
            });

            resolve(fullPath);
        });
 }


 static run(language, code):Promise<any> {
     const folder = 'temp/' + Runner.random(10);
     const path = process.cwd();
     const runner = new Runner(folder, path, language, code);
     return runner.exec(runner.language);

    }
}
