exports.getDate = () =>{
    const today = new Date();
    let options = { weekday: 'long', month: 'long', day: 'numeric' }
    return today.toLocaleDateString('en-us', options);
}

exports.getDay = () =>{
    const today = new Date();
    let options = { weekday: 'long'}
    return today.toLocaleDateString('en-us', options);
}