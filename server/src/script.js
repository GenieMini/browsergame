const fs = require('fs');
module.exports = {
    readJson: function(path) {
        try {
            const data = fs.readFileSync(path+'.json', 'utf8');
            return JSON.parse(data);
        } catch(err) {
            console.error(err);
        }
        return
    },
    readJson2: function(path) {
        try {
            return fs.readFileSync(path+'.json', 'utf8');
        } catch(err) {
            console.error(err);
        }
        return
    },
    writeJson: function(path, object) {
        try {
            fs.writeFileSync(path+'.json', JSON.stringify(object, null, 4));
        } catch(err) {
            console.error(err);
        }
        return
    },
    appendJson: function(path, key, object) {
        try {
            // append to object
            const obj = this.readJson(path);
            const newObj = Object.assign(obj[key], object);
            obj[key] = newObj;

            fs.writeFileSync(path+'.json', JSON.stringify(obj, null, 4));
        } catch(err) {
            // Create new object
            const newUser = { 'cash': 0, 'x': 0, 'y': 0 };
            const obj = this.readJson(path);
            const newObj = Object.assign(newUser, object);
            obj[key] = newObj;

            fs.writeFileSync(path+'.json', JSON.stringify(obj, null, 4));
        }
        return
    }
};