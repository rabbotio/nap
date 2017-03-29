require('./installation');
const token = 'fHq40U8zP-k:APA91bGV0Pg5bRwlp33Tr2P3U77W7LZCPvV_lXKokmxDl8OTT-l2gH8H4qYOxCTyTJlAqpxrUxJnnCUHJTxd8WwhIErY3IvmwXL03tm1Z_neZQYOWqpzlmGrR0w_VkHxYuDpf44HPN-C'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

test('When all sub removed count must be sub count equals 0', async() => {
    //remove all subs by list
    let subListResult = await getSubList(token);
    await unSubList(subListResult, token);

    subListResult = await getSubList(token);

    expect(subListResult.length).toBe(0);
});

test('When unsubbed with single sub, expected no sub', async() => {
    const topic = 'aaaa';

    await sub(topic, token);
    expect(await isSub(topic, token)).toBe(true);
    await unSub(topic, token);
    expect(await isSub(topic, token)).toBe(false);

});

test('When subbed there must be the same sub amount requested', async() => {
    const topics = ['aaaa', 'bbbb', 'cccc'];

    //3==3
    await subList(topics, token);
    let subListResult = await getSubList(token);

    expect(subListResult.length).toBe(topics.length);
});

test('When unsubbed 2 of 3, 1 must remain', async() => {

    //3-2=1
    await unSub('aaaa', token);
    await unSub('aaaa', token); //test repetition
    await unSub('cccc', token);
    subListResult = await getSubList(token);
    expect(subListResult.length).toBe(1);

});

test('When all sub removed, sub count must be 0', async() => {
    //remove all subs by list
    let subListResult = await getSubList(token);
    await unSubList(subListResult, token);

    subListResult = await getSubList(token);
    expect(subListResult.length).toBe(0);
});