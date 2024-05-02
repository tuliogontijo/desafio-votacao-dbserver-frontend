import PropTypes from 'prop-types'
import { Card as CardAnt, Badge, Descriptions, Divider, Button } from 'antd';
import { AimOutlined, PieChartOutlined, PlayCircleOutlined } from '@ant-design/icons';


const Card = ({ data: pauta, handleOpenSession, HandleGetResult, HandleVote }) => {

  const dateFormatted = new Date(pauta.createdAt).toLocaleDateString("pt-br");
  let session = {};
  let badgeContent = {};

  if (pauta.statusSession === "CRIADA") {
    session = {
      status: "criada",
      actionIcon: <PlayCircleOutlined />,
      actionText: "Abrir Sessão",
      func: handleOpenSession
    };
    badgeContent = { text: "Criada", color: "orange" }
  } else if (pauta.statusSession === "ABERTA") {
    session = {
      status: "aberta",
      actionIcon: <AimOutlined />,
      actionText: "Votar",
      func: HandleVote
    };
    badgeContent = { text: "Aberta", color: "green" }
  } else {
    session = {
      status: "fechada",
      actionIcon: <PieChartOutlined />,
      actionText: "Ver Resultado",
      func: HandleGetResult
    };
    badgeContent = { text: "Fechada", color: "red" }
  }

  const OppeningClosingItems = [
    {
      key: '1',
      label: 'Abertura',
      children: <>{pauta.sessionOpennigDateTime?.toLocaleString()}</>,
    },
    {
      key: '2',
      label: 'Fechamento',
      children: <>{pauta.expirationDateTime?.toLocaleString()}</>,
    }
  ];


  return (
    <Badge.Ribbon text={badgeContent.text} color={badgeContent.color} >
      <CardAnt
        title={<p style={{ paddingTop: 16 }}>{pauta.title}</p>}
        bordered={false}
        actions={[
          <div
            key={pauta.id}
            style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 16 }}
          >
            <Button
              type="primary"
              icon={session.actionIcon}
              style={{ width: 200 }}
              onClick={session.func}
            >
              {session.actionText}
            </Button>
          </div>,
        ]}
      >
        <div>
          <p>{pauta.description}</p>
          {session.status !== "criada" && <>
            <Divider />
            <Descriptions title="Sessão" bordered style={{ padding: 0 }} items={OppeningClosingItems} />
          </>}
          <p style={{ textAlign: "right", fontSize: 12, marginBottom: -20, }}>Pauta criada em {dateFormatted}</p>
        </div>

      </CardAnt >
    </Badge.Ribbon>
  )
}

Card.propTypes = {
  data: PropTypes.object.isRequired,
  handleOpenSession: PropTypes.func.isRequired,
  HandleGetResult: PropTypes.func.isRequired,
  HandleVote: PropTypes.func.isRequired,
}


export default Card;

