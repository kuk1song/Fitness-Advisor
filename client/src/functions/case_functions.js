export function camelToTitle(text) {
    // ======= change from 'camelCase' to 'Title Case' ========
    let space = true;
    let result = text.charAt(0).toUpperCase();
    for (let index = 1; index < text.length; index++) {
        const char = text.charAt(index);
        // If the current character is upper case and before this is not space
        if(char === char.toUpperCase() && !space) {
        result += " "+char;
        }
        else {
        result += char;
        }
        
        if(char === " ") {
        space = true;
        }
        else {
        space = false;
        }
    }
    return result
}