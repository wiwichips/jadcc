module.declare(function(require,exports,module){const PACKAGE_NAME = 'memfs';const PACKAGE_SHARDS = 1;

    const downloadShards = async function downloadShards(packageName = PACKAGE_NAME, shardCount = PACKAGE_SHARDS) {

        progress();

        async function _loadPackage(moduleProvideArray) {

            return await new Promise((resolve, reject) => {

                try {

                    module.provide(moduleProvideArray, () => {

                        resolve();
                    });

                } catch(myError) {

                    reject(myError);
                };
            });
        }

        for (let i = 0; i < shardCount; i++) {

            const shardName = packageName + '-shard-' + i;
            const shardPath = 'aitf-' + packageName + '/' + shardName;

            await _loadPackage([shardPath]);

            progress();
        }

        return 0;
    }

    const decodeShards = async function decodeShards(packageName = PACKAGE_NAME, shardCount = PACKAGE_SHARDS) {

        var globalObj = (typeof self !== 'undefined') ? self : ( (typeof window !== 'undefined') ? window : ( (typeof global !=='undefined') ? global : globalThis ));

        var pako = globalObj.pako;
        if (typeof pako === 'undefined') {
            pako = require('pako');
            globalObj.pako = pako;
        }

        progress();
        
        async function _requirePackage(packageName) {

            const thisPackage = await require(packageName);

            return thisPackage;
        }

        async function _loadBinary(base64String) {

            let binaryString = await atob(base64String);

            const binaryLength = binaryString.length;

            let binaryArray = new Uint8Array(binaryLength);

            for(let i = 0; i < binaryLength; i++) {

              binaryArray[i] = binaryString.charCodeAt(i);
            }

            return binaryArray;
        }

        let packageInflator = new pako.Inflate();

        for (let i = 0; i < shardCount; i++) {

            const shardName = packageName + '-shard-' + i;

            let shardData = await _requirePackage(shardName).SHARD_DATA;

            let shardArray = await _loadBinary(shardData);

            progress();

            packageInflator.push(shardArray);
        }

        let inflatorOutput = packageInflator.result; // this is good, everything after it gets weird

        progress();
/*
        let stringShards = shardCount;

        const stringChunkLength = Math.ceil(inflatorOutput.length / stringShards);

        let inflateArray = [...Array(stringShards)].map(x => []);

        for (let i = 0; i < stringShards; i++) {

            const shardStart = i * stringChunkLength;

            let stringShardData = inflatorOutput.slice(shardStart, shardStart + stringChunkLength);

            let inflateString = '';

            const stringCharLimit = 9999;

            for (let j = 0; j < Math.ceil(stringShardData.length / stringCharLimit); j++) {

                let stringSlice = stringShardData.slice( (j * stringCharLimit), (j + 1) * stringCharLimit );

            	inflateString += String.fromCharCode.apply( null, new Uint16Array( stringSlice ) );
            }

            inflateArray[i] = inflateString;

            progress();
        }
        let finalString = await inflateArray.join('');

        let myFunction = await new Function(finalString);

        return myFunction;
*/

        progress();

        return inflatorOutput;
    }

    const deshardPackage = async function deshardPackage(packageName = PACKAGE_NAME, shardCount = PACKAGE_SHARDS) {

        await downloadShards(packageName, shardCount);

        let decodedFunction = await decodeShards(packageName, shardCount);

        return decodedFunction;
    }

    exports.download = downloadShards;
    exports.decode = decodeShards;
    exports.deshard = deshardPackage;
});
