import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import Prose from '../../../components/Prose';
import projectConfig from '../../../config/projectConfig';
import HistoryList from '../../../components/HistoryList';
import { useRouter } from "next/router"

const History: NextPage = () => {
  const router = useRouter()
  const { contractAddr } = router.query
  return contractAddr ? (
    <Layout>
      <Head>
        <title>{projectConfig.nftName}</title>
      </Head>


      <div className="bg-gray-800 py-8">
        <Prose>
          <HistoryList addr={contractAddr} />
        </Prose>
      </div>
    </Layout>
  ) : <>No contract address</>;
};

export default History;
