const fs = require('fs');
const path = require('path');
const deferral = require('q').defer();
const async = require('async');

module.exports = function(ctx) {
    console.log('Running modify-android-gradle-plugin-version.js...');

    const platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
    const gradleFiles = [path.join(platformRoot, 'build.gradle')];
    async.each(gradleFiles, function(f, cb) {
        fs.readFile(f, 'utf8', function(err, data) {
            if (err) {
                cb(err);
                return;
            }
            // regex to replace version to 7.0.0
            const result = data.replace(/\${cordovaConfig\.AGP_VERSION}/g, '7.0.0');
            fs.writeFile(f, result, 'utf8', cb);
        });
    }, function(err) {
        if (err) {
            deferral.reject();
        } else {
            deferral.resolve();
        }

    });
    return deferral.promise;
}