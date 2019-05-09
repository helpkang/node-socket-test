var PromiseSocket = require("./client")

async function start() {
    const ps = new PromiseSocket();
    await ps.connect({ path: "\\\\.\\pipe\\berith_test.ipc" })   

    for (var i = 0; i < 1000000; i++) {
        console.log('write', i + ': banana hong!')
        await ps.write(i + ': banana hong!');
        var data = await ps.read()
        console.log('read', data)
        // await sleep(100)
    }
}

start()