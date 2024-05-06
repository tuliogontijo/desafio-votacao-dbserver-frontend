import PropTypes from 'prop-types';
import { Card as CardAnt, Badge, Descriptions, Divider, Button, Popover, Progress } from 'antd';
import { AimOutlined, LoadingOutlined, PieChartOutlined, PlayCircleOutlined } from '@ant-design/icons';

import { formatDate } from '../../utils';
import { useState } from 'react';

const Card = ({ pauta, handleOpenSession, handleGetResult, handleVote, getPartialVotes }) => {
  const [parcialResult, setParcialResult] = useState({});
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  let session = {};
  let badgeContent = {};

  if (pauta.statusSession === 'CRIADA') {
    session = {
      status: 'criada',
      actionIcon: <PlayCircleOutlined />,
      actionText: 'Abrir Sessão',
      func: handleOpenSession,
    };
    badgeContent = { text: 'Criada', color: 'orange' };
  } else if (pauta.statusSession === 'ABERTA') {
    session = {
      status: 'aberta',
      actionIcon: <AimOutlined />,
      actionText: 'Votar',
      func: handleVote,
    };
    badgeContent = { text: 'Aberta', color: 'green' };
  } else {
    session = {
      status: 'fechada',
      actionIcon: <PieChartOutlined />,
      actionText: 'Ver Resultado',
      func: handleGetResult,
    };
    badgeContent = { text: 'Fechada', color: 'red' };
  }

  const OppeningClosingItems = [
    {
      key: '1',
      label: 'Abertura',
      children: <>{pauta.sessionOpennigDateTime}</>,
    },
    {
      key: '2',
      label: 'Fechamento',
      children: <>{pauta.expirationDateTime}</>,
    },
  ];

  const handleOpenPopover = async (isOpen) => {
    if (isOpen) {
      setIsLoadingResult(true);

      await getPartialVotes()
        .then((result) => {
          const resultWithPercent = {
            ...result,
            percentYes: result.votesYes ? (result.votesYes / (result.votesNo + result.votesYes)) * 100 : 0,
            percentNo: result.votesNo ? (result.votesNo / (result.votesNo + result.votesYes)) * 100 : 0,
          };
          setParcialResult(resultWithPercent);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoadingResult(false);
        });
    }
  };

  const contentPopover = isLoadingResult ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 48,
      }}
    >
      <LoadingOutlined spin />
    </div>
  ) : (
    <>
      <div>
        Sim: {parcialResult.votesYes}
        <Progress percent={parcialResult.percentYes} showInfo={false} strokeColor='#1677ff' />
      </div>
      <div>
        Não: {parcialResult.votesNo}
        <Progress percent={parcialResult.percentNo} showInfo={false} strokeColor='#1677ff' />
      </div>
    </>
  );

  return (
    <Badge.Ribbon text={badgeContent.text} color={badgeContent.color} placement='start'>
      <CardAnt
        title={<p style={{ paddingTop: 20 }}>{pauta.title}</p>}
        bordered={false}
        actions={[
          <div key={pauta.id} style={{ display: 'flex', justifyContent: 'center', fontSize: 16 }}>
            <Button type='primary' icon={session.actionIcon} style={{ width: 200 }} onClick={session.func}>
              {session.actionText}
            </Button>
          </div>,
        ]}
      >
        <>
          <p>{pauta.description ? pauta.description : 'Sem descrição...'}</p>
          {pauta?.statusSession !== 'CRIADA' && (
            <>
              <Divider />
              <Descriptions
                title='Sessão'
                bordered
                style={{ padding: 0 }}
                items={OppeningClosingItems}
                extra={
                  pauta?.statusSession === 'ABERTA' && (
                    <Popover
                      title='Votação parcial'
                      content={contentPopover}
                      trigger='click'
                      placement='bottom'
                      onOpenChange={handleOpenPopover}
                    >
                      <Button type='primary'>Votos Computados</Button>
                    </Popover>
                  )
                }
              />
            </>
          )}
          <Divider />
          <p style={{ textAlign: 'end', fontSize: 12, marginBottom: 0 }}>
            Pauta criada em {formatDate(pauta.createdAt)}
          </p>
        </>
      </CardAnt>
    </Badge.Ribbon>
  );
};

Card.propTypes = {
  pauta: PropTypes.object.isRequired,
  handleOpenSession: PropTypes.func.isRequired,
  handleGetResult: PropTypes.func.isRequired,
  handleVote: PropTypes.func.isRequired,
  getPartialVotes: PropTypes.func.isRequired,
};

export default Card;
