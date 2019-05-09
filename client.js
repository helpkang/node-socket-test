var net = require('net');
var sleep = require('await-sleep')

function getConnection() {
    return new Promise((resolve, reject) => {
        try {
            var socket = net.createConnection({ path: "\\\\.\\pipe\\berith_test.ipc" });
            socket.on('connect', function () {
                console.log('connected to server!');
                socket.rdata = ""
                resolve(socket)
                // 1000ms의 간격으로 banana hong을 서버로 요청
            });
        } catch (error) {
            reject(error)
        }

    })
}

function read(socket) {
    return new Promise((resolve)=>{
        socket.resolve = resolve
        if (!socket.onData) {
            socket.onData = 1
            socket.on('data', function (chunk) {
                socket.resolve(String(chunk))
            })
        }
    })
}

async function start() {
    var socket = await getConnection()
    // 서버로부터 받은 데이터를 화면에 출력

    // 접속이 종료됬을때 메시지 출력
    socket.on('end', function () {
        console.log('disconnected.');
    });
    // 에러가 발생할때 에러메시지 화면에 출력
    socket.on('error', function (err) {
        console.log(err);
    });
    // connection에서 timeout이 발생하면 메시지 출력
    socket.on('timeout', function () {
        console.log('connection timeout.');
    });

    for (var i=0; i<1000000; i++) {
        socket.write(i+': banana hong!');
        var data= await read(socket)
        console.log('data', data)
        await sleep(1000)
    }
}



start()