import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useEthereumProvider } from '../hooks/useEthereumProvider';
import { useNftPort } from '../hooks/useNftPort';

export default function AdminTable() {
  const { account, active, chainId } = useWeb3React();
  const { ethereumProvider } = useEthereumProvider();
  const { mintNFT } = useNftPort()
  const [dataRows, setDataRows] = useState<any>([])
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    const fetch = async () => {
      if (account && ethereumProvider) {
        // const list = await readQuery(ethereumProvider, TABLE_NAME)
        // console.log('list', list)
        // setDataRows(list.rows)
      }
    }
    fetch()
  }, [account, ethereumProvider])

  const minting = async (index: number) => {
    console.log('minting', index)
    console.log('acc', account)

    if (dataRows && account) {
      const rowData = dataRows[index]
      // call nftport with minting
      await mintNFT(rowData[1], rowData[2], account)
      setSuccess('Get successful to minting..!')
    }
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-1.5 w-full inline-block align-middle">
          <div className="overflow-x border rounded-lg">
            <h2>Participation list</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                      ID
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                      Contract Address
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                      Metadata URI
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                      beneficiary Address
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                  >
                      Minting
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                { dataRows.map((row : any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium text-white-800 whitespace-nowrap">
                       {row[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-white-800 whitespace-nowrap">
                      <a href={`/admin/${row[1]}/history`}>{row[1].slice(0, 8)}...</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-white-800 whitespace-nowrap">
                      {row[2].slice(0,8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-white-800 whitespace-nowrap">
                      {row[3]}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                            onClick={() => minting(index)}
                        >
                            Minting
                        </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      { success && <>
        <div>Status</div>
        <div>{ success }</div>
        </>
      }
    </div>
  );
}