# Store Pilets on IPFS

### Example usage:
```
yarn ipfs-pilets-push <build-file-path>
```

So, in the root of your pilet file...
1. create the build file ...

```
rm -rf ./dist && pilet build && pilet pack --target ./dist
```
2. push files to ipfs
```
yarn ipfs-pilets-push ./dist/counter-1.0.1.tgz
```

This will push the files into a hash-linked folder like:

* IPFS CID `Qm..`
  * PiletMetadata object
    * meta.link CID `Qm..`
      * build files (index.js, .css, etc)

