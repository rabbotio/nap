const token1 = 'fHq40U8zP-k:APA91bGV0Pg5bRwlp33Tr2P3U77W7LZCPvV_lXKokmxDl8OTT-l2gH8H4qYOxCTyTJlAqpxrUxJnnCUHJTxd8WwhIErY3IvmwXL03tm1Z_neZQYOWqpzlmGrR0w_VkHxYuDpf44HPN-C'
const token2 = 'c0SWsJKzY04:APA91bHkLsVziAqedvvcxVfjzv6d2VFaQA9uZujnBLbdeRK1CR8rrQRF28CeOVvx9PQDe_gZ7mgYILETkvBRbbxQ8uuq6F3i5lJ07F8F9PILXhN5FiMQ4n6fwGim93inMwz4F-m2Iyy6'

const tokenList = [token1, token2]


const {
    sub,
    subList,
    subDeviceList,
    unSub,
    unSubList,
    unSubDeviceList,
    pubTopic,
    pubDevice,
    getSubList,
    isSub
} = require('../installation');

test('When all sub removed count must be sub count equals 0', async() => {
    //remove all subs by list
    let subListResult = await getSubList(token1);
    await unSubList(subListResult, token1);

    subListResult = await getSubList(token1);

    expect(subListResult.length).toBe(0);
});

test('When unsubbed with single sub, expected no sub', async() => {
    const topic = 'aaaa';

    await sub(topic, token1);
    expect(await isSub(topic, token1)).toBe(true);
    await unSub(topic, token1);
    expect(await isSub(topic, token1)).toBe(false);

});

test('When subbed there must be the same sub amount requested', async() => {
    const topics = ['aaaa', 'bbbb', 'cccc'];

    //3==3
    await subList(topics, token1);
    let subListResult = await getSubList(token1);

    expect(subListResult.length).toBe(topics.length);
});

test('When unsubbed 2 of 3, 1 must remain', async() => {

    //3-2=1
    await unSub('aaaa', token1);
    await unSub('aaaa', token1); //test repetition
    await unSub('cccc', token1);
    let subListResult = await getSubList(token1);
    expect(subListResult.length).toBe(1);

});

test('When all sub removed, sub count must be 0', async() => {
    //remove all subs by list
    let subListResult = await getSubList(token1);
    await unSubList(subListResult, token1);

    subListResult = await getSubList(token1);
    expect(subListResult.length).toBe(0);
});

////////////////////////////////////////////////MULTI DEVICES
test('Clear sub for 2 devices', async() => {
    //remove all subs by list
    tokenList.forEach(async(token) => {
        let subListResult = await getSubList(token);
        await unSubList(subListResult, token);
        subListResult = await getSubList(token);
        expect(subListResult.length).toBe(0);
    });

});

test('When sub by user with multiple device', async() => {
    //sub with device list
    console.time('When sub by user with multiple device')
    await subDeviceList('eee', tokenList)
    console.timeEnd('When sub by user with multiple device')

    tokenList.forEach(async(token) => {
        let subListResult = await getSubList(token);
        expect(subListResult.length).toBe(1);
    });
});

test('When unsub by user with multiple device', async() => {
    //sub with device list
    console.time('When unsub by user with multiple device')
    await unSubDeviceList('eee', tokenList)
    console.timeEnd('When unsub by user with multiple device')

    tokenList.forEach(async(token) => {
        let subListResult = await getSubList(token);
        expect(subListResult.length).toBe(0);
    });
});