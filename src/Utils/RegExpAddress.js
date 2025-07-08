

export const RegExpAddress = (address) => {
    // let regEx = /.+,\s*?.+,\s*?.+,\s*?.+/;
    let count = (address.match(/,/g) || "").length

    return count !== 2 ? false : true
}