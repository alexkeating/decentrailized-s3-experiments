import { skynet } from './app/skynet';
import { SkynetClient, genKeyPairFromSeed } from '@skynetlabs/skynet-nodejs';

console.log(`Running ${skynet()}`);

// Test skynet as S3
//
// Server will have a wallet and control uploading data
// to a skynet link. The client will consume from that skynet
// link

const seed = process.env['SEED'];
const dataKey = process.env['DATAKEY'];

const main = async () => {
  const client = new SkynetClient('https://siasky.net/');
  const skylink = await client.uploadFile('./apps/skynet/files/example.json');
  console.log(skylink);
  const skylinkUrl = await client.getSkylinkUrl(skylink, {
    subdomain: true,
  });

  const { publicKey, privateKey } = genKeyPairFromSeed(seed);
  const [entryUrl, resolverSkylink] = await Promise.all([
    client.registry.getEntryUrl(publicKey, dataKey),
    client.registry.getEntryLink(publicKey, dataKey),
    client.db.setDataLink(privateKey, dataKey, skylink),
  ]);
  const resolverUrl = await client.getSkylinkUrl(resolverSkylink, {
    subdomain: true,
  });
  console.log(resolverUrl);
};

main();
