# Store Dapplets on IPFS

> WIP

> NOTE: you must be running [IPFS Desktop](https://ipfs.tech/#install) and its 'API' port should be set to 5001
> <img width="319" alt="Screen Shot 2022-09-04 at 5 30 55 PM" src="https://user-images.githubusercontent.com/62122206/188334323-4f8d82a8-c4b1-43c1-9d3a-c2911ec77168.png">

### Example usage:

```
yarn dapplet-push <build-file-path>
```

So, in the root of your dapplet file...

1. create the build file ...

```
rm -rf ./dist && pilet build && pilet pack --target ./dist
```

2. push files to ipfs

```
yarn dapplet-push ./dist/counter-1.0.1.tgz
```

This will publish the files into a hash-linked ipfs folder like:

- IPFS CID `Qm..`
  - PiletMetadata object
    - meta.link CID `Qm..`
      - build files (index.js, .css, etc)

### Extra details:

PiletMetadata types:

```
interface PiletApiResponse {
  items: Array<PiletMetadata>;
}

interface PiletMetadataV0 {
  name: string;
  version: string;
  content?: string;
  link?: string;
  hash: string;
  noCache?: boolean | string;
  custom?: any;
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
}

interface PiletMetadataV1 {
  name: string;
  version: string;
  link: string;
  requireRef: string;
  integrity?: string;
  custom?: any;
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
}

interface PiletMetadataV2 {
  name: string;
  version: string;
  link: string;
  requireRef: string;
  integrity?: string;
  spec: 'v2';
  custom?: any;
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
}

type PiletMetadata = PiletMetadataV0 | PiletMetadataV1 | PiletMetadataV2;
```

see [Piral Feed Spec](https://docs.piral.io/reference/specifications/feed-api-specification) for more info.
