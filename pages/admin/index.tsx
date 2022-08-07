import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Prose from '../../components/Prose';
import AdminTable from '../../components/AdminTable';
import projectConfig from '../../config/projectConfig';

const Admin: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>{projectConfig.nftName}</title>
      </Head>


      <div className="bg-gray-800 py-8">
        <Prose>
          <AdminTable />
        </Prose>
      </div>
    </Layout>
  );
};

export default Admin;
