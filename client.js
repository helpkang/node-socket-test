var net = require('net');
var sleep = require('await-sleep')
module.exports = class PromiseSocket {

    constructor(){
        this.data = null;
        this.socket = null;
        this.resolve = null;
        this.reject = null;
    }

    connect(...params) {
        return new Promise((resolve, reject) => {
            try {
                this.socket = net.createConnection(...params);
                const socket = this.socket
                socket.on('connect',  () => {
                    console.log('connected to server!');
                    resolve(true)
                });

                socket.on('end',  () =>  {
                    console.log('disconnected.');
                });
                // 에러가 발생할때 에러메시지 화면에 출력
                socket.on('error',  (err) => {
                    console.log(err);
                });
                // connection에서 timeout이 발생하면 메시지 출력
                socket.on('timeout',  ()=> {
                    resolve(new Error("time occure!"))
                });
                socket.on('data',  (chunk)=> {
                    if(!this.resolve){
                        console.log('data', String(chunk))
                        this.data = String(chunk);
                        return;
                    }
                    this.resolve(String(chunk))
                    this.resove = null
                    this.reject = null
                })
            } catch (error) {
                reject(error)
            }

        })
    }



    read() {
        return new Promise((resolve, reject) => {
            if(this.data) {
                resolve(this.data)
                this.data = null;
                return;
            }
            this.resolve = resolve
            this.reject = reject
        })
    }

    write(data){
        return new Promise((resolve, reject)=>{
            this.socket.write(data, (error)=>{
                if(error) reject(error)
                resolve(true)
            })
        })
    }

}
