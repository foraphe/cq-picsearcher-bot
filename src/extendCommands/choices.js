function run(context) {
    const reg = '\u8fd8\u662f';
    // "还是"
    const choices = context.message.substr(1, context.message.length).replace(reg, ' ').split(' ');
    if (choices.length <= 1) return;
    const randInt = parseInt(Math.random() * (choices.length - 1));
    return choices[randInt];
}

module.exports = run;