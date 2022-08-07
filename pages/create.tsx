import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import Prose from '../components/Prose';
import projectConfig from '../config/projectConfig';
import CreateCollection from '../components/CreateCollection';

const Create: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>{projectConfig.nftName}</title>
      </Head>

      <div className="bg-gray-800 py-8">
        <Prose>
          <h1 className="text-5xl font-bold mb-2">{projectConfig.nftName}</h1>
          <p className="text-xl">
            It operates on the polygon mumbai testnet.
          </p>
        </Prose>
      </div>

      <div className="bg-black py-8">
        <Prose>
          <CreateCollection />
        </Prose>
      </div>
    </Layout>
  );
};

export default Create;
