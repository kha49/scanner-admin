import './App.css';
import { Button, Table, Modal } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
export const BASE_URL = 'http://54.151.167.57:4000/api/v1'

function App() {
  const [keyList, setKeyList] = useState([])
  const [dataList, setDataList] = useState([])
  const [detail, setDetail] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getData = async () => {
    try {
      const data = await axios.get(`${BASE_URL}/user-active/get-all`)
      if (data) {
        let key = Object.keys(data.data.data).map(item => {
          return {
            key: item
          }
        })
        setKeyList(key.reverse())
        setDataList(data.data.data)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const showDetail = (record) => {
    setDetail(dataList[record.key])
    setIsModalOpen(true);
  }
  
  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'action',
      dataIndex: '',
      key: '',
      render: (record) => <Button onClick={() => showDetail(record)} type="primary">Chi tiết</Button>,
    },
  ];

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const createKey = async () => {
    try {
      const data = await axios.post(`${BASE_URL}/user-active/create-user-active-by-admin`)
      if (data) {
        getData()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="App">
      <Button type="primary" onClick={() => createKey()}>Tạo key</Button>
      <div className='table'>
        <Table dataSource={keyList} columns={columns} />
      </div>
      <Modal title="Thông tin chi tiết" open={isModalOpen} onOk={handleOk} onCancel={handleOk}>
        {
          detail.map(item => {
            return(
              <div key={item} className='key-item'>
                <div className='address'>
                  <b>Address:</b> {item.walletIds.address}
                </div>
                <div className='mnemonic'>
                  <b>Mnemonic:</b> {item.walletIds.mnemonic.split('|').join(' ')} 
                </div>
                <div className='private-key'>
                  <b>PrivateKey:</b> {item.walletIds.privateKey}
                </div>
              </div>
            )
          })
        }
      </Modal>
    </div>
  );
}

export default App;
