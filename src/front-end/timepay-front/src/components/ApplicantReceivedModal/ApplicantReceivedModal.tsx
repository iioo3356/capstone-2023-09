import { Button, Form, Input, message, Modal, Space, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useQueryClient } from 'react-query';
import {
  cssModalFooter,
  cssRegisterModal,
} from './ApplicantReceivedModalstyle';
import useFontSize from '../../hooks/useFontSize';
import { IApplicant } from '../../api/interfaces/IApplicant';
import {
  useGetApplicant,
  useGetApplicantWaiting,
} from '../../api/hooks/applicant';

export interface AgentModalProps {
  applicants?: IApplicant[];
  isOpen: boolean;
  onCancel: () => void;
}

interface DataType {
  key: React.Key;
  appliUid: number;
  appliName: string;
}

const ApplicantReceivedModal = ({
  applicants,
  isOpen,
  onCancel,
}: AgentModalProps) => {
  const queryClient = useQueryClient();
  const { scaleValue } = useFontSize();
  const [messageApi, contextHolder] = message.useMessage();

  const { data } = useGetApplicantWaiting();
  const [selectedApplicantUID, setSelectedApplicantUID] = useState<any>();

  const dataSource = data?.data.applicant || [];

  const onFinish = useCallback(() => {
    console.log('test');
  }, []);

  const onAcceptClick = useCallback(() => {
    if (selectedApplicantUID) {
      console.log('selectedApplicantUID :', selectedApplicantUID);
    } else {
      messageApi.open({
        type: 'warning',
        content: '받은 신청을 선택해주세요',
      });
    }
  }, [messageApi, selectedApplicantUID]);

  const onRejectClick = useCallback(() => {
    if (selectedApplicantUID) {
      console.log('selectedApplicantUID :', selectedApplicantUID);
    } else {
      messageApi.open({
        type: 'warning',
        content: '받은 신청을 선택해주세요',
      });
    }
  }, [messageApi, selectedApplicantUID]);

  const rowSelection = {
    columnWidth: '20px',
    onChange: (selectedRowKeys: React.Key[], selectedRows: IApplicant[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
      setSelectedApplicantUID(selectedRowKeys);
    },
  };

  const columns = [
    {
      title: 'appliUid',
      dataIndex: 'appliUid',
      key: 'appliUid',
      width: 10,
    },
    {
      title: 'appliName',
      dataIndex: 'appliName',
      key: 'appliName',
      width: 30,
    },
  ];

  const footer = useMemo(() => {
    return (
      <>
        <div className="space-align-block" css={cssModalFooter(scaleValue)}>
          <Space align="center" size={10}>
            <Button
              className="agentRegister"
              onClick={onAcceptClick}
              type="primary"
            >
              수락
            </Button>
            <Button
              className="agentReject"
              onClick={onRejectClick}
              type="primary"
            >
              거절
            </Button>
            <Button className="agentDelete" onClick={onCancel} type="primary">
              취소
            </Button>
          </Space>
        </div>
      </>
    );
  }, [onAcceptClick, onCancel, scaleValue]);

  return (
    <Modal
      title={'받은 신청 목록'}
      onCancel={onCancel}
      open={isOpen}
      footer={footer}
      width={700}
      closable={false}
      css={cssRegisterModal(scaleValue)}
    >
      {contextHolder}
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        dataSource={dataSource}
        rowKey="appliUid"
        columns={columns}
        showHeader={false}
        pagination={false}
        scroll={{ y: 240 }}
      />
    </Modal>
  );
};
export default ApplicantReceivedModal;
