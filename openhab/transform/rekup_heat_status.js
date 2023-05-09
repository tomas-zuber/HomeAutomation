(function(text) {
    var vfstatus = parseInt(text.substr(text.search('<VF>') + 4, 10))
    var ecoStatus = vfstatus >> 22 & 1
    return ecoStatus === 0 ? 'ON' : 'OFF'
})(input)