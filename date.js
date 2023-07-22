const options = { weekday: 'long', month: 'long', day: 'numeric' }
exports.getDate = () =>{
    const today = new Date();
    return today.toLocaleDateString('en-us', options);
}

const options2 = { weekday: 'long'}
exports.getDay = () =>{
    const today = new Date();
    return today.toLocaleDateString('en-us', options2);
}